// Read-only content verification; the only POST is an invalid, empty inquiry.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { parse } from "dotenv";
import jwt from "jsonwebtoken";

const [directory, phase, snapshotName = "postgres-utc-snapshot.json"] = process.argv.slice(2);
assert.ok(directory && ["original", "read-only", "active"].includes(phase));
assert.equal(path.basename(snapshotName), snapshotName);
const snapshot = JSON.parse(fs.readFileSync(path.join(directory, snapshotName)));
const env = parse(fs.readFileSync(path.join(directory, "source.env.local")));
const admin = snapshot.tables.Admin[0];
const cookie = `df_session=${jwt.sign({ id: admin.id, username: admin.username }, env.JWT_SECRET, { expiresIn: "10m" })}`;
const origin = "https://noxdevs.com";
const report = { phase, checkedAt: new Date().toISOString(), tables: {}, pages: [], uploads: 0 };

async function request(route, options = {}) {
  return fetch(origin + route, { headers: { cookie }, redirect: "manual", signal: AbortSignal.timeout(30_000), ...options });
}
for (const [name, route] of [["Project", "/api/projects/all"], ["TechItem", "/api/tech"], ["ClientItem", "/api/clients"], ["TeamMember", "/api/team"], ["Service", "/api/services"], ["MediaAsset", "/api/media"], ["Post", "/api/posts"], ["Inquiry", "/api/inquiries"]]) {
  const response = await request(route);
  assert.equal(response.status, 200, route);
  const actual = await response.json();
  const expected = snapshot.tables[name];
  assert.deepEqual(actual.map((r) => r.id).sort(), expected.map((r) => r.id).sort(), `${name} IDs`);
  for (const row of actual) {
    const saved = expected.find((r) => r.id === row.id);
    for (const key of Object.keys(saved)) {
      if (Object.hasOwn(row, key)) assert.deepEqual(row[key], saved[key], `${name}.${key}`);
    }
  }
  report.tables[name] = actual.length;
}
for (const route of ["/en/focused", "/ar/focused", "/en/immersive/work", "/ar/creative/blog", "/dashboard", "/dashboard/posts", "/dashboard/inquiries"]) {
  assert.equal((await request(route)).status, 200, route);
  report.pages.push(route);
}
assert.equal((await request("/api/inquiries", { headers: {} })).status, 401);
assert.equal((await request("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })).status, phase === "read-only" ? 503 : 400);

const uploads = new Set();
function collect(value) {
  if (typeof value === "string" && value.startsWith("/uploads/")) uploads.add(value);
  else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === "object") Object.values(value).forEach(collect);
}
collect(snapshot.tables);
const publicRoot = path.resolve("public");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const baselinePath = path.join(directory, "live-upload-baseline.json");
const baseline = phase === "original" ? {} : JSON.parse(fs.readFileSync(baselinePath));
for (const url of uploads) {
  const pathname = decodeURIComponent(new URL(url, origin).pathname);
  const filename = path.resolve(publicRoot, `.${pathname}`);
  const relative = path.relative(publicRoot, filename);
  assert.ok(!relative.startsWith("..") && !path.isAbsolute(relative));
  const response = await request(url, { headers: {} });
  assert.equal(response.status, 200, "Referenced upload must remain available");
  // The CDN may resize/recompress images. Preserve and compare both the source
  // file and the public response independently instead of equating their bytes.
  const asset = { sourceHash: hash(fs.readFileSync(filename)), servedHash: hash(Buffer.from(await response.arrayBuffer())) };
  if (phase === "original") baseline[url] = asset;
  else assert.deepEqual(asset, baseline[url], "Referenced upload must match its pre-deployment baseline");
  report.uploads++;
}
if (phase === "original") fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2), { flag: "wx" });
fs.writeFileSync(path.join(directory, `live-${phase}-verification.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ verified: true, ...report }));
