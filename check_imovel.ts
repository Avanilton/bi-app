import mysql from "mysql2/promise";

async function run() {
  let c;
  try {
    c = await mysql.createConnection({
      host: 'sistemasnovacorp.com.br',
      port: 5643,
      user: 'Intelligence',
      password: '@bv2026@',
      database: 'novacorpconect'
    });

    console.log("Checking schema for TbImovel...");
    const [columns] = await c.execute(`DESCRIBE TbImovel`);
    console.log("Columns:");
    for (const col of columns as any[]) {
      if (col.Field.toLowerCase().includes('ativo') || col.Field.toLowerCase().includes('status') || col.Field.toLowerCase().includes('rescind')) {
        console.log(`- ${col.Field} (${col.Type})`);
      }
    }
    
    console.log("\nChecking idImovel = 40...");
    const [rows] = await c.execute(`SELECT * FROM TbImovel WHERE idImovel = 40 LIMIT 1`);
    if ((rows as any[]).length > 0) {
      const row = (rows as any[])[0];
      console.log("Eldorado Data:");
      for (const key of Object.keys(row)) {
        if (key.toLowerCase().includes('ativo') || key.toLowerCase().includes('status') || key.toLowerCase().includes('rescind') || row[key] === 0 || row[key] === false) {
           console.log(`- ${key}: ${row[key]}`);
        }
      }
      console.log("Full status-related fields:");
      console.log("ativo:", row.ativo);
      console.log("status:", row.status);
    }
    
  } catch(e) {
    console.error(e);
  } finally {
    if (c) await c.end();
  }
}
run();
