import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL = "mysql://Intelligence:%40bv2026%40@190.113.61.33:5643/novacorpconect?pool_timeout=60&connection_limit=10";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: "mysql://Intelligence:%40bv2026%40@190.113.61.33:5643/novacorpconect?pool_timeout=60&connection_limit=10&connect_timeout=60"
      }
    },
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
