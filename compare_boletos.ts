import "dotenv/config";
import mysql from "mysql2/promise";
const fs = require('fs');

async function compareBoletos() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br", port: 5643,
    user: "Intelligence", password: "@bv2026@",
    database: "novacorpconect", timezone: "-03:00", decimalNumbers: true
  });
  
  const [rows] = await connection.execute(`
    SELECT idBoleto, total, nrParcela, idRateio, origem 
    FROM TbBoleto 
    WHERE idEmpresa = 75 AND idImovel = 760 AND idCliente = 124687
  `);
  console.log(rows);
  console.log("Done");
  await connection.end();
}
compareBoletos().catch(console.error);
