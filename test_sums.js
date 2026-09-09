const mysql = require('mysql2/promise');
async function f() {
  const c = await mysql.createConnection({
    host: 'sistemasnovacorp.com.br',
    port: 5643,
    user: 'Intelligence',
    password: '@bv2026@',
    database: 'novacorpconect',
    timezone: '-03:00'
  });
  
  const [rows] = await c.query("SELECT idBoleto, valorParc, total, origem, dataVecto, cancelado, pago FROM TbBoleto WHERE idEmpresa = 75 AND idImovel = 98 AND pago = 0 AND cancelado = 0 AND dataVecto <= '2026-09-03'");
  
  let sumValorParc = 0;
  let sumTotal = 0;
  for (let r of rows) {
    sumValorParc += Number(r.valorParc);
    sumTotal += Number(r.total);
  }
  
  console.log('Total boletos:', rows.length);
  console.log('Sum valorParc:', sumValorParc);
  console.log('Sum total:', sumTotal);

  // Group by origem
  const grouped = {};
  for (let r of rows) {
    if (!grouped[r.origem]) grouped[r.origem] = { count: 0, sum: 0 };
    grouped[r.origem].count++;
    grouped[r.origem].sum += Number(r.valorParc);
  }
  console.log('Grouped by origem:', grouped);
  
  process.exit();
}
f();
