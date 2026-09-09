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
  const [r1] = await c.query("SELECT * FROM TbMetricaCache WHERE tipo = 'INADIMPLENCIA' AND idImovel = 98");
  console.log(r1);
  process.exit();
}
f();
