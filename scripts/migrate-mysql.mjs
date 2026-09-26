// Explicit one-off migration utility. Credentials and exports belong outside the repository.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { Client, types } from "pg";
import mariadb from "mariadb";
import { parse } from "dotenv";
import { Prisma } from "@prisma/client";

const [action, directory, snapshotName = "postgres-utc-snapshot.json"] = process.argv.slice(2);
if (!["snapshot", "import", "verify"].includes(action) || !directory || path.basename(snapshotName) !== snapshotName) {
  throw new Error("Usage: node scripts/migrate-mysql.mjs snapshot|import|verify PRIVATE_BACKUP_DIRECTORY [snapshot.json]");
}
const backupDirectory = path.resolve(directory);
const models = Prisma.dmmf.datamodel.models;
// Parents precede their foreign-key children. No foreign-key checks are disabled.
const order = ["Project", "TechItem", "ClientItem", "TeamMember", "Service", "MediaAsset", "Attachment", "ProjectService", "ContactPage", "AboutPage", "Admin", "Post", "Inquiry"];
if (models.length !== order.length || order.some((name) => !models.some((m) => m.name === name))) {
  throw new Error("Review the migration table order after a schema change.");
}
const fields = (name) => models.find((m) => m.name === name).fields.filter((f) => f.kind !== "object");
const snapshotPath = path.join(backupDirectory, snapshotName);
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, stable(value[k])]));
  return value;
};
function normalized(name, row, fromMysql = false) {
  return Object.fromEntries(fields(name).map((field) => {
    let value = row[field.name];
    if (value == null) value = null;
    else if (field.type === "DateTime") value = new Date(fromMysql ? `${value.replace(" ", "T")}Z` : value).toISOString();
    else if (field.type === "Boolean") value = Boolean(value);
    else if (field.type === "Json" && fromMysql && typeof value === "string") value = JSON.parse(value);
    return [field.name, value];
  }));
}
function digest(name, rows, fromMysql = false) {
  const sorted = rows.map((row) => JSON.stringify(stable(normalized(name, row, fromMysql)))).sort();
  return createHash("sha256").update(JSON.stringify(sorted)).digest("hex");
}

if (action === "snapshot") {
  if (fs.existsSync(snapshotPath)) throw new Error("Snapshot already exists; use a new filename.");
  const env = parse(fs.readFileSync(path.join(backupDirectory, "source.env.local")));
  // Prisma writes UTC into PostgreSQL TIMESTAMP WITHOUT TIME ZONE. pg otherwise
  // interprets those values in the exporting machine's local timezone.
  types.setTypeParser(1114, (value) => new Date(`${value.replace(" ", "T")}Z`));
  const source = new Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 15_000, statement_timeout: 30_000 });
  try {
    await source.connect();
    await source.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY");
    const snapshot = { createdAt: new Date().toISOString(), tables: {} };
    for (const name of order) snapshot.tables[name] = (await source.query(`SELECT * FROM public."${name}"`)).rows;
    await source.query("COMMIT");
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot), { flag: "wx" });
    console.log(JSON.stringify({ action, tables: Object.fromEntries(order.map((n) => [n, snapshot.tables[n].length])) }));
  } finally { await source.end(); }
} else {
  const target = JSON.parse(fs.readFileSync(path.join(backupDirectory, "mysql-target.json")));
  if (target.domain !== "noxdevs.com" || target.database !== "u547830741_noxdb") {
    throw new Error("This migration is restricted to the dedicated NOX database.");
  }
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath));
  if (order.some((name) => !Array.isArray(snapshot.tables[name]))) throw new Error("Incomplete snapshot.");
  const db = await mariadb.createConnection({ host: target.remoteHost, port: target.port, user: target.user, password: target.password, database: target.database, timezone: "+00:00", charset: "utf8mb4", dateStrings: true, autoJsonMap: false, connectTimeout: 15_000 });
  try {
    if ((await db.query("SELECT DATABASE() AS name"))[0].name !== target.database) throw new Error("Wrong target database.");
    if (action === "import") {
      for (const name of order) {
        if (Number((await db.query(`SELECT COUNT(*) AS count FROM \`${name}\``))[0].count) !== 0) {
          throw new Error("Target contains data; import refuses to overwrite existing records.");
        }
      }
      await db.beginTransaction();
      try {
        for (const name of order) {
          const columns = fields(name);
          for (const row of snapshot.tables[name]) {
            const unexpected = Object.keys(row).filter((key) => !columns.some((f) => f.name === key));
            if (unexpected.length) throw new Error(`Unmapped source columns in ${name}: ${unexpected.join(", ")}`);
            const values = columns.map((field) => {
              const value = row[field.name];
              if (value == null) {
                if (field.isRequired) throw new Error(`Missing required value: ${name}.${field.name}`);
                return null;
              }
              // Native MariaDB Date objects use the local JS timezone even when
              // the SQL session is UTC. Bind and read explicit UTC strings.
              if (field.type === "DateTime") return new Date(value).toISOString().replace("T", " ").replace("Z", "");
              if (field.type === "Json") return JSON.stringify(value);
              return value;
            });
            await db.query(`INSERT INTO \`${name}\` (${columns.map((f) => `\`${f.name}\``).join(",")}) VALUES (${columns.map(() => "?").join(",")})`, values);
          }
        }
        // Compare every field, including JSON, timestamps, relationships and password hashes,
        // before committing the import. Only counts and hashes are written to the report.
        for (const name of order) {
          const rows = await db.query(`SELECT * FROM \`${name}\``);
          if (digest(name, rows, true) !== digest(name, snapshot.tables[name])) throw new Error(`Import verification failed for ${name}`);
        }
        await db.commit();
      } catch (error) { await db.rollback(); throw error; }
    }
    const report = { verifiedAt: new Date().toISOString(), database: target.database, tables: {} };
    for (const name of order) {
      const rows = await db.query(`SELECT * FROM \`${name}\``);
      const expected = digest(name, snapshot.tables[name]);
      const actual = digest(name, rows, true);
      if (expected !== actual) throw new Error(`Source and target differ for ${name}. Do not cut over.`);
      report.tables[name] = { count: rows.length, sha256: actual };
    }
    fs.writeFileSync(path.join(backupDirectory, `verification-${snapshotName}`), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ action, verified: true, rowCount: Object.values(report.tables).reduce((sum, table) => sum + table.count, 0), tables: Object.fromEntries(Object.entries(report.tables).map(([name, table]) => [name, table.count])) }));
  } finally { await db.end(); }
}
