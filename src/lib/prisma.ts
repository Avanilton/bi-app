import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { createPool } from "mariadb";

function getDatabaseConfig() {
  process.env.DATABASE_URL = "mysql://Intelligence:@bv2026@@sistemasnovacorp.com.br:5643/novacorpconect";
  
  return {
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    connectionLimit: 30,
    acquireTimeout: 30000,
    connectTimeout: 30000,
  };
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const config = getDatabaseConfig();
  const pool = createPool(config);
  const adapter = new PrismaMariaDb(pool);
  return new PrismaClient({ adapter });
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
