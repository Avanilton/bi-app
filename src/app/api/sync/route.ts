import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import prisma from "@/lib/prisma";

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
      decimalNumbers: true, // Converte DECIMAL para Float automaticamente
    });

    console.log("Conectado ao MySQL da Novacorp com sucesso!");

    const chunkSize = 100;

    // 1. Sincronizar Imóveis (Condomínios) - Upsert para garantir atualizações
    const [imoveis] = await connection.query(
      "SELECT idEmpresa, idImovel, nomeFantasia, cnpj FROM TbImovel LIMIT 2000"
    );
    
    for (let i = 0; i < (imoveis as any[]).length; i += chunkSize) {
      const chunk = (imoveis as any[]).slice(i, i + chunkSize);
      await prisma.$transaction(
        chunk.map(c => prisma.tbImovel.upsert({
          where: { idEmpresa_idImovel: { idEmpresa: c.idEmpresa, idImovel: c.idImovel } },
          update: { nomeFantasia: c.nomeFantasia, cnpj: c.cnpj },
          create: { idEmpresa: c.idEmpresa, idImovel: c.idImovel, nomeFantasia: c.nomeFantasia, cnpj: c.cnpj }
        }))
      );
    }
    const syncCountImoveis = (imoveis as any[]).length;

    // 2. Sincronizar Clientes (TbCliente) - Últimos 5000
    console.log("Sincronizando Clientes...");
    const [clientes] = await connection.query(
      `SELECT idEmpresa, idImovel, idCliente, nomeCliente, fonece, foneco, cpf, email, cnpj, dddce, dddco, email2, email3 
       FROM TbCliente ORDER BY idCliente DESC LIMIT 5000`
    );
    
    for (let i = 0; i < (clientes as any[]).length; i += chunkSize) {
      const chunk = (clientes as any[]).slice(i, i + chunkSize);
      await prisma.$transaction(
        chunk.map(c => prisma.tbCliente.upsert({
          where: { idEmpresa_idImovel_idCliente: { idEmpresa: c.idEmpresa, idImovel: c.idImovel, idCliente: c.idCliente } },
          update: { nomeCliente: c.nomeCliente, fonece: c.fonece, foneco: c.foneco, cpf: c.cpf, email: c.email, cnpj: c.cnpj, dddce: c.dddce, dddco: c.dddco, email2: c.email2, email3: c.email3 },
          create: { idEmpresa: c.idEmpresa, idImovel: c.idImovel, idCliente: c.idCliente, nomeCliente: c.nomeCliente, fonece: c.fonece, foneco: c.foneco, cpf: c.cpf, email: c.email, cnpj: c.cnpj, dddce: c.dddce, dddco: c.dddco, email2: c.email2, email3: c.email3 }
        }))
      );
    }
    const syncCountClientes = (clientes as any[]).length;

    // 3. Sincronizar Boletos (TbBoleto) - Últimos 5000 (Pegando alterações recentes)
    console.log("Sincronizando Boletos...");
    const [boletos] = await connection.query(
      `SELECT idBoleto, idEmpresa, idImovel, idCliente, cancelado, pago, valorPago, valorParc, multa, juros, correcao, encargo, total, dataVecto, nrParcela, tarifaBancaria, totPrestacao, origem, dtEmissaoExtra, totalExtra, idRateio, dataPgto, diferenca 
       FROM TbBoleto ORDER BY idBoleto DESC LIMIT 5000`
    );

    for (let i = 0; i < (boletos as any[]).length; i += chunkSize) {
      const chunk = (boletos as any[]).slice(i, i + chunkSize);
      await prisma.$transaction(
        chunk.map(b => prisma.tbBoleto.upsert({
          where: { idBoleto_idEmpresa_idImovel_idCliente: { idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente } },
          update: {
            cancelado: b.cancelado ? true : false, pago: b.pago ? true : false, valorPago: b.valorPago, valorParc: b.valorParc, multa: b.multa, juros: b.juros, correcao: b.correcao, encargo: b.encargo, total: b.total, dataVecto: b.dataVecto, nrParcela: b.nrParcela, tarifaBancaria: b.tarifaBancaria, totPrestacao: b.totPrestacao, origem: b.origem, dtEmissaoExtra: b.dtEmissaoExtra, totalExtra: b.totalExtra, idRateio: b.idRateio, dataPgto: b.dataPgto, diferenca: b.diferenca
          },
          create: {
            idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente,
            cancelado: b.cancelado ? true : false, pago: b.pago ? true : false, valorPago: b.valorPago, valorParc: b.valorParc, multa: b.multa, juros: b.juros, correcao: b.correcao, encargo: b.encargo, total: b.total, dataVecto: b.dataVecto, nrParcela: b.nrParcela, tarifaBancaria: b.tarifaBancaria, totPrestacao: b.totPrestacao, origem: b.origem, dtEmissaoExtra: b.dtEmissaoExtra, totalExtra: b.totalExtra, idRateio: b.idRateio, dataPgto: b.dataPgto, diferenca: b.diferenca
          }
        }))
      );
    }
    const syncCountBoletos = (boletos as any[]).length;

    // 4. Sincronizar Antecipacao (TbAntecipacao) - Últimos 5000
    console.log("Sincronizando Antecipações...");
    const [antecipacoes] = await connection.query(
      `SELECT idEmpresa, idTituloPagar, idImovel, mesRef, receitaAntecipada, receitaNaoAntecipada, perdas, custas, servicos, reembolso, valor, idRateio 
       FROM TbAntecipacao ORDER BY idTituloPagar DESC LIMIT 5000`
    );

    for (let i = 0; i < (antecipacoes as any[]).length; i += chunkSize) {
      const chunk = (antecipacoes as any[]).slice(i, i + chunkSize);
      await prisma.$transaction(
        chunk.map(a => prisma.tbAntecipacao.upsert({
          where: { idEmpresa_idTituloPagar: { idEmpresa: a.idEmpresa, idTituloPagar: a.idTituloPagar } },
          update: { idImovel: a.idImovel, mesRef: a.mesRef, receitaAntecipada: a.receitaAntecipada, receitaNaoAntecipada: a.receitaNaoAntecipada, perdas: a.perdas, custas: a.custas, servicos: a.servicos, reembolso: a.reembolso, valor: a.valor, idRateio: a.idRateio },
          create: { idEmpresa: a.idEmpresa, idTituloPagar: a.idTituloPagar, idImovel: a.idImovel, mesRef: a.mesRef, receitaAntecipada: a.receitaAntecipada, receitaNaoAntecipada: a.receitaNaoAntecipada, perdas: a.perdas, custas: a.custas, servicos: a.servicos, reembolso: a.reembolso, valor: a.valor, idRateio: a.idRateio }
        }))
      );
    }
    const syncCountAntecipacoes = (antecipacoes as any[]).length;

    // 5. Sincronizar Desconto Antecipacao (TbDescontoAntecipacao) - Últimos 5000
    console.log("Sincronizando Descontos Antecipações...");
    const [descontos] = await connection.query(
      `SELECT idDesconto, idImovel, idParcelaPagar, idTituloPagar, idEmpresa, descricao, valor 
       FROM TbDescontoAntecipacao ORDER BY idDesconto DESC LIMIT 5000`
    );

    for (let i = 0; i < (descontos as any[]).length; i += chunkSize) {
      const chunk = (descontos as any[]).slice(i, i + chunkSize);
      await prisma.$transaction(
        chunk.map(d => prisma.tbDescontoAntecipacao.upsert({
          where: { idDesconto_idImovel_idParcelaPagar_idTituloPagar_idEmpresa: { idDesconto: d.idDesconto, idImovel: d.idImovel, idParcelaPagar: d.idParcelaPagar, idTituloPagar: d.idTituloPagar, idEmpresa: d.idEmpresa } },
          update: { descricao: d.descricao, valor: d.valor },
          create: { idDesconto: d.idDesconto, idImovel: d.idImovel, idParcelaPagar: d.idParcelaPagar, idTituloPagar: d.idTituloPagar, idEmpresa: d.idEmpresa, descricao: d.descricao, valor: d.valor }
        }))
      );
    }
    const syncCountDescontos = (descontos as any[]).length;

    return NextResponse.json({
      success: true,
      message: `Sincronização concluída! Dados ATUALIZADOS/INSERIDOS: Imóveis: ${syncCountImoveis} | Clientes: ${syncCountClientes} | Boletos: ${syncCountBoletos} | Antecipações: ${syncCountAntecipacoes} | Descontos: ${syncCountDescontos}`,
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
