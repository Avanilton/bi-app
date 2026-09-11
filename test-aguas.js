const { PrismaClient } = require('./prisma/generated/local-client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({url: 'file:local.db'});
const p = new PrismaClient({adapter});

async function test() {
  const lastRecord = await p.inadimplenciaDiaria.findFirst({
    orderBy: { dataExecucao: "desc" }
  });
  
  if (!lastRecord || !lastRecord.detalhes) return;
  
  let detalhes = JSON.parse(lastRecord.detalhes);
  const c = detalhes.filter(d => d.condominio.includes("AGUAS CLARAS"));
  console.log("Found matches:", c.map(x => x.condominio));
  
  // Also print the docs of each match
  c.forEach(match => {
    let allDocs = [];
    match.condominos.forEach(p => {
       if (p.documentos && p.documentos.length > 0) {
          allDocs = allDocs.concat(p.documentos);
       }
    });
    console.log(`Docs for ${match.condominio}:`, allDocs.length);
  });
  p.$disconnect();
}
test();
