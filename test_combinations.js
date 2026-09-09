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
  
  const [rows] = await c.query("SELECT * FROM TbBoleto WHERE idEmpresa = 75 AND idImovel = 98 AND pago = 0 AND cancelado = 0 AND dataVecto <= '2026-09-03'");
  
  // Let's test excluding some origins
  function testFilter(filterFn, name) {
    let s = 0;
    for (let r of rows) if (filterFn(r)) s += Number(r.valorParc);
    console.log(name, s);
  }
  
  testFilter(r => true, 'All');
  testFilter(r => r.origem !== 6, 'No Amigavel');
  testFilter(r => [0,1,3,5].includes(r.origem), 'Only 0,1,3,5');
  testFilter(r => [0,1,2,3,5].includes(r.origem), 'Only 0,1,2,3,5');
  testFilter(r => r.idBoleto !== 2094037, 'Exclude one 288.06');

  // Try to find ANY single boleto that makes the difference
  let target = 227539.54;
  let allSum = 227827.60924999867;
  let diff = allSum - target;
  console.log('Diff is', diff);
  
  for (let r of rows) {
    if (Math.abs(Number(r.valorParc) - diff) < 0.1) {
      console.log('Found single boleto match:', r.idBoleto, r.valorParc, r.origem);
    }
  }

  process.exit();
}
f();
