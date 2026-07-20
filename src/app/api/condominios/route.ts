import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const condominios = await prisma.tbImovel.findMany({
      select: {
        idImovel: true,
        nomeFantasia: true,
      },
      orderBy: {
        nomeFantasia: 'asc'
      }
    });

    return NextResponse.json({ success: true, data: condominios });
  } catch (error: any) {
    console.error("Erro ao buscar condomínios:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar condomínios", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
