import "dotenv/config";
import mysql from "mysql2/promise";

async function run() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect"
  });

  console.log("Conectado! Buscando dados usando apenas o indice (covering index)...");

  // Apenas seleciona colunas que estao no indice
  const [rows] = await connection.execute(`
    SELECT total, origem, dataVecto
    FROM TbBoleto
    WHERE idEmpresa = 75 
      AND idImovel = 1241 
      AND pago = 0 
      AND cancelado = 0
  `);

  const boletos = rows as any[];
  
  let appTotal = 0;
  const discarded = [];
  const accepted = [];

  for (const b of boletos) {
    const dataVecto = b.dataVecto ? new Date(b.dataVecto) : null;
    const isPastDue = dataVecto && dataVecto < new Date(new Date().setHours(0,0,0,0));

    if (b.origem === 5) {
      discarded.push({ ...b, reason: "origem 5 (Juridico)" });
    } else if (b.origem === 3) {
      discarded.push({ ...b, reason: "origem 3 (Amigavel)" });
    } else if (!isPastDue) {
      discarded.push({ ...b, reason: "Vencimento no futuro" });
    } else {
      appTotal += Number(b.total) || 0;
      accepted.push(b);
    }
  }

  console.log(`Total App: R$ ${appTotal.toFixed(2)}`);
  
  const diff = 850.54;
  for (const a of accepted) {
      if (Math.abs(Number(a.total) - diff) < 0.10) {
          console.log(`ACHOU EXATO NO APP! total: ${a.total}, origem: ${a.origem}, dataVecto: ${a.dataVecto}`);
      }
  }

  await connection.end();
}

run().catch(console.error);
