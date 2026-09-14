const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '190.113.61.33',
  port: 5643,
  user: 'Intelligence',
  password: '@bv2026@',
  database: 'novacorpconect',
  connectTimeout: 5000 // 5 seconds
});

console.log("Connecting...");
connection.connect((err) => {
  if (err) {
    console.error("Connection failed: ", err.message, err.code);
    return;
  }
  console.log("Connected successfully!");
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) throw err;
    console.log('Query result: ', results[0].solution);
    connection.end();
  });
});
