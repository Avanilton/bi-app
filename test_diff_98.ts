import mysql from "mysql2/promise";
import fs from "fs";

async function run() {
  let c;
  console.log("Connecting...");
  while (!c) {
    try {
      c = await mysql.createConnection({
        host: 'sistemasnovacorp.com.br', port: 5643, user: 'Intelligence', password: '@bv2026@', database: 'novacorpconect', connectTimeout: 5000
      });
    } catch(e) {
      console.log("Retrying connection...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  try {
    const [rowsAll] = await c.execute(`
      SELECT idCliente, SUM(total) as sumTotal
      FROM TbBoleto 
      WHERE idImovel = 98 
        AND idEmpresa = 75
        AND pago = false 
        AND cancelado = false
        AND (origem IS NULL OR origem = 0)
        AND dataVecto <= LAST_DAY(CURDATE())
      GROUP BY idCliente
      ORDER BY idCliente ASC
    `);
    
    fs.writeFileSync('db_98_clientes.json', JSON.stringify(rowsAll, null, 2));
    console.log("Saved to db_98_clientes.json. Total clientes in DB:", (rowsAll as any[]).length);
    
    let sum = 0;
    for (let r of (rowsAll as any[])) sum += Number(r.sumTotal);
    console.log("Total sum App:", sum);
  } finally {
    await c.end();
  }
}
run();
