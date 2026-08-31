import "dotenv/config";
import mysql from "mysql2/promise";

async function run() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });

  const [rows] = await connection.execute(`
    SELECT idBoleto, idEmpresa, dataVecto, valorParc, total, origem, pago, cancelado, idImovel
    FROM TbBoleto
    WHERE idImovel = 1241 AND idEmpresa = 75 AND pago = 0 AND cancelado = 0
  `);

  const boletos = rows as any[];
  
  let appTotal = 0;
  const discarded = [];
  const accepted = [];

  for (const b of boletos) {
    const dataVecto = b.dataVecto ? new Date(b.dataVecto) : null;
    const isPastDue = dataVecto && dataVecto < new Date(new Date().setHours(0,0,0,0));

    if (b.idEmpresa !== 75) {
      discarded.push({ ...b, reason: "idEmpresa != 75" });
    } else if (b.origem === 5) {
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

  console.log(`Total App calculado aqui: R$ ${appTotal.toFixed(2)}`);
  
  // Diff we are looking for is ~850.54
  const diff = 850.54;
  console.log(`\nBuscando boletos descartados que somem ~${diff}...`);
  for (const d of discarded) {
      if (Math.abs(Number(d.total) - diff) < 0.10) {
          console.log(`ACHOU DESCARTE EXATO! idBoleto: ${d.idBoleto}, total: ${d.total}, motivo: ${d.reason}, dataVecto: ${d.dataVecto}`);
      }
  }

  console.log(`\nBuscando boletos aceitos que somem ~${diff}...`);
  for (const a of accepted) {
      if (Math.abs(Number(a.total) - diff) < 0.10) {
          console.log(`ACHOU ACEITO EXATO! idBoleto: ${a.idBoleto}, total: ${a.total}, origem: ${a.origem}, dataVecto: ${a.dataVecto}`);
      }
  }

  await connection.end();
}

run().catch(console.error);
