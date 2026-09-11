const { PrismaClient } = require('./prisma/generated/local-client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({url: 'file:local.db'});
const p = new PrismaClient({adapter});
p.inadimplenciaDiaria.deleteMany().then(() => {
  console.log('Deleted all records');
  p.$disconnect();
});
