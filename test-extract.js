const path = require('path');
const { PrismaClient } = require('./prisma/generated/local-client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const fs = require('fs');
const pdf = require('pdf-parse');

async function test() {
  const p = new PrismaClient({adapter: new PrismaLibSql({url: 'file:local.db'})});
  // The DB only has the parsed output, we need to download it again.
  p.$disconnect();
}
test();
