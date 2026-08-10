import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function getDatabaseConfig() {
  const urlStr = process.env.DATABASE_URL;
  let host = "sistemasnovacorp.com.br";
  let port = 5643;
  let user = "Intelligence";
  let password = "@bv2026@";
  let database = "novacorpconect";

  if (urlStr) {
    try {
      const u = new URL(urlStr);
      host = u.hostname || host;
      port = Number(u.port) || port;
      user = decodeURIComponent(u.username) || user;
      password = decodeURIComponent(u.password) || password;
      database = u.pathname.replace(/^\//, '') || database;
    } catch {
      // fallback
    }
  }

  return {
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 30,
    acquireTimeout: 30000,
    connectTimeout: 30000,
  };
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const config = getDatabaseConfig();
  const adapter = new PrismaMariaDb(config);
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
