const mariadb = require('mariadb');

async function run() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: 'sistemasnovacorp.com.br',
      port: 5643,
      user: 'Intelligence',
      password: '@bv2026@',
      database: 'novacorpconect'
    });

    // Verifica se a tabela já existe
    const rows = await conn.query("SHOW TABLES LIKE 'Usuario'");
    if (rows.length > 0) {
      console.log('Tabela Usuario ja existe!');
      return;
    }

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Usuario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        setor VARCHAR(100) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT NOW(),
        updatedAt DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW()
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('Tabela Usuario criada com sucesso!');
  } catch(e) {
    console.error('Erro:', e.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

run();
