/*
 * Boots an embedded Postgres on port 5432 for local development. Idempotent —
 * reuses the same data directory across restarts. Stop with the matching
 * `stop-pg.ts` script (or just kill the process; the data persists).
 */

import EmbeddedPostgres from "embedded-postgres";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), ".pg-data");

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: "kopahi",
    password: "kopahi",
    port: 5433,
    persistent: true,
  });

  try {
    await pg.initialise();
  } catch {
    // Already initialised — that's fine.
  }
  await pg.start();
  try {
    await pg.createDatabase("kopahi");
  } catch {
    // Already exists — fine.
  }

  // eslint-disable-next-line no-console
  console.log("Postgres running on 127.0.0.1:5432  (db=kopahi user=kopahi pw=kopahi)");
  // eslint-disable-next-line no-console
  console.log("Data dir:", DATA_DIR);
  // eslint-disable-next-line no-console
  console.log("Process will stay alive — Ctrl+C to stop.");

  // Keep the process alive
  process.on("SIGINT", async () => {
    // eslint-disable-next-line no-console
    console.log("\nStopping Postgres…");
    try {
      await pg.stop();
    } catch {}
    process.exit(0);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
