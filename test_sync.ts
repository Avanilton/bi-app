import "dotenv/config";
import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "sistemasnovacorp.com.br",
      port: 5643,
      user: "Intelligence",
      password: "@bv2026@",
      database: "novacorpconect",
      timezone: "-03:00",
    });
    console.log("Conectado.");

    console.log("1");
    await connection.query("SELECT idEmpresa, idImovel, nomeFantasia, cnpj FROM TbImovel LIMIT 1");
    
    console.log("2");
    const maxCliente = await prisma.tbCliente.findFirst({ orderBy: { idCliente: 'desc' }, select: { idCliente: true } });
    const maxIdCliente = maxCliente ? maxCliente.idCliente : 0;
    await connection.query(`SELECT idEmpresa, idImovel, idCliente, nomeCliente, fonece, foneco, cpf, email, cnpj, dddce, dddco, email2, email3 FROM TbCliente WHERE idCliente > ${maxIdCliente} ORDER BY idCliente ASC LIMIT 1`);

    console.log("3");
    const maxBoleto = await prisma.tbBoleto.findFirst({ orderBy: { idBoleto: 'desc' }, select: { idBoleto: true } });
    const maxIdBoleto = maxBoleto ? maxBoleto.idBoleto : 0;
    await connection.query(`SELECT idBoleto, idEmpresa, idImovel, idCliente, cancelado, pago, valorPago, valorParc, multa, juros, correcao, encargo, total, dataVecto, nrParcela, tarifaBancaria, totPrestacao, origem, dtEmissaoExtra, totalExtra, idRateio, dataPgto, diferenca FROM TbBoleto WHERE idBoleto > ${maxIdBoleto} ORDER BY idBoleto ASC LIMIT 1`);

    console.log("4");
    const maxAntecipacao = await prisma.tbAntecipacao.findFirst({ orderBy: { idTituloPagar: 'desc' }, select: { idTituloPagar: true } });
    const maxIdTituloPagar = maxAntecipacao ? maxAntecipacao.idTituloPagar : 0;
    await connection.query(`SELECT idEmpresa, idTituloPagar, idImovel, mesRef, receitaAntecipada, receitaNaoAntecipada, perdas, custas, servicos, reembolso, valor, idRateio FROM TbAntecipacao WHERE idTituloPagar > ${maxIdTituloPagar} ORDER BY idTituloPagar ASC LIMIT 1`);

    console.log("5");
    const maxDesconto = await prisma.tbDescontoAntecipacao.findFirst({ orderBy: { idDesconto: 'desc' }, select: { idDesconto: true } });
    const maxIdDesconto = maxDesconto ? maxDesconto.idDesconto : 0;
    await connection.query(`SELECT idDesconto, idImovel, idParcelaPagar, idTituloPagar, idEmpresa, descricao, valor FROM TbDescontoAntecipacao WHERE idDesconto > ${maxIdDesconto} ORDER BY idDesconto ASC LIMIT 1`);

    console.log("Tudo funcionou.");
  } catch (err) {
    console.error("Erro capturado:");
    console.error(err);
  } finally {
    if (connection) await connection.end();
    await prisma.$disconnect();
  }
}

main();
