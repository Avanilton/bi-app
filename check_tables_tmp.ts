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

  const [rows] = await connection.execute("SHOW TABLES");
  console.log(rows);
  
  await connection.end();
}

main().catch(console.error);
