const mysql = require('mysql2/promise');
async function f() {
  const c = await mysql.createConnection({
    host: 'sistemasnovacorp.com.br',
    port: 5643,
    user: 'Intelligence',
    password: '@bv2026@',
    database: 'novacorpconect',
    timezone: '-03:00',
    decimalNumbers: true
  });
  
  const [r1] = await c.query("SELECT COUNT(*) as qtd, SUM(valorParc) as sum_valor FROM TbBoleto WHERE idEmpresa = 75 AND idImovel = 98 AND pago = 0 AND cancelado = 0 AND dataVecto <= '2026-09-03'");
  console.log(r1);
  process.exit();
}
f();
