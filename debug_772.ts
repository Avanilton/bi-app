import "dotenv/config";
import mysql from "mysql2/promise";

async function debug772() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });

  console.log("Buscando todos boletos em aberto para idImovel = 772...");
  
  const [rows] = await connection.execute(`
    SELECT idBoleto, dataVecto, total, origem, idEmpresa, pago, cancelado
    FROM TbBoleto 
    WHERE idImovel = 772 AND pago = 0 AND cancelado = 0
  `);

  const boletos = rows as any[];
  
  let totalApp = 0;
  let missingBoletos = [];

  for (const b of boletos) {
    // Regra do App
    if (b.idEmpresa === 75 && b.origem !== 5 && b.origem !== 6) {
      totalApp += Number(b.total) || 0;
    } else {
      if (b.origem !== 5 && b.origem !== 6) {
         missingBoletos.push({ ...b, reason: "idEmpresa != 75" });
      }
    }
  }

  console.log(`Total App calculado aqui: R$ ${totalApp.toFixed(2)}`);
  console.log(`Diff from System (168468.07): R$ ${(168468.07 - totalApp).toFixed(2)}`);
  
  const diffTarget = 781.38;
  console.log(`Buscando boletos com valor proximo a ${diffTarget}...`);
  for (const b of boletos) {
    if (Math.abs(Number(b.total) - diffTarget) < 0.05) {
      console.log("Boleto exato achado:", b);
    }
  }
  
  console.log("Boletos descartados que nao sao origem 5 ou 6:");
  console.table(missingBoletos);
  
  // Vamos ver se o sistema não filtra origem = 5 ou 6 em algum caso?
  // "Abertos S/ Acordo" é sem origem 5 e 6?
  // O PDF "inadimplencia" pode estar somando tudo?

  await connection.end();
}

debug772().catch(console.error);
