# NOX database on Hostinger

The application uses Prisma's MySQL provider with the MariaDB driver. Production
connects to the database assigned to `noxdevs.com` on the same Hostinger account.

## Connection and migrations

Set `DATABASE_URL` in Hostinger's Node.js environment settings:

```text
mysql://USER:URL_ENCODED_PASSWORD@127.0.0.1:3306/DATABASE
```

Local development uses the hosting account's external database hostname and an
explicit remote-access rule for the developer's public IP. Store credentials in
`.env.local`; never commit them. Keep `JWT_SECRET` and the existing Cloudinary
variables when changing the database environment.

```sh
npx prisma generate
npx prisma migrate deploy
npm run build
```

`prisma.config.ts` selects `prisma/mysql-migrations`. The older PostgreSQL migrations
remain under `prisma/migrations` for history and rollback; do not run them on MySQL.
Deployment builds generate the Prisma client but do not automatically modify the
database. Apply reviewed migrations separately before a release that needs them.

The seven former PostgreSQL string-array columns now use JSON arrays. The Prisma
result extension preserves the application's `string[]` contract, and write paths
validate those values. Text content uses LONGTEXT to retain large Arabic and HTML
content. IDs, usernames, slugs and unique media URLs use binary collations to
preserve case-sensitive identity. Media folder searches remain case-insensitive.

The driver uses parameterized text-protocol queries because Hostinger's MariaDB
11.8 binary-protocol parameter collations break Prisma's CONCAT-based LIKE search.
Values are still escaped and bound by the driver. Dates use UTC and text uses
utf8mb4, including emoji.

## Migration and verification tools

Keep the protected backup directory outside the repository. It contains the
original `source.env.local`, a complete `postgres-utc-snapshot.json`, the original
Prisma schema, and `mysql-target.json` with connection details. The target file
uses these keys: `domain`, `database`, `user`, `password`, `remoteHost`, `port`.
Treat every file in that directory as private.

```sh
node scripts/migrate-mysql.mjs snapshot PRIVATE_DIRECTORY new-snapshot.json
node scripts/migrate-mysql.mjs import PRIVATE_DIRECTORY
node scripts/migrate-mysql.mjs verify PRIVATE_DIRECTORY
node scripts/verify-mysql.mjs PRIVATE_DIRECTORY
```

The migration utility is explicitly restricted to the dedicated NOX database.
Source snapshots run in a read-only repeatable-read transaction. Import refuses
any target with existing application rows, keeps foreign keys enabled and compares
every field before committing. Verification compares counts and canonical SHA-256
hashes of every scalar field, including JSON, timestamps and password hashes.
It neither deletes nor modifies PostgreSQL data.

The exporter parses PostgreSQL timestamps without time zones as UTC, matching
Prisma. This prevents the exporting computer's timezone from shifting timestamps.
The importer binds UTC timestamp strings and reads MariaDB with `dateStrings`,
avoiding the native driver's local-JavaScript-timezone conversion of Date objects.

The application verification script requires a current production build. It starts
local servers on ports 3182 and 3183, creates uniquely named test records, tests
authentication, content editing, relationships, uploads, inquiries, English/Arabic
pages and the write gate, then removes only its own records and upload directory.
Run this against the migration copy before production cutover, not as a routine
test against a live database. Reports go in the private backup directory.

## Production cutover

1. Create and migrate the empty target; import and verify the source snapshot.
2. Test the production build against that copy.
3. Preserve the full current environment, source commit and referenced upload files.
4. Add `NOX_MYSQL_DATABASE_URL` with the new local Hostinger connection and set
   `NOX_READ_ONLY=1`, keeping the old `DATABASE_URL` until the new release activates.
   Deploy the MySQL-compatible code. The old release ignores these two variables.
5. Verify the new release serves reads and returns 503 for API mutations. Login
   and logout remain available. Take another PostgreSQL snapshot and verify the
   target against it; reconcile any intervening writes before proceeding.
6. Set `DATABASE_URL` to MySQL, remove `DIRECT_URL`, `NOX_MYSQL_DATABASE_URL` and
   `NOX_READ_ONLY`, and retain the other original environment values. Restart and
   verify the public site and protected API access.

Hostinger's environment API replaces the entire variable set. Always send real
values from the protected backup, never the masked values returned by its list API.

## Rollback

The PostgreSQL database is retained unchanged. Before accepting new MySQL writes,
rollback can restore the prior release and original environment. After accepting
new writes, first pause mutations and reconcile those changes back to PostgreSQL;
restoring the old release alone would lose access to those new records. Keep the
original database and private snapshots until the migrated release is accepted.

Uploads are files, separate from the database. Preserve every referenced file in
`public/uploads` during deployment and continue backing up both uploads and MySQL.
