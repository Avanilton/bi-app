const mariadb = require('mariadb');

async function main() {
  const pool = mariadb.createPool({
    host: "190.113.61.33",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    connectionLimit: 5
  });
  
  try {
    console.log("Connecting directly using mariadb...");
    let conn = await pool.getConnection();
    console.log("Connected successfully!");
    const rows = await conn.query("SELECT 1 as val");
    console.log("Query Result:", rows);
    conn.release();
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}
main();
