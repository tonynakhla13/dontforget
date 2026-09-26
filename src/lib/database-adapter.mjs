import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export function createDatabaseAdapter(connectionString = process.env.NOX_MYSQL_DATABASE_URL || process.env.DATABASE_URL) {
  if (!connectionString) throw new Error("DATABASE_URL is required.");
  const url = new URL(connectionString);
  if (url.protocol !== "mysql:") {
    throw new Error("NOX requires a MySQL DATABASE_URL. See docs/mysql-migration.md.");
  }
  return new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit: 10,
    connectTimeout: 10_000,
    acquireTimeout: 15_000,
    idleTimeout: 30,
    charset: "utf8mb4",
    // The database stores UTC timestamps; use UTC regardless of the server locale.
    timezone: "+00:00",
  }, {
    // Hostinger's MariaDB 11.8 assigns a different collation to binary-protocol
    // parameters, breaking CONCAT-based LIKE searches. The driver's text
    // protocol still escapes/binds values and honors the column collation.
    useTextProtocol: true,
  });
}
