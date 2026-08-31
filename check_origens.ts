import mysql from "mysql2/promise";

async function run() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect"
  });

  console.log("Condominio 970:");
  const [rows970] = await connection.execute(`
    SELECT origem, SUM(total) as total, COUNT(*) as count
    FROM TbBoleto
    WHERE idEmpresa = 75 AND idImovel = 970 AND pago = 0 AND cancelado = 0
    GROUP BY origem
  `);
  console.log(rows970);

  console.log("Condominio 1241:");
  const [rows1241] = await connection.execute(`
    SELECT origem, SUM(total) as total, COUNT(*) as count
    FROM TbBoleto
    WHERE idEmpresa = 75 AND idImovel = 1241 AND pago = 0 AND cancelado = 0
    GROUP BY origem
  `);
  console.log(rows1241);

  await connection.end();
}

run().catch(console.error);
