import "dotenv/config";
import mysql from "mysql2/promise";

async function verifySpecificBoletosFast() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });

  const ids = [7348766, 3622010, 7348769, 6188759, 6972768, 7174688, 7348761];
  
  console.log(`Buscando ${ids.length} boletos exatos na produção...`);
  
  const [rows] = await connection.execute(`
    SELECT idBoleto, dataVecto, pago, cancelado, origem, total, idRateio
    FROM TbBoleto 
    WHERE idEmpresa = 75 AND idImovel = 542 AND idBoleto IN (${ids.join(',')})
  `);

  console.table(rows);
  await connection.end();
}

verifySpecificBoletosFast().catch(console.error);
