import mysql from 'mysql2/promise';
import 'dotenv/config';

async function main() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
  });

  // Regra BI atual:
  // idEmpresa = 75, pago=0, cancelado=0, (origem=0 or null), idImovel=98, dataVecto <= LAST_DAY(CURDATE())

  const [rows] = await connection.query(`
    SELECT idBoleto, total, dataVecto, origem 
    FROM TbBoleto 
    WHERE idEmpresa = 75 
      AND pago = 0 
      AND cancelado = 0 
      AND (origem IS NULL OR origem = 0)
      AND idImovel = 98
  `);

  let sumBI = 0;
  let sumOverdueToday = 0;
  
  const now = new Date();
  
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const boletos = (rows as any[]);
  const inBI = boletos.filter(b => new Date(b.dataVecto) <= lastDay);
  
  for (const b of inBI) {
    sumBI += Number(b.total) || 0;
  }

  console.log("Soma total BI (até final do mês): R$", sumBI.toFixed(2));
  
  const inOverdue = boletos.filter(b => new Date(b.dataVecto) <= now);
  for (const b of inOverdue) {
    sumOverdueToday += Number(b.total) || 0;
  }
  
  console.log("Soma total Vencidos Hoje: R$", sumOverdueToday.toFixed(2));
  
  const inOverdueYesterday = boletos.filter(b => {
     const d = new Date(b.dataVecto);
     const yesterday = new Date();
     yesterday.setDate(yesterday.getDate() - 1);
     return d <= yesterday;
  });
  
  const sumYesterday = inOverdueYesterday.reduce((acc, b) => acc + (Number(b.total) || 0), 0);
  console.log("Soma total Vencidos Ontem: R$", sumYesterday.toFixed(2));

  // Find exact combination that sums to 2447.35
  const diff = 229201.90 - 226754.55;
  console.log("Diferença esperada: R$", diff.toFixed(2));

  // Let's print out boletos from the current month to see if any matches the exact diff
  const thisMonthBoletos = boletos.filter(b => {
      const d = new Date(b.dataVecto);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  
  console.log("Boletos do mês atual:", thisMonthBoletos.map(b => ({
      idBoleto: b.idBoleto,
      total: Number(b.total),
      dataVecto: b.dataVecto
  })));

  // Tentar encontrar quais somam 2447.35
  const findSubsetSum = (arr, target) => {
    let result = [];
    const search = (index, currentSum, currentSubset) => {
      if (Math.abs(currentSum - target) < 0.01) {
        result = [...currentSubset];
        return true;
      }
      if (index >= arr.length || currentSum > target + 0.01) return false;
      
      // Include
      if (search(index + 1, currentSum + Number(arr[index].total), [...currentSubset, arr[index]])) return true;
      // Exclude
      if (search(index + 1, currentSum, currentSubset)) return true;
      
      return false;
    };
    search(0, 0, []);
    return result;
  };
  
  const subset = findSubsetSum(inBI, diff);
  if (subset.length > 0) {
      console.log("\\nBoletos que somados dão exatamente a diferença:", subset);
  } else {
      console.log("\\nNão encontrou subconjunto exato para a diferença na lista do BI.");
  }

  await connection.end();
}

main().catch(console.error);
