import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import mysql from "mysql2/promise";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
const BATCH_SIZE = 5000; // Tamanho do lote de sincronização para não estourar a memória

async function runSync() {
  console.log("==========================================");
  console.log(`[${new Date().toLocaleString()}] Iniciando Sincronização em Produção...`);
  console.log("==========================================");

  let connection;
  try {
    // 1. Conexão ao MySQL da Novacorp
    console.log("-> Conectando ao MySQL da Novacorp...");
    connection = await mysql.createConnection({
      host: "sistemasnovacorp.com.br",
      port: 5643,
      user: "Intelligence",
      password: "@bv2026@",
      database: "novacorpconect",
      timezone: "-03:00",
    });
    console.log("-> Conectado com sucesso!");

    // 2. Sincronizar Imóveis (Tabela Pai)
    await syncTable(
      connection, 
      "TbImovel", 
      "idEmpresa, idImovel, nomeFantasia, cnpj", 
      async (rows) => {
        // Como o SQLite não tem "createMany" com "skipDuplicates" otimizado dependendo da versão, 
        // e o upsert em loop pode ser lento para milhões, 
        // a transação acelera bastante a inserção de lotes.
        await prisma.$transaction(
          rows.map((row: any) => 
            prisma.tbImovel.upsert({
              where: { idEmpresa_idImovel: { idEmpresa: row.idEmpresa, idImovel: row.idImovel } },
              update: { nomeFantasia: row.nomeFantasia, cnpj: row.cnpj },
              create: { idEmpresa: row.idEmpresa, idImovel: row.idImovel, nomeFantasia: row.nomeFantasia, cnpj: row.cnpj }
            })
          )
        );
      }
    );

    // Sincronização de Clientes e Boletos foi removida temporariamente a pedido do usuário

    console.log("==========================================");
    console.log(`[${new Date().toLocaleString()}] Sincronização finalizada com SUCESSO!`);
    console.log("==========================================");

  } catch (error) {
    console.error("==========================================");
    console.error(`[${new Date().toLocaleString()}] ERRO FATAL NA SINCRONIZAÇÃO:`);
    console.error(error);
    console.error("==========================================");
  } finally {
    if (connection) {
      await connection.end();
    }
    await prisma.$disconnect();
  }
}

// Função auxiliar genérica para paginar tabelas grandes
async function syncTable(
  connection: mysql.Connection, 
  tableName: string, 
  columns: string, 
  processBatch: (rows: any[]) => Promise<void>
) {
  console.log(`\nSincronizando tabela: ${tableName}...`);
  
  // Verifica total de registros (opcional, apenas para log)
  const [countResult] = await connection.execute(`SELECT COUNT(*) as total FROM ${tableName}`);
  const total = (countResult as any)[0].total;
  console.log(`Total de registros na origem: ${total}`);

  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    console.log(`  -> Baixando lote (${offset} até ${offset + BATCH_SIZE})...`);
    
    const [rows] = await connection.execute(
      `SELECT ${columns} FROM ${tableName} LIMIT ${BATCH_SIZE} OFFSET ${offset}`
    );

    const data = rows as any[];
    
    if (data.length === 0) {
      hasMore = false;
      break;
    }

    // Processa lote (upsert)
    await processBatch(data);
    console.log(`  -> Salvos ${data.length} registros com sucesso.`);
    
    offset += BATCH_SIZE;
  }
  
  console.log(`Tabela ${tableName} concluída!\n`);
}

runSync();
