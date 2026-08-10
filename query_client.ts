import "dotenv/config";
import mysql from "mysql2/promise";

async function queryClient() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });
  
  console.log("Buscando boletos do GERARDO (idCliente = 98677) na producao...");
  
  const [rows] = await connection.execute(`
    SELECT idBoleto, dataVecto, pago, cancelado, origem, total, idRateio
    FROM TbBoleto 
    WHERE idEmpresa = 75 AND idImovel = 542 AND idCliente = 98677
  `);

  console.table(rows);
  await connection.end();
}

queryClient().catch(console.error);
