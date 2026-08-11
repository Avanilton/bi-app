import fs from "fs";
import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
  });

  const [rows] = await connection.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'novacorpconect'"
  );
  
  const tables = (rows as any[]).map(t => t.table_name || t.TABLE_NAME);
  
  fs.writeFileSync('all_tables2.json', JSON.stringify(tables, null, 2));
  console.log("Written to all_tables2.json", tables.length, "tables found.");
  
  await connection.end();
}

main().catch(console.error);
