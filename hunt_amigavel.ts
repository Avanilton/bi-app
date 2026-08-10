import "dotenv/config";
import mysql from "mysql2/promise";

async function hunt() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });
  
  console.log("Caçando a query que resulta em 3820 boletos e 2.245.020,50...");
  
  const queries = [
    {
      name: "idEmpresa = 75, só pago = 0, cancelado = 0",
      sql: "SELECT COUNT(*) as count, SUM(total) as soma FROM TbBoleto WHERE idEmpresa = 75 AND origem = 5 AND pago = 0 AND cancelado = 0 AND nrParcela > 0 AND dataVecto <= CURDATE()"
    }
  ];

  for (const q of queries) {
    const [rows] = await connection.execute(q.sql);
    console.log(`\n=== ${q.name} ===`);
    console.log(rows[0]);
  }

  await connection.end();
}

hunt().catch(console.error);
