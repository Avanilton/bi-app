import "dotenv/config";
import mysql from "mysql2/promise";

async function checkTables() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
  });
  
  // List all tables that might relate to acordos/agreements
  const [tables] = await connection.execute("SHOW TABLES");
  const all = (tables as any[]).map(t => Object.values(t)[0]);
  const relevant = all.filter((t: string) => 
    t.toLowerCase().includes('acor') || 
    t.toLowerCase().includes('acordo') ||
    t.toLowerCase().includes('antecip') ||
    t.toLowerCase().includes('negoc')
  );
  
  console.log("All relevant tables:", relevant);
  
  await connection.end();
}
checkTables().catch(console.error);
