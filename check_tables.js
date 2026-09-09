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
  
  const [r] = await c.query('SHOW TABLES LIKE "%Acordo%"'); 
  console.log('Acordo:', r); 
  const [r2] = await c.query('SHOW TABLES LIKE "%Antecipacao%"'); 
  console.log('Antecipacao:', r2);
  
  const [r3] = await c.query('SELECT * FROM TbBoleto WHERE idBoleto IN (2094037, 2094068, 2094126, 2094132)');
  console.log(r3);
  
  process.exit();
}
f();
