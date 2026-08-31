import "dotenv/config";
import mysql from "mysql2/promise";

async function run() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect"
  });

  const [rows] = await connection.execute(`
    SELECT idBoleto, idImovel, total, cancelado, pago, origem
    FROM TbBoleto
    WHERE idBoleto = 7362020
  `);
  console.log("Result for 7362020:", rows);

  await connection.end();
}

run().catch(console.error);
