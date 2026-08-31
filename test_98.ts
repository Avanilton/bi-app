import mysql from "mysql2/promise";

async function run() {
  let c;
  try {
    c = await mysql.createConnection({
      host: 'sistemasnovacorp.com.br',
      port: 5643,
      user: 'Intelligence',
      password: '@bv2026@',
      database: 'novacorpconect'
    });

    console.log("Searching for total in 98 with app criteria...");
    const [rowsApp] = await c.execute(`
      SELECT SUM(total) as total
      FROM TbBoleto 
      WHERE idImovel = 98 
        AND idEmpresa = 75
        AND pago = false 
        AND cancelado = false
        AND (origem IS NULL OR origem = 0)
        AND dataVecto <= LAST_DAY(CURDATE())
    `);
    console.log("App Total:", (rowsApp as any)[0].total);

    console.log("Fetching all open boletos for 98 to find the difference...");
    const [rowsAll] = await c.execute(`
      SELECT idBoleto, total, dataVecto, origem, cancelado, pago
      FROM TbBoleto 
      WHERE idImovel = 98 
        AND idEmpresa = 75
        AND pago = false 
        AND cancelado = false
        AND (origem IS NULL OR origem = 0)
        AND dataVecto <= LAST_DAY(CURDATE())
      ORDER BY dataVecto ASC
    `);
    
    // Write out the result to a JSON to compare if needed.
    // Or just console.log the count
    console.log("Total boletos open in App:", (rowsAll as any[]).length);
    
    let sum = 0;
    for (let r of (rowsAll as any[])) {
       sum += Number(r.total);
    }
    console.log("Calculated sum:", sum);

  } catch(e) {
    console.error(e);
  } finally {
    if (c) await c.end();
  }
}
run();
