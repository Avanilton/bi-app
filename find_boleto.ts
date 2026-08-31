import mysql from "mysql2/promise";

async function run() {
  try {
    const c = await mysql.createConnection({
      host: 'sistemasnovacorp.com.br',
      port: 5643,
      user: 'Intelligence',
      password: '@bv2026@',
      database: 'novacorpconect'
    });

    console.log("Searching for boletos with total ~359.62 in idImovel 1241...");
    const [rows] = await c.execute(`
      SELECT * FROM TbBoleto 
      WHERE idImovel = 1241 
      AND total >= 359.60 AND total <= 359.65
    `);
    console.log(rows);
    
    await c.end();
  } catch(e) {
    console.error(e);
  }
}
run();
