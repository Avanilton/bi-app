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
  
  const [rows] = await c.query('SELECT * FROM TbBoleto WHERE idEmpresa = 75 AND idImovel = 98 AND pago = 0 AND cancelado = 0 AND valorParc BETWEEN 288.00 AND 288.10');
  console.log(rows);
  
  const [tables] = await c.query('SHOW TABLES');
  const tableNames = tables.map(t => Object.values(t)[0]);
  
  for (let row of rows) {
    console.log('Checking boleto', row.idBoleto);
    for (let t of tableNames) {
      if (t.toLowerCase().includes('acordo') || t.toLowerCase().includes('distrato') || t.toLowerCase().includes('negociacao')) {
        try {
          const [r] = await c.query(`SELECT * FROM ${t} WHERE idBoleto = ?`, [row.idBoleto]);
          if (r.length > 0) console.log(`Found in ${t}:`, r);
        } catch (e) {}
        try {
          const [r2] = await c.query(`SELECT * FROM ${t} WHERE idCliente = ?`, [row.idCliente]);
          if (r2.length > 0) console.log(`Found client ${row.idCliente} in ${t}:`, r2.length);
        } catch (e) {}
      }
    }
  }
  
  process.exit();
}
f();
