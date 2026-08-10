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
  
  console.log("Checando os 4 boletos do 538:");
  const [rows] = await connection.execute("SELECT idBoleto, cancelado, pago, origem, valorParc FROM TbBoleto WHERE idBoleto IN (7181454, 7181493, 7000911, 7181494)");
  console.log(rows);
  
  console.log("Checando boletos abertos do 542:");
  const [rows2] = await connection.execute("SELECT idBoleto, cancelado, pago, origem, valorParc FROM TbBoleto WHERE idImovel = 542 AND cancelado = 0 AND pago = 0");
  console.log(rows2);

  await connection.end();
}

main().catch(console.error);
