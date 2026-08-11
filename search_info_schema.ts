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

  const [rows] = await connection.execute(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'novacorpconect' AND (table_name LIKE '%caixa%' OR table_name LIKE '%pgto%' OR table_name LIKE '%conta%')"
  );
  
  fs.writeFileSync('found_tables.json', JSON.stringify(rows, null, 2));
  console.log("Written to found_tables.json", rows);
  
  await connection.end();
}

main().catch(console.error);
