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
  
  const relevant = tables.filter(t => 
    t.toLowerCase().includes('caixa') || 
    t.toLowerCase().includes('pgto') || 
    t.toLowerCase().includes('conta')
  );
  
  fs.writeFileSync('found_tables2.json', JSON.stringify(relevant, null, 2));
  console.log("Written to found_tables2.json", relevant);
  
  await connection.end();
}

main().catch(console.error);
