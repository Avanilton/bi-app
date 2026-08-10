import "dotenv/config";
import mysql from "mysql2/promise";

async function checkEmpresas() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });
  
  console.log("Verificando distribuicao de idEmpresa para origem=5...");
  
  const [rows] = await connection.execute(`
    SELECT idEmpresa, COUNT(*) as count, SUM(total) as soma
    FROM TbBoleto 
    WHERE origem = 5 AND pago = 0 AND cancelado = 0
    GROUP BY idEmpresa
  `);

  console.table(rows);
  await connection.end();
}

checkEmpresas().catch(console.error);
