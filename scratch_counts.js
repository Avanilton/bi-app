const mysql = require('mysql2/promise');

async function run() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'sistemasnovacorp.com.br',
      port: 5643,
      user: 'Intelligence',
      password: '@bv2026@',
      database: 'novacorpconect'
    });
    console.log('Connected');
    
    const queries = [
      'SELECT COUNT(*) as c FROM TbImovel',
      'SELECT COUNT(*) as c FROM TbCliente',
      'SELECT COUNT(*) as c FROM TbBoleto',
      'SELECT COUNT(*) as c FROM TbAntecipacao',
      'SELECT COUNT(*) as c FROM TbDescontoAntecipacao',
    ];

    for (const q of queries) {
      const [rows] = await connection.query(q);
      console.log(q, rows[0].c);
    }

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) await connection.end();
  }
}
run();
