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
  const nome = "AGUAS CLARAS";
  let condDetalhes = detalhes.filter(d => {
    const docNome = (d.condominio || "").toUpperCase().trim();
    return docNome.includes(nome) || nome.includes(docNome);
  });
  
  if (condDetalhes.length > 0) {
    const c = condDetalhes[0];
    let allDocs = [];
    c.condominos.forEach(p => {
       if (p.documentos && p.documentos.length > 0) {
          allDocs = allDocs.concat(p.documentos);
       }
    });
    console.log("Total docs in AGUAS CLARAS:", allDocs.length);
    console.log("Vecto values:");
    const vectos = allDocs.map(d => d.vecto);
    console.log(vectos.slice(0, 20));
    console.log("Docs with 2025 in vecto:");
    console.log(allDocs.filter(d => String(d.vecto).includes('2025')).slice(0, 5));
  }
  p.$disconnect();
}
test();
