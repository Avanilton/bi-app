import Database from "better-sqlite3";

const db = new Database("dev.db");

console.log("Conectado ao dev.db local.");

const rows = db.prepare(`
  SELECT idBoleto, dataVecto, total, origem, idRateio, pago, cancelado
  FROM TbBoleto
  WHERE idImovel = 542 AND pago = 0 AND cancelado = 0
`).all();

let inadimplenciaSum = 0;
let included = [];
let excluded = [];

const today = new Date();
today.setHours(23, 59, 59, 999);
const todayMs = today.getTime();

for (const b of rows as any[]) {
  const vectoMs = b.dataVecto; // No sqlite, datas normalmente sao salvas como ms
  
  // No SQLite local do Prisma, o dataVecto pode estar em outro formato, mas vamos assumir Number
  if (vectoMs <= todayMs) {
    if (b.origem !== 5 && b.origem !== 6) {
      inadimplenciaSum += b.total;
      included.push(b);
    } else {
      excluded.push(b);
    }
  }
}

console.log(`\nSoma no SQLite local: R$ ${inadimplenciaSum.toFixed(2)}`);
console.log("\nBOLETOS INCLUIDOS:");
console.table(included.map((b: any) => ({ idBoleto: b.idBoleto, total: b.total, origem: b.origem })));
