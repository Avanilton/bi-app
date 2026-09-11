const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const urlStr = process.env.DATABASE_URL;
let host = "sistemasnovacorp.com.br";
let port = 5643;
let user = "Intelligence";
let password = "@bv2026@";
let database = "novacorpconect";
const adapter = new PrismaMariaDb({host, port, user, password, database});
const prisma = new PrismaClient({adapter});
prisma.tbImovel.findMany({take: 5}).then(r => {
  console.log(r.map(x => x.nomeFantasia));
  prisma.$disconnect();
});
