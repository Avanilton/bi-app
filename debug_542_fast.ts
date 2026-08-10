import "dotenv/config";
import mysql from "mysql2/promise";

async function debug542Fast() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const todayMs = today.getTime();

  console.log("Buscando boletos abertos do imovel 542 com idEmpresa = 75 (deve ser rapido)...");
  
  const [rows] = await connection.execute(`
    SELECT idBoleto, dataVecto, total, origem, idRateio, pago, cancelado
    FROM TbBoleto 
    WHERE idEmpresa = 75 AND idImovel = 542 AND cancelado = 0
  `);

  const boletos = rows as any[];
  
  console.log(`Foram encontrados ${boletos.length} boletos não cancelados para o 542.`);

  let totalGeral = 0;
  let totalInadimplenciaBI = 0;
  
  let abertosVencidosSemAcordo = [];
  let abertosVencidosAcordo = [];
  let abertosNoFuturo = [];
  let pagos = [];

  for (const b of boletos) {
    if (b.pago == 1) {
      pagos.push(b);
      continue;
    }
    
    totalGeral += Number(b.total);

    const dataVectoDate = new Date(b.dataVecto);
    if (dataVectoDate <= today) {
      if (b.origem !== 5 && b.origem !== 6) {
        totalInadimplenciaBI += Number(b.total) || 0;
        abertosVencidosSemAcordo.push(b);
      } else {
        abertosVencidosAcordo.push(b);
      }
    } else {
      abertosNoFuturo.push(b);
    }
  }

  console.log(`\n--- RESUMO ---`);
  console.log(`Total Inadimplencia (Regra do BI): R$ ${totalInadimplenciaBI.toFixed(2)}`);
  console.log(`Soma de todos os boletos abertos (vencidos + futuros + acordos): R$ ${totalGeral.toFixed(2)}`);
  
  console.log(`\nDetalhes dos boletos na Inadimplencia (Regra do BI):`);
  console.table(abertosVencidosSemAcordo.map(b => ({ id: b.idBoleto, valor: Number(b.total).toFixed(2), vecto: b.dataVecto.toISOString().split('T')[0], origem: b.origem })));
  
  console.log(`\nDetalhes dos boletos ABERTOS MAS NO FUTURO (Nao vencidos):`);
  console.table(abertosNoFuturo.map(b => ({ id: b.idBoleto, valor: Number(b.total).toFixed(2), vecto: b.dataVecto.toISOString().split('T')[0], origem: b.origem })));

  console.log(`\nDetalhes dos boletos ABERTOS VENCIDOS MAS ACORDO (origem 5 ou 6):`);
  console.table(abertosVencidosAcordo.map(b => ({ id: b.idBoleto, valor: Number(b.total).toFixed(2), vecto: b.dataVecto.toISOString().split('T')[0], origem: b.origem })));

  await connection.end();
}

debug542Fast().catch(console.error);
