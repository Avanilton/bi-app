import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" } as any);
const prisma = new PrismaClient({ adapter });

const num = (v: any) => v != null ? Number(v) : null;
const bool = (v: any) => v != null ? !!v : null;

async function run() {
  let connection;

  try {
    console.log("Iniciando sincronização massiva (Worker) com Novacorp...");

    connection = await mysql.createConnection({
      host: "sistemasnovacorp.com.br",
      port: 5643,
      user: "Intelligence",
      password: "@bv2026@",
      database: "novacorpconect",
      timezone: "-03:00",
    });

    const chunkSize = 500;
    
    const validImoveis = new Set<string>();
    const validClientes = new Set<string>();

    // 1. TbImovel
    console.log("Sincronizando TbImovel...");
    const [imoveis] = await connection.query("SELECT idEmpresa, idImovel, nomeFantasia, cnpj FROM TbImovel");
    for (const imovel of (imoveis as any[])) {
      validImoveis.add(`${imovel.idEmpresa}_${imovel.idImovel}`);
      await prisma.tbImovel.upsert({
        where: { idEmpresa_idImovel: { idEmpresa: imovel.idEmpresa, idImovel: imovel.idImovel } },
        update: { nomeFantasia: imovel.nomeFantasia, cnpj: imovel.cnpj },
        create: { idEmpresa: imovel.idEmpresa, idImovel: imovel.idImovel, nomeFantasia: imovel.nomeFantasia, cnpj: imovel.cnpj }
      });
    }
    console.log(`✓ TbImovel concluído (${(imoveis as any[]).length} registros)`);

    // 2. TbCliente
    console.log("Sincronizando TbCliente...");
    const [clientes] = await connection.query("SELECT idEmpresa, idImovel, idCliente, nomeCliente, fonece, foneco, cpf, email, cnpj, dddce, dddco, email2, email3 FROM TbCliente");
    let cCount = 0;
    let upsertsC = [];
    for (const c of (clientes as any[])) {
      if (!validImoveis.has(`${c.idEmpresa}_${c.idImovel}`)) continue;
      validClientes.add(`${c.idEmpresa}_${c.idImovel}_${c.idCliente}`);
      upsertsC.push(prisma.tbCliente.upsert({
        where: { idEmpresa_idImovel_idCliente: { idEmpresa: c.idEmpresa, idImovel: c.idImovel, idCliente: c.idCliente } },
        update: { nomeCliente: c.nomeCliente, fonece: c.fonece, foneco: c.foneco, cpf: c.cpf, email: c.email, cnpj: c.cnpj, dddce: c.dddce, dddco: c.dddco, email2: c.email2, email3: c.email3 },
        create: { idEmpresa: c.idEmpresa, idImovel: c.idImovel, idCliente: c.idCliente, nomeCliente: c.nomeCliente, fonece: c.fonece, foneco: c.foneco, cpf: c.cpf, email: c.email, cnpj: c.cnpj, dddce: c.dddce, dddco: c.dddco, email2: c.email2, email3: c.email3 }
      }));
      if (upsertsC.length >= chunkSize) {
        await prisma.$transaction(upsertsC);
        cCount += upsertsC.length;
        console.log(`  Progresso TbCliente: ${cCount}`);
        upsertsC = [];
      }
    }
    if (upsertsC.length > 0) await prisma.$transaction(upsertsC);
    console.log(`✓ TbCliente concluído (${(clientes as any[]).length} registros)`);

    // 3. TbAntecipacao
    console.log("Sincronizando TbAntecipacao...");
    const [antecipacoes] = await connection.query("SELECT idEmpresa, idTituloPagar, idImovel, mesRef, receitaAntecipada, receitaNaoAntecipada, perdas, custas, servicos, reembolso, valor, idRateio FROM TbAntecipacao");
    let aCount = 0;
    let upsertsA = [];
    for (const a of (antecipacoes as any[])) {
      if (!validImoveis.has(`${a.idEmpresa}_${a.idImovel}`)) continue;
      upsertsA.push(prisma.tbAntecipacao.upsert({
        where: { idEmpresa_idTituloPagar: { idEmpresa: a.idEmpresa, idTituloPagar: a.idTituloPagar } },
        update: { idImovel: a.idImovel, mesRef: a.mesRef, receitaAntecipada: num(a.receitaAntecipada), receitaNaoAntecipada: num(a.receitaNaoAntecipada), perdas: num(a.perdas), custas: num(a.custas), servicos: num(a.servicos), reembolso: num(a.reembolso), valor: num(a.valor), idRateio: a.idRateio },
        create: { idEmpresa: a.idEmpresa, idTituloPagar: a.idTituloPagar, idImovel: a.idImovel, mesRef: a.mesRef, receitaAntecipada: num(a.receitaAntecipada), receitaNaoAntecipada: num(a.receitaNaoAntecipada), perdas: num(a.perdas), custas: num(a.custas), servicos: num(a.servicos), reembolso: num(a.reembolso), valor: num(a.valor), idRateio: a.idRateio }
      }));
      if (upsertsA.length >= chunkSize) {
        await prisma.$transaction(upsertsA);
        aCount += upsertsA.length;
        console.log(`  Progresso TbAntecipacao: ${aCount}`);
        upsertsA = [];
      }
    }
    if (upsertsA.length > 0) await prisma.$transaction(upsertsA);
    console.log(`✓ TbAntecipacao concluído (${(antecipacoes as any[]).length} registros)`);

    // 4. TbDescontoAntecipacao
    console.log("Sincronizando TbDescontoAntecipacao...");
    const [descontos] = await connection.query("SELECT idDesconto, idImovel, idParcelaPagar, idTituloPagar, idEmpresa, descricao, valor FROM TbDescontoAntecipacao");
    let dCount = 0;
    let upsertsD = [];
    for (const d of (descontos as any[])) {
      if (!validImoveis.has(`${d.idEmpresa}_${d.idImovel}`)) continue;
      upsertsD.push(prisma.tbDescontoAntecipacao.upsert({
        where: { idDesconto_idImovel_idParcelaPagar_idTituloPagar_idEmpresa: { idDesconto: d.idDesconto, idImovel: d.idImovel, idParcelaPagar: d.idParcelaPagar, idTituloPagar: d.idTituloPagar, idEmpresa: d.idEmpresa } },
        update: { descricao: d.descricao, valor: num(d.valor) },
        create: { idDesconto: d.idDesconto, idImovel: d.idImovel, idParcelaPagar: d.idParcelaPagar, idTituloPagar: d.idTituloPagar, idEmpresa: d.idEmpresa, descricao: d.descricao, valor: num(d.valor) }
      }));
      if (upsertsD.length >= chunkSize) {
        await prisma.$transaction(upsertsD);
        dCount += upsertsD.length;
        console.log(`  Progresso TbDesconto: ${dCount}`);
        upsertsD = [];
      }
    }
    if (upsertsD.length > 0) await prisma.$transaction(upsertsD);
    console.log(`✓ TbDescontoAntecipacao concluído (${(descontos as any[]).length} registros)`);

    // 5. TbBoleto (Milhões de registros - Usando paginação SQL)
    console.log("Sincronizando TbBoleto (PAGINADO)...");
    let offset = 0;
    let keepFetching = true;
    let bCount = 0;
    const limit = 50000;
    
    while (keepFetching) {
      const [boletos] = await connection.query(`SELECT idBoleto, idEmpresa, idImovel, idCliente, cancelado, pago, valorPago, valorParc, multa, juros, correcao, encargo, total, dataVecto, nrParcela, tarifaBancaria, totPrestacao, origem, dtEmissaoExtra, totalExtra, idRateio, dataPgto, diferenca FROM TbBoleto LIMIT ${limit} OFFSET ${offset}`);
      
      const boletosArr = boletos as any[];
      if (boletosArr.length === 0) {
        keepFetching = false;
        break;
      }
      
      let upsertsB = [];
      for (const b of boletosArr) {
        if (!validImoveis.has(`${b.idEmpresa}_${b.idImovel}`)) continue;
        if (!validClientes.has(`${b.idEmpresa}_${b.idImovel}_${b.idCliente}`)) continue;
        
        upsertsB.push(prisma.tbBoleto.upsert({
          where: { idBoleto_idEmpresa_idImovel_idCliente: { idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente } },
          update: { cancelado: bool(b.cancelado), pago: bool(b.pago), valorPago: num(b.valorPago), valorParc: num(b.valorParc), multa: num(b.multa), juros: num(b.juros), correcao: num(b.correcao), encargo: num(b.encargo), total: num(b.total), dataVecto: b.dataVecto, nrParcela: b.nrParcela, tarifaBancaria: num(b.tarifaBancaria), totPrestacao: num(b.totPrestacao), origem: b.origem, dtEmissaoExtra: b.dtEmissaoExtra, totalExtra: num(b.totalExtra), idRateio: b.idRateio, dataPgto: b.dataPgto, diferenca: num(b.diferenca) },
          create: { idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente, cancelado: bool(b.cancelado), pago: bool(b.pago), valorPago: num(b.valorPago), valorParc: num(b.valorParc), multa: num(b.multa), juros: num(b.juros), correcao: num(b.correcao), encargo: num(b.encargo), total: num(b.total), dataVecto: b.dataVecto, nrParcela: b.nrParcela, tarifaBancaria: num(b.tarifaBancaria), totPrestacao: num(b.totPrestacao), origem: b.origem, dtEmissaoExtra: b.dtEmissaoExtra, totalExtra: num(b.totalExtra), idRateio: b.idRateio, dataPgto: b.dataPgto, diferenca: num(b.diferenca) }
        }));
        
        if (upsertsB.length >= chunkSize) {
          await prisma.$transaction(upsertsB);
          bCount += upsertsB.length;
          console.log(`  Progresso TbBoleto: ${bCount}`);
          upsertsB = [];
        }
      }
      if (upsertsB.length > 0) {
         await prisma.$transaction(upsertsB);
         bCount += upsertsB.length;
         console.log(`  Progresso TbBoleto: ${bCount}`);
      }
      
      offset += limit;
    }
    console.log(`✓ TbBoleto concluído (${bCount} registros)`);

    console.log("============== SINCRONIZAÇÃO TOTAL CONCLUÍDA ==============");

  } catch (error) {
    console.error("Erro no Worker:", error);
  } finally {
    if (connection) await connection.end();
    await prisma.$disconnect();
  }
}

run();
