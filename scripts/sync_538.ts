import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import mysql from "mysql2/promise";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function runSync538() {
  console.log("Conectando ao MySQL da Novacorp...");
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });
  console.log("Conectado com sucesso!");

  console.log("Baixando Boletos do Condominio 538 para ATUALIZAR STATUS DE PAGAMENTO...");
  const [boletosRows] = await connection.execute(
    `SELECT idBoleto, idEmpresa, idImovel, idCliente, cancelado, pago, valorPago, valorParc, multa, juros, correcao, encargo, total, dataVecto, nrParcela, tarifaBancaria, totPrestacao, origem, dtEmissaoExtra, totalExtra, idRateio, dataPgto, diferenca 
     FROM TbBoleto WHERE idImovel = 538`
  );
  
  const boletos = boletosRows as any[];
  console.log(`Atualizando ${boletos.length} boletos no Prisma...`);

  let updated = 0;
  // Chunking to avoid SQLite limits
  const chunkSize = 100;
  for (let i = 0; i < boletos.length; i += chunkSize) {
    const chunk = boletos.slice(i, i + chunkSize);
    await prisma.$transaction(
      chunk.map((b) => 
        prisma.tbBoleto.upsert({
          where: { idBoleto_idEmpresa_idImovel_idCliente: { idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente } },
          update: { 
            cancelado: b.cancelado ? true : false, 
            pago: b.pago ? true : false, 
            valorPago: b.valorPago, valorParc: b.valorParc, multa: b.multa, juros: b.juros, correcao: b.correcao, encargo: b.encargo, total: b.total, dataVecto: b.dataVecto, nrParcela: b.nrParcela, tarifaBancaria: b.tarifaBancaria, totPrestacao: b.totPrestacao, origem: b.origem, dtEmissaoExtra: b.dtEmissaoExtra, totalExtra: b.totalExtra, idRateio: b.idRateio, dataPgto: b.dataPgto, diferenca: b.diferenca 
          },
          create: { 
            idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente, 
            cancelado: b.cancelado ? true : false, 
            pago: b.pago ? true : false, 
            valorPago: b.valorPago, valorParc: b.valorParc, multa: b.multa, juros: b.juros, correcao: b.correcao, encargo: b.encargo, total: b.total, dataVecto: b.dataVecto, nrParcela: b.nrParcela, tarifaBancaria: b.tarifaBancaria, totPrestacao: b.totPrestacao, origem: b.origem, dtEmissaoExtra: b.dtEmissaoExtra, totalExtra: b.totalExtra, idRateio: b.idRateio, dataPgto: b.dataPgto, diferenca: b.diferenca 
          }
        })
      )
    );
    updated += chunk.length;
    console.log(`Progresso: ${updated}/${boletos.length}`);
  }

  console.log("Sincronizacao do 538 concluida com sucesso!");
  await connection.end();
  await prisma.$disconnect();
}

runSync538().catch(console.error);
