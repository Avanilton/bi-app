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

  const [rows] = await connection.execute("SHOW TABLES LIKE '%aixa%'");
  console.log('Tabelas de caixa:', rows);

  const [rows2] = await connection.execute("SHOW TABLES LIKE '%onta%'");
  console.log('Tabelas de conta:', rows2);
  
  const [rows3] = await connection.execute("SHOW TABLES LIKE '%ipo%'");
  console.log('Tabelas de tipo:', rows3);
  
  await connection.end();
}

main().catch(console.error);
