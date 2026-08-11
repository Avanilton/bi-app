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

  const [rows] = await connection.query("SHOW DATABASES;");
  fs.writeFileSync('databases.json', JSON.stringify(rows, null, 2));
  console.log("Databases written to databases.json");
  
  await connection.end();
}

main().catch(console.error);
