const mysql = require('mysql2/promise');

async function run() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'sistemasnovacorp.com.br',
      port: 5643,
      user: 'Intelligence',
      password: '@bv2026@',
      database: 'novacorpconect',
      timezone: '-03:00'
    });
    console.log('Connected');
    const [rows] = await connection.execute('SELECT idEmpresa, idImovel, nomeFantasia, cnpj FROM TbImovel LIMIT 10');
    console.log('Rows:', rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) await connection.end();
  }
}
run();
