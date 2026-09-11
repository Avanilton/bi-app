const fs = require('fs');
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
    fs.writeFileSync('aguas_claras_dump.json', JSON.stringify(condDetalhes[0], null, 2));
  }
  p.$disconnect();
}
test();
