import "dotenv/config";
import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });
  
  console.log("Executando consulta agregada pesada no MySQL...");
  const start = Date.now();
  
  // Exemplo de Inadimplencia para o condominio 538
  const [rows] = await connection.execute(`
    SELECT SUM(valorParc) as total 
    FROM TbBoleto 
    WHERE idImovel = 538 
      AND cancelado = 0 
      AND pago = 0 
      AND origem NOT IN (5, 6) 
      AND (idRateio = 0 OR idRateio IS NULL)
  `);
  
  const end = Date.now();
  console.log("Resultado:", rows);
  console.log(`Tempo da consulta: ${(end - start) / 1000} segundos`);
  
  await connection.end();
}

main().catch(console.error);
