import { createClient } from '@libsql/client';
import path from 'path';

async function main() {
  const dbPath = path.resolve(process.cwd(), "local.db");
  const client = createClient({ url: `file:${dbPath}` });
  await client.execute("PRAGMA journal_mode = WAL;");
  await client.execute("PRAGMA synchronous = NORMAL;");
  console.log("WAL mode enabled!");
  client.close();
}

main().catch(console.error);
