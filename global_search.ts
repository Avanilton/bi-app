import fs from "fs";
import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    timezone: "-03:00",
  });

  const [rows] = await connection.query(
    "SELECT table_name, table_schema FROM information_schema.tables WHERE table_name LIKE '%caixa%' OR table_name LIKE '%pgto%' OR table_name LIKE '%conta%'"
  );
  
  fs.writeFileSync('global_tables.json', JSON.stringify(rows, null, 2));
  console.log("Written to global_tables.json", (rows as any[]).length, "found.");
  
  await connection.end();
}

main().catch(console.error);
