import "dotenv/config";
import mysql from "mysql2/promise";

async function listTopCondos() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });
  
  const [rows] = await connection.execute(`
    SELECT b.idImovel, i.nomeFantasia, COUNT(b.idBoleto) as count, SUM(b.total) as soma
    FROM TbBoleto b
    LEFT JOIN TbImovel i ON b.idEmpresa = i.idEmpresa AND b.idImovel = i.idImovel
    WHERE b.idEmpresa = 75 
      AND b.origem = 5 
      AND (b.pago = 0 OR b.pago IS NULL) 
      AND (b.cancelado = 0 OR b.cancelado IS NULL) 
      AND b.nrParcela > 0 
      AND b.dataVecto <= CURDATE()
    GROUP BY b.idImovel, i.nomeFantasia
    ORDER BY soma DESC
    LIMIT 20
  `);

  console.table(rows);
  await connection.end();
}

listTopCondos().catch(console.error);
