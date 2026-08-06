import "dotenv/config";
import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });
  
  console.log("Checking boleto 7181457 in production...");
  const [rows] = await connection.execute("SELECT idBoleto, cancelado, pago, origem FROM TbBoleto WHERE idBoleto = 7181457");
  console.log(rows);
  
  console.log("Checking boleto 7181461 in production...");
  const [rows2] = await connection.execute("SELECT idBoleto, cancelado, pago, origem FROM TbBoleto WHERE idBoleto = 7181461");
  console.log(rows2);

  console.log("Checking boleto 7181472 in production...");
  const [rows3] = await connection.execute("SELECT idBoleto, cancelado, pago, origem FROM TbBoleto WHERE idBoleto = 7181472");
  console.log(rows3);

  console.log("Checking boleto 7212517 in production...");
  const [rows4] = await connection.execute("SELECT idBoleto, cancelado, pago, origem FROM TbBoleto WHERE idBoleto = 7212517");
  console.log(rows4);

  await connection.end();
}

main().catch(console.error);
