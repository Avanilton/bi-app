import { NextResponse } from "next/server";
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
    const [imoveis] = await connection.query(
      "SELECT idEmpresa, idImovel, nomeFantasia, cnpj FROM TbImovel LIMIT 2000"
    );

    let syncCountImoveis = (imoveis as any[]).length;
    
    // Preparar as operações de upsert
    const upserts = (imoveis as any[]).map(imovel => prisma.tbImovel.upsert({
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
    }));

    // Executar em lotes (chunks) dentro de transações para máxima performance do SQLite
    const chunkSize = 1000;
    for (let i = 0; i < upserts.length; i += chunkSize) {
      const chunk = upserts.slice(i, i + chunkSize);
      await prisma.$transaction(chunk);
    }

    // 2. Sincronizar Clientes (TbCliente)
    console.log("Sincronizando Clientes...");
    const [clientes] = await connection.query(
      "SELECT idEmpresa, idImovel, idCliente, nomeCliente, fonece, foneco, cpf, email, cnpj, dddce, dddco, email2, email3 FROM TbCliente LIMIT 5000"
    );
    let syncCountClientes = (clientes as any[]).length;
    const upsertsClientes = (clientes as any[]).map(c => prisma.tbCliente.upsert({
      where: {
        idEmpresa_idImovel_idCliente: {
          idEmpresa: c.idEmpresa,
          idImovel: c.idImovel,
          idCliente: c.idCliente
        }
      },
      update: {
        nomeCliente: c.nomeCliente, fonece: c.fonece, foneco: c.foneco, cpf: c.cpf, email: c.email, cnpj: c.cnpj, dddce: c.dddce, dddco: c.dddco, email2: c.email2, email3: c.email3
      },
      create: {
        idEmpresa: c.idEmpresa, idImovel: c.idImovel, idCliente: c.idCliente, nomeCliente: c.nomeCliente, fonece: c.fonece, foneco: c.foneco, cpf: c.cpf, email: c.email, cnpj: c.cnpj, dddce: c.dddce, dddco: c.dddco, email2: c.email2, email3: c.email3
      }
    }));
    for (let i = 0; i < upsertsClientes.length; i += chunkSize) {
      await prisma.$transaction(upsertsClientes.slice(i, i + chunkSize));
    }

    // 3. Sincronizar Boletos (TbBoleto) - LIMIT 5000 por causa do volume (6 milhões)
    console.log("Sincronizando Boletos...");
    const [boletos] = await connection.query(
      "SELECT idBoleto, idEmpresa, idImovel, idCliente, cancelado, pago, valorPago, valorParc, multa, juros, correcao, encargo, total, dataVecto, nrParcela, tarifaBancaria, totPrestacao, origem, dtEmissaoExtra, totalExtra, idRateio, dataPgto, diferenca FROM TbBoleto LIMIT 5000"
    );
    let syncCountBoletos = (boletos as any[]).length;
    const upsertsBoletos = (boletos as any[]).map(b => prisma.tbBoleto.upsert({
      where: {
        idBoleto_idEmpresa_idImovel_idCliente: {
          idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente
        }
      },
      update: {
        cancelado: b.cancelado, pago: b.pago, valorPago: b.valorPago, valorParc: b.valorParc, multa: b.multa, juros: b.juros, correcao: b.correcao, encargo: b.encargo, total: b.total, dataVecto: b.dataVecto, nrParcela: b.nrParcela, tarifaBancaria: b.tarifaBancaria, totPrestacao: b.totPrestacao, origem: b.origem, dtEmissaoExtra: b.dtEmissaoExtra, totalExtra: b.totalExtra, idRateio: b.idRateio, dataPgto: b.dataPgto, diferenca: b.diferenca
      },
      create: {
        idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente, cancelado: b.cancelado, pago: b.pago, valorPago: b.valorPago, valorParc: b.valorParc, multa: b.multa, juros: b.juros, correcao: b.correcao, encargo: b.encargo, total: b.total, dataVecto: b.dataVecto, nrParcela: b.nrParcela, tarifaBancaria: b.tarifaBancaria, totPrestacao: b.totPrestacao, origem: b.origem, dtEmissaoExtra: b.dtEmissaoExtra, totalExtra: b.totalExtra, idRateio: b.idRateio, dataPgto: b.dataPgto, diferenca: b.diferenca
      }
    }));
    for (let i = 0; i < upsertsBoletos.length; i += chunkSize) {
      await prisma.$transaction(upsertsBoletos.slice(i, i + chunkSize));
    }

    // 4. Sincronizar Antecipacao (TbAntecipacao)
    console.log("Sincronizando Antecipações...");
    const [antecipacoes] = await connection.query(
      "SELECT idEmpresa, idTituloPagar, idImovel, mesRef, receitaAntecipada, receitaNaoAntecipada, perdas, custas, servicos, reembolso, valor, idRateio FROM TbAntecipacao LIMIT 5000"
    );
    let syncCountAntecipacoes = (antecipacoes as any[]).length;
    const upsertsAntecipacoes = (antecipacoes as any[]).map(a => prisma.tbAntecipacao.upsert({
      where: {
        idEmpresa_idTituloPagar: {
          idEmpresa: a.idEmpresa, idTituloPagar: a.idTituloPagar
        }
      },
      update: {
        idImovel: a.idImovel, mesRef: a.mesRef, receitaAntecipada: a.receitaAntecipada, receitaNaoAntecipada: a.receitaNaoAntecipada, perdas: a.perdas, custas: a.custas, servicos: a.servicos, reembolso: a.reembolso, valor: a.valor, idRateio: a.idRateio
      },
      create: {
        idEmpresa: a.idEmpresa, idTituloPagar: a.idTituloPagar, idImovel: a.idImovel, mesRef: a.mesRef, receitaAntecipada: a.receitaAntecipada, receitaNaoAntecipada: a.receitaNaoAntecipada, perdas: a.perdas, custas: a.custas, servicos: a.servicos, reembolso: a.reembolso, valor: a.valor, idRateio: a.idRateio
      }
    }));
    for (let i = 0; i < upsertsAntecipacoes.length; i += chunkSize) {
      await prisma.$transaction(upsertsAntecipacoes.slice(i, i + chunkSize));
    }

    // 5. Sincronizar Desconto Antecipacao (TbDescontoAntecipacao)
    console.log("Sincronizando Descontos Antecipações...");
    const [descontos] = await connection.query(
      "SELECT idDesconto, idImovel, idParcelaPagar, idTituloPagar, idEmpresa, descricao, valor FROM TbDescontoAntecipacao LIMIT 5000"
    );
    let syncCountDescontos = (descontos as any[]).length;
    const upsertsDescontos = (descontos as any[]).map(d => prisma.tbDescontoAntecipacao.upsert({
      where: {
        idDesconto_idImovel_idParcelaPagar_idTituloPagar_idEmpresa: {
          idDesconto: d.idDesconto, idImovel: d.idImovel, idParcelaPagar: d.idParcelaPagar, idTituloPagar: d.idTituloPagar, idEmpresa: d.idEmpresa
        }
      },
      update: {
        descricao: d.descricao, valor: d.valor
      },
      create: {
        idDesconto: d.idDesconto, idImovel: d.idImovel, idParcelaPagar: d.idParcelaPagar, idTituloPagar: d.idTituloPagar, idEmpresa: d.idEmpresa, descricao: d.descricao, valor: d.valor
      }
    }));
    for (let i = 0; i < upsertsDescontos.length; i += chunkSize) {
      await prisma.$transaction(upsertsDescontos.slice(i, i + chunkSize));
    }

    return NextResponse.json({
      success: true,
      message: `Sincronização concluída! Imóveis: ${syncCountImoveis} | Clientes: ${syncCountClientes} | Boletos: ${syncCountBoletos} | Antecipações: ${syncCountAntecipacoes} | Descontos: ${syncCountDescontos}`,
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
