import fs from "fs";
import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    connectTimeout: 5000,
  });

  const tests = [
    "SELECT 1 FROM tbCaixaMovi LIMIT 1",
    "SELECT 1 FROM tb_caixa_movi LIMIT 1",
    "SELECT 1 FROM TbCaixaMovi LIMIT 1",
    "SELECT 1 FROM TB_CAIXA_MOVI LIMIT 1",
    "SELECT 1 FROM caixa_movi LIMIT 1",
    "SELECT 1 FROM CaixaMovi LIMIT 1"
  ];

  for (const q of tests) {
    try {
      console.log(`Testing: ${q}`);
      await connection.execute(q);
      console.log(`SUCCESS: ${q}`);
    } catch (e: any) {
      console.log(`FAILED: ${e.message}`);
    }
  }

  await connection.end();
}

main().catch(console.error);
