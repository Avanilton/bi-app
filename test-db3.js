const { PrismaClient } = require('./prisma/generated/local-client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({url: 'file:local.db'});
const p = new PrismaClient({adapter});
p.inadimplenciaDiaria.findMany().then(r => {
  console.log('Rows:', r.length);
  r.slice(0,2).forEach(row => console.log(row.id, row.dataReferencia, row.valorTotal, row.detalhes ? row.detalhes.length : 0));
  if (r.length > 0 && r[0].detalhes) {
     console.log(JSON.parse(r[0].detalhes).slice(0,2).map(x => x.condominio));
  }
  p.$disconnect();
});
