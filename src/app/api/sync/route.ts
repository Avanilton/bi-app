import { NextResponse } from "next";
import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

export async function POST() {
  let connection;

  try {
    // Conecta ao banco de dados remoto da Novacorp
    connection = await mysql.createConnection({
      host: "sistemasnovacorp.com.br",
      port: 5643,
      user: "Intelligence",
      password: "@bv2026@",
      database: "novacorpconect",
      timezone: "-03:00", // America/Sao_Paulo
    });

    console.log("Conectado ao MySQL da Novacorp com sucesso!");

    // ATENÇÃO: Devido ao grande volume de dados (milhões de registros),
    // fazer o sync completo em uma única chamada de API pode causar "Timeout".
    // Aqui demonstramos a sincronização importando um limite de registros para teste.
    // O ideal seria criar um "Worker" ou script externo rodando em Node puro (cron job).

    // 1. Sincronizar Imóveis (Condomínios)
    const [imoveis] = await connection.execute(
      "SELECT idEmpresa, idImovel, nomeFantasia, cnpj FROM TbImovel"
    );

    let syncCountImoveis = 0;
    for (const imovel of imoveis as any[]) {
      await prisma.tbImovel.upsert({
        where: {
          idEmpresa_idImovel: {
            idEmpresa: imovel.idEmpresa,
            idImovel: imovel.idImovel,
          }
        },
        update: {
          nomeFantasia: imovel.nomeFantasia,
          cnpj: imovel.cnpj,
        },
        create: {
          idEmpresa: imovel.idEmpresa,
          idImovel: imovel.idImovel,
          nomeFantasia: imovel.nomeFantasia,
          cnpj: imovel.cnpj,
        }
      });
      syncCountImoveis++;
    }
    
    // 2. Aqui você pode adicionar as lógicas para sincronizar TbCliente, TbBoleto, etc.
    // Exemplo genérico:
    /*
    const [clientes] = await connection.execute("SELECT * FROM TbCliente LIMIT 100");
    for (const cli of clientes as any[]) {
      await prisma.tbCliente.upsert({ ... })
    }
    */

    return NextResponse.json({
      success: true,
      message: `Sincronização concluída com sucesso! Atualizados: ${syncCountImoveis} imóveis.`,
    });

  } catch (error: any) {
    console.error("Erro durante a sincronização:", error);
    return NextResponse.json(
      { success: false, message: "Falha na sincronização.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
    await prisma.$disconnect();
  }
}
