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

    console.log("Searching for total in 1241 with origem = 0 and date <= 2026-08-31...");
    const [rows] = await c.execute(`
      SELECT SUM(total) as total
      FROM TbBoleto 
      WHERE idImovel = 1241 
        AND idEmpresa = 75
        AND pago = false 
        AND cancelado = false
        AND (origem IS NULL OR origem = 0)
        AND dataVecto <= LAST_DAY(CURDATE())
    `);
    console.log(rows);
    
  } catch(e) {
    console.error(e);
  } finally {
    if (c) await c.end();
  }
}
run();
