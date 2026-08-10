import "dotenv/config";
import mysql from "mysql2/promise";

async function debug542() {
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
  const todayStr = today.toISOString().split('T')[0] + ' 23:59:59';

  console.log("Buscando boletos abertos do imovel 542 (isso pode demorar uns 10-15s)...");
  
  const [rows] = await connection.execute(`
    SELECT idBoleto, dataVecto, valorParc, total, origem, idRateio, pago, cancelado
    FROM TbBoleto 
    WHERE idImovel = 542 AND pago = 0 AND cancelado = 0
  `);

  const boletos = rows as any[];
  
  let inadimplenciaSum = 0;
  let included = [];
  let excluded = [];

  for (const b of boletos) {
    const dataVectoDate = new Date(b.dataVecto);
    if (dataVectoDate <= today) {
      if (b.origem !== 5 && b.origem !== 6) {
        inadimplenciaSum += Number(b.total) || 0;
        included.push(b);
      } else {
        excluded.push({ ...b, reason: "origem 5 ou 6" });
      }
    } else {
      excluded.push({ ...b, reason: "dataVecto futuro (nao vencido)" });
    }
  }

  console.log(`\nSoma calculada (igual ao BI): R$ ${inadimplenciaSum.toFixed(2)}`);
  
  console.log("\nBOLETOS INCLUIDOS NA INADIMPLENCIA:");
  console.table(included.map(b => ({ idBoleto: b.idBoleto, total: b.total, dataVecto: b.dataVecto, origem: b.origem })));
  
  console.log("\nBOLETOS EXCLUIDOS:");
  console.table(excluded.map(b => ({ idBoleto: b.idBoleto, total: b.total, reason: b.reason })));

  await connection.end();
}

debug542().catch(console.error);
