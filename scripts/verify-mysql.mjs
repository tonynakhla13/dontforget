import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { parse } from "dotenv";
import bcrypt from "bcryptjs";
import mariadb from "mariadb";

const directory = process.argv[2];
if (!directory) throw new Error("Pass the private migration backup directory.");
const target = JSON.parse(fs.readFileSync(path.join(directory, "mysql-target.json")));
assert.equal(target.database, "u547830741_noxdb");
const env = parse(fs.readFileSync(path.join(directory, "source.env.local")));
const databaseUrl = `mysql://${encodeURIComponent(target.user)}:${encodeURIComponent(target.password)}@${target.remoteHost}:${target.port}/${target.database}`;
const marker = `nox-mysql-verification-${randomUUID()}`;
const password = randomUUID();
const db = mariadb.createPool({ host: target.remoteHost, port: target.port, user: target.user, password: target.password, database: target.database, timezone: "+00:00", charset: "utf8mb4", connectTimeout: 15_000, connectionLimit: 2, idleTimeout: 30 });
const fixtureJournal = path.join(directory, `${marker}.json`);
fs.writeFileSync(fixtureJournal, JSON.stringify({ marker }), { flag: "wx" });
const processes = [];
const checks = [];
let cookie = "";

async function start(port, readOnly = false) {
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port), "-H", "127.0.0.1"], {
    env: { ...process.env, ...env, DATABASE_URL: databaseUrl, NOX_MYSQL_DATABASE_URL: databaseUrl, NOX_READ_ONLY: readOnly ? "1" : "0" },
    stdio: ["ignore", "ignore", "ignore"], windowsHide: true,
  });
  processes.push(child);
  const origin = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 50; attempt++) {
    if (child.exitCode !== null) throw new Error("Verification server exited before it became ready.");
    try { if ((await fetch(`${origin}/api/services`, { signal: AbortSignal.timeout(5000) })).ok) return origin; } catch { /* still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("Verification server did not become ready.");
}
async function request(origin, route, { method = "GET", body, authenticated = true, status = 200 } = {}) {
  const response = await fetch(origin + route, {
    method,
    headers: { ...(authenticated && cookie ? { cookie } : {}), ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body), redirect: "manual", signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, status, `${method} ${route}`);
  console.log(`${method} ${route}: ${response.status}`);
  return response;
}

try {
  await db.query("INSERT INTO `Admin` (`id`,`username`,`passwordHash`,`createdAt`,`updatedAt`) VALUES (?,?,?,NOW(3),NOW(3))", [marker, marker, await bcrypt.hash(password, 10)]);
  const origin = await start(3182);
  await request(origin, "/api/inquiries", { authenticated: false, status: 401 });
  await request(origin, "/api/auth/login", { method: "POST", body: { username: marker.toUpperCase(), password }, status: 401 });
  await request(origin, "/api/auth/login", { method: "POST", body: { username: marker, password: "incorrect" }, status: 401 });
  const login = await request(origin, "/api/auth/login", { method: "POST", body: { username: marker, password } });
  cookie = login.headers.get("set-cookie").split(";")[0];
  assert.ok(cookie.startsWith("df_session="));
  checks.push("admin login, case-sensitive usernames, password check and unauthorized access");

  const form = new FormData();
  form.set("folder", `dontforget/${marker}`);
  form.set("file", new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aI7sAAAAASUVORK5CYII=", "base64")], { type: "image/png" }), "verification.png");
  const uploaded = await fetch(`${origin}/api/upload`, { method: "POST", headers: { cookie }, body: form, signal: AbortSignal.timeout(30_000) });
  assert.equal(uploaded.status, 200);
  const media = await uploaded.json();
  assert.ok(media.url.startsWith(`/uploads/${marker}/`));
  const longUrl = `https://example.invalid/${"x".repeat(300)}/image.png`;
  await db.query("INSERT INTO `MediaAsset` (`id`,`url`,`mimeType`,`size`,`folder`,`createdAt`,`updatedAt`) VALUES (?,?,?,1,?,NOW(3),NOW(3))", [marker, longUrl, "image/png", marker]);
  const foundMedia = await (await request(origin, `/api/media?folder=${marker.toUpperCase()}`)).json();
  assert.equal(foundMedia.length, 2);
  assert.ok(foundMedia.some((m) => m.url === longUrl));
  checks.push("file upload, long media URLs and case-insensitive folder searches");

  const service = await (await request(origin, "/api/services", { method: "POST", status: 201, body: {
    title: marker, slug: `${marker}-service`, titleAr: "خدمة تجريبية", benefits: ["عربي 😀"],
    attachments: [{ mediaId: media.mediaAsset.id, role: "hero", metadata: { locale: "ar" } }],
  } })).json();
  const project = await (await request(origin, "/api/projects", { method: "POST", status: 201, body: {
    title: marker, titleAr: "مشروع تجريبي 😀", slug: `${marker}-project`,
    tags: ["mysql", "اللغة العربية"], tagsAr: ["تصميم", "😀"], images: [longUrl, media.url],
    serviceIds: [service.id], attachments: [{ mediaId: media.mediaAsset.id, role: "gallery" }],
  } })).json();
  assert.deepEqual(project.tagsAr, ["تصميم", "😀"]);
  assert.deepEqual(project.images, [longUrl, media.url]);
  assert.equal(project.services[0].service.id, service.id);
  assert.equal(project.attachments[0].media.id, media.mediaAsset.id);
  const updated = await (await request(origin, `/api/projects/${project.id}`, { method: "PUT", body: { tags: [], tagsAr: [], images: [] } })).json();
  assert.deepEqual(updated.tags, []);
  assert.deepEqual(updated.images, []);
  checks.push("project/service CRUD, Arabic/emoji arrays, empty lists and attachment relationships");

  const content = `<p>O'Reilly "quoted" \\ literal ${"نص عربي 😀 ".repeat(12000)}</p>`;
  const post = await (await request(origin, "/api/posts", { method: "POST", status: 201, body: {
    title: marker, slug: `${marker}-post`, titleAr: "مقال تجريبي", content, contentAr: content,
    tags: ["mysql"], tagsAr: ["عربي", "😀"],
  } })).json();
  const savedPost = await (await request(origin, `/api/posts/${post.id}`)).json();
  assert.equal(savedPost.contentAr, content);
  assert.deepEqual(savedPost.tagsAr, ["عربي", "😀"]);
  checks.push("blog editing, safely bound quotes/backslashes and Arabic rich text larger than 64 KB");

  const inquiry = await (await request(origin, "/api/inquiries", { method: "POST", authenticated: false, status: 201, body: {
    name: marker, email: `${marker}@example.invalid`, message: "طلب تجريبي 😀", source: marker,
    audioUrls: ["/uploads/inquiries/audio/verification.webm"], assetNames: ["مرفق.pdf"], metadata: { language: "ar", values: [1, "😀"] },
  } })).json();
  assert.deepEqual(inquiry.assetNames, ["مرفق.pdf"]);
  const inquiries = await (await request(origin, "/api/inquiries")).json();
  assert.deepEqual(inquiries.find((i) => i.id === inquiry.id).audioUrls, inquiry.audioUrls);
  checks.push("public inquiry submission and protected dashboard retrieval");

  for (const route of ["/en/focused", "/ar/focused", "/en/immersive/work", "/ar/creative/blog", "/dashboard", "/dashboard/posts", "/dashboard/inquiries"]) {
    await request(origin, route);
  }
  checks.push("English/Arabic public pages and dashboard rendering");

  const readOnlyOrigin = await start(3183, true);
  await request(readOnlyOrigin, "/api/inquiries", { method: "POST", body: {}, authenticated: false, status: 503 });
  await request(readOnlyOrigin, "/api/projects", { method: "DELETE", authenticated: false, status: 503 });
  await request(readOnlyOrigin, "/api/services");
  checks.push("cutover write protection while public reads remain available");
  fs.writeFileSync(path.join(directory, "application-verification.json"), JSON.stringify({ verifiedAt: new Date().toISOString(), checks }, null, 2));
  console.log(JSON.stringify({ passed: true, checks }));
} finally {
  for (const child of processes) child.kill();
  const cleanup = await db.getConnection();
  await cleanup.beginTransaction();
  try {
    await cleanup.query("DELETE FROM `Project` WHERE `slug`=?", [`${marker}-project`]);
    await cleanup.query("DELETE FROM `Post` WHERE `slug`=?", [`${marker}-post`]);
    await cleanup.query("DELETE FROM `Service` WHERE `slug`=?", [`${marker}-service`]);
    await cleanup.query("DELETE FROM `Inquiry` WHERE `source`=?", [marker]);
    await cleanup.query("DELETE FROM `MediaAsset` WHERE `folder`=?", [marker]);
    await cleanup.query("DELETE FROM `Admin` WHERE `username`=? AND `id`=?", [marker, marker]);
    await cleanup.commit();
  } catch (error) { await cleanup.rollback(); throw error; }
  finally { await cleanup.release(); await db.end(); }
  const uploadsRoot = path.resolve("public/uploads");
  const fixtureDirectory = path.resolve(uploadsRoot, marker);
  assert.equal(path.dirname(fixtureDirectory), uploadsRoot);
  assert.ok(path.basename(fixtureDirectory).startsWith("nox-mysql-verification-"));
  fs.rmSync(fixtureDirectory, { recursive: true, force: true });
  fs.unlinkSync(fixtureJournal);
}
