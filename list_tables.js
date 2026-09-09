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
  
  const [tables] = await c.query('SHOW TABLES');
  console.log(tables.map(t => Object.values(t)[0]).join(', '));
  
  process.exit();
}
f();
