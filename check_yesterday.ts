import "dotenv/config";
import mysql from "mysql2/promise";

async function checkBoletos() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });

  console.log("Consultando os boletos que venceram ontem...");
  const [rows] = await connection.execute(`
    SELECT idBoleto, dataVecto, pago, cancelado, origem, total, idRateio
    FROM TbBoleto 
    WHERE idBoleto IN (7348766, 7348769, 7348761)
  `);

  console.table(rows);

  await connection.end();
}

checkBoletos().catch(console.error);
