import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import mysql from "mysql2/promise";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function fixBoletosFast() {
  console.log("1. Buscando boletos não pagos do 538 no banco LOCAL...");
  const localBoletos = await prisma.tbBoleto.findMany({
    where: { idEmpresa: 75, idImovel: 538, pago: false, cancelado: false },
    select: { idBoleto: true, idCliente: true }
  });

  if (localBoletos.length === 0) {
    console.log("Nenhum boleto local para atualizar.");
    return;
  }

  console.log(`Encontrados ${localBoletos.length} boletos em aberto no local. Buscando atualizacao exata deles...`);

  console.log("2. Conectando ao MySQL...");
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });

  const boletos = [];

  console.log("3. Buscando status oficial no MySQL (com chave composta idEmpresa + idImovel + idCliente + idBoleto)...");
  for (const b of localBoletos) {
    // Usar a chave composta completa (idEmpresa, idImovel, idCliente, idBoleto) para garantir uso de indice
    const [rows] = await connection.execute(
      `SELECT idBoleto, idEmpresa, idImovel, idCliente, cancelado, pago, valorPago, valorParc, multa, juros, correcao, encargo, total, dataVecto, nrParcela, tarifaBancaria, totPrestacao, origem, dtEmissaoExtra, totalExtra, idRateio, dataPgto, diferenca 
       FROM TbBoleto 
       WHERE idEmpresa = 75 AND idImovel = 538 AND idCliente = ${b.idCliente} AND idBoleto = ${b.idBoleto}`
    );
    if ((rows as any[]).length > 0) {
      boletos.push((rows as any[])[0]);
    }
  }
  
  console.log(`Recebidos ${boletos.length} boletos do servidor.`);

  console.log("4. Atualizando SQLite local...");
  let updatedCount = 0;
  for (const b of boletos) {
    await prisma.tbBoleto.update({
      where: { idBoleto_idEmpresa_idImovel_idCliente: { idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente } },
      data: {
        cancelado: b.cancelado ? true : false,
        pago: b.pago ? true : false,
        valorPago: b.valorPago,
        valorParc: b.valorParc,
        total: b.total,
        origem: b.origem,
        dataPgto: b.dataPgto
      }
    });
    
    // Check if it was paid
    if (b.pago) {
      console.log(`-> Boleto ${b.idBoleto} foi atualizado para PAGO!`);
      updatedCount++;
    }
  }

  console.log(`Concluido! ${updatedCount} boletos que estavam em aberto agora constam como pagos no banco local.`);
  
  await connection.end();
  await prisma.$disconnect();
}

fixBoletosFast().catch(console.error);
