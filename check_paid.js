const mysql = require('mysql2/promise');

async function main() {
  const c = await mysql.createConnection({
    host: 'sistemasnovacorp.com.br',
    port: 5643,
    user: 'Intelligence',
    password: '@bv2026@',
    database: 'novacorpconect',
    timezone: '-03:00'
  });

  const [r] = await c.query("SELECT SUM(total) as t FROM TbBoleto WHERE idEmpresa=75 AND pago=1 AND cancelado=0 AND idImovel=98 AND (origem IS NULL OR origem=0) AND dataPgto >= '2026-08-31'");
  console.log("Paid since Aug 31:", r[0].t);
  
  const [r2] = await c.query("SELECT SUM(total) as t FROM TbBoleto WHERE idEmpresa=75 AND pago=1 AND cancelado=0 AND idImovel=98 AND (origem IS NULL OR origem=0) AND dataPgto >= '2026-09-01'");
  console.log("Paid since Sep 1:", r2[0].t);

  const [r3] = await c.query("SELECT idBoleto, total, dataPgto FROM TbBoleto WHERE idEmpresa=75 AND pago=1 AND cancelado=0 AND idImovel=98 AND (origem IS NULL OR origem=0) AND dataPgto >= '2026-08-31'");
  console.log(r3);
  
  await c.end();
}

main().catch(console.error);
