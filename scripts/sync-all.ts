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

    const args = process.argv.slice(2);
    const targetTableArg = args.find(a => a.startsWith('--table='));
    const targetTable = targetTableArg ? targetTableArg.toLowerCase().replace('--table=', '') : (args[0] && !args[0].startsWith('--') ? args[0].toLowerCase() : 'all');
    
    const offsetArg = args.find(a => a.startsWith('--offset='));
    const startOffset = offsetArg ? parseInt(offsetArg.replace('--offset=', ''), 10) : 0;

    const chunkSize = 500;
    
    const validImoveis = new Set<string>();
    const validClientes = new Set<string>();

    if (targetTable !== 'all' && targetTable !== 'tbimovel') {
      console.log("Carregando imóveis locais para validação...");
      const localImoveis = await prisma.tbImovel.findMany({ select: { idEmpresa: true, idImovel: true } });
      for (const i of localImoveis) validImoveis.add(`${i.idEmpresa}_${i.idImovel}`);
    }

    if (targetTable === 'tbboleto') {
      console.log("Carregando clientes locais para validação...");
      const localClientes = await prisma.tbCliente.findMany({ select: { idEmpresa: true, idImovel: true, idCliente: true } });
      for (const c of localClientes) validClientes.add(`${c.idEmpresa}_${c.idImovel}_${c.idCliente}`);
    }

    // 1. TbImovel
    if (targetTable === 'all' || targetTable === 'tbimovel') {
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
    }

    // 2. TbCliente
    if (targetTable === 'all' || targetTable === 'tbcliente') {
      console.log("Sincronizando TbCliente (PAGINADO)...");
      let cOffset = targetTable === 'tbcliente' ? startOffset : 0;
      let keepFetchingC = true;
      let cCount = targetTable === 'tbcliente' ? startOffset : 0;
      const limitC = 5000;

      while (keepFetchingC) {
        const [clientes] = await connection.query(`SELECT idEmpresa, idImovel, idCliente, nomeCliente, fonece, foneco, cpf, email, cnpj, dddce, dddco, email2, email3 FROM TbCliente LIMIT ${limitC} OFFSET ${cOffset}`);
        const clientesArr = clientes as any[];
        
        if (clientesArr.length === 0) {
          keepFetchingC = false;
          break;
        }

        let upsertsC = [];
        for (const c of clientesArr) {
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
        if (upsertsC.length > 0) {
          await prisma.$transaction(upsertsC);
          cCount += upsertsC.length;
          console.log(`  Progresso TbCliente: ${cCount}`);
        }
        
        cOffset += limitC;
      }
      console.log(`✓ TbCliente concluído (${cCount} registros)`);
    }

    // 3. TbAntecipacao
    if (targetTable === 'all' || targetTable === 'tbantecipacao') {
      console.log("Sincronizando TbAntecipacao (PAGINADO)...");
      let aOffset = targetTable === 'tbantecipacao' ? startOffset : 0;
      let keepFetchingA = true;
      let aCount = targetTable === 'tbantecipacao' ? startOffset : 0;
      const limitA = 5000;

      while (keepFetchingA) {
        const [antecipacoes] = await connection.query(`SELECT idEmpresa, idTituloPagar, idImovel, mesRef, receitaAntecipada, receitaNaoAntecipada, perdas, custas, servicos, reembolso, valor, idRateio FROM TbAntecipacao LIMIT ${limitA} OFFSET ${aOffset}`);
        const antecipacoesArr = antecipacoes as any[];
        
        if (antecipacoesArr.length === 0) {
          keepFetchingA = false;
          break;
        }

        let upsertsA = [];
        for (const a of antecipacoesArr) {
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
        if (upsertsA.length > 0) {
          await prisma.$transaction(upsertsA);
          aCount += upsertsA.length;
          console.log(`  Progresso TbAntecipacao: ${aCount}`);
        }
        
        aOffset += limitA;
      }
      console.log(`✓ TbAntecipacao concluído (${aCount} registros)`);
    }

    // 4. TbDescontoAntecipacao
    if (targetTable === 'all' || targetTable === 'tbdescontoantecipacao' || targetTable === 'tbdesconto') {
      console.log("Sincronizando TbDescontoAntecipacao (PAGINADO)...");
      let dOffset = (targetTable === 'tbdescontoantecipacao' || targetTable === 'tbdesconto') ? startOffset : 0;
      let keepFetchingD = true;
      let dCount = (targetTable === 'tbdescontoantecipacao' || targetTable === 'tbdesconto') ? startOffset : 0;
      const limitD = 5000;

      while (keepFetchingD) {
        const [descontos] = await connection.query(`SELECT idDesconto, idImovel, idParcelaPagar, idTituloPagar, idEmpresa, descricao, valor FROM TbDescontoAntecipacao LIMIT ${limitD} OFFSET ${dOffset}`);
        const descontosArr = descontos as any[];
        
        if (descontosArr.length === 0) {
          keepFetchingD = false;
          break;
        }

        let upsertsD = [];
        for (const d of descontosArr) {
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
        if (upsertsD.length > 0) {
          await prisma.$transaction(upsertsD);
          dCount += upsertsD.length;
          console.log(`  Progresso TbDesconto: ${dCount}`);
        }
        
        dOffset += limitD;
      }
      console.log(`✓ TbDescontoAntecipacao concluído (${dCount} registros)`);
    }

    // 5. TbBoleto (Milhões de registros - Usando paginação SQL)
    if (targetTable === 'all' || targetTable === 'tbboleto') {
      console.log("Sincronizando TbBoleto (PAGINADO E OTIMIZADO)...");
      const rawDb = new Database('./dev.db');
      rawDb.pragma('journal_mode = WAL');

      const insertStmt = rawDb.prepare(`
        INSERT INTO TbBoleto (idBoleto, idEmpresa, idImovel, idCliente, cancelado, pago, valorPago, valorParc, multa, juros, correcao, encargo, total, dataVecto, nrParcela, tarifaBancaria, totPrestacao, origem, dtEmissaoExtra, totalExtra, idRateio, dataPgto, diferenca)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(idBoleto, idEmpresa, idImovel, idCliente) DO UPDATE SET
        cancelado=excluded.cancelado, pago=excluded.pago, valorPago=excluded.valorPago, valorParc=excluded.valorParc, multa=excluded.multa, juros=excluded.juros, correcao=excluded.correcao, encargo=excluded.encargo, total=excluded.total, dataVecto=excluded.dataVecto, nrParcela=excluded.nrParcela, tarifaBancaria=excluded.tarifaBancaria, totPrestacao=excluded.totPrestacao, origem=excluded.origem, dtEmissaoExtra=excluded.dtEmissaoExtra, totalExtra=excluded.totalExtra, idRateio=excluded.idRateio, dataPgto=excluded.dataPgto, diferenca=excluded.diferenca
      `);

      const insertMany = rawDb.transaction((boletos) => {
        for (const b of boletos) {
          insertStmt.run(
            b.idBoleto, b.idEmpresa, b.idImovel, b.idCliente, b.cancelado, b.pago, b.valorPago, b.valorParc, b.multa, b.juros, b.correcao, b.encargo, b.total, b.dataVecto, b.nrParcela, b.tarifaBancaria, b.totPrestacao, b.origem, b.dtEmissaoExtra, b.totalExtra, b.idRateio, b.dataPgto, b.diferenca
          );
        }
      });

      const dateIso = (d: any) => d ? new Date(d).toISOString() : null;

      let offset = targetTable === 'tbboleto' ? startOffset : 0;
      let keepFetching = true;
      let bCount = targetTable === 'tbboleto' ? startOffset : 0;
      const limit = 50000;
      
      while (keepFetching) {
        const [boletos] = await connection.query(`SELECT idBoleto, idEmpresa, idImovel, idCliente, cancelado, pago, valorPago, valorParc, multa, juros, correcao, encargo, total, dataVecto, nrParcela, tarifaBancaria, totPrestacao, origem, dtEmissaoExtra, totalExtra, idRateio, dataPgto, diferenca FROM TbBoleto LIMIT ${limit} OFFSET ${offset}`);
        
        const boletosArr = boletos as any[];
        if (boletosArr.length === 0) {
          keepFetching = false;
          break;
        }
        
        const boletosToInsert = [];
        for (const b of boletosArr) {
          if (!validImoveis.has(`${b.idEmpresa}_${b.idImovel}`)) continue;
          if (!validClientes.has(`${b.idEmpresa}_${b.idImovel}_${b.idCliente}`)) continue;
          
          boletosToInsert.push({
            idBoleto: b.idBoleto, idEmpresa: b.idEmpresa, idImovel: b.idImovel, idCliente: b.idCliente,
            cancelado: bool(b.cancelado) ? 1 : 0, pago: bool(b.pago) ? 1 : 0, 
            valorPago: num(b.valorPago), valorParc: num(b.valorParc), multa: num(b.multa), juros: num(b.juros), 
            correcao: num(b.correcao), encargo: num(b.encargo), total: num(b.total), 
            dataVecto: dateIso(b.dataVecto), nrParcela: num(b.nrParcela), tarifaBancaria: num(b.tarifaBancaria), 
            totPrestacao: num(b.totPrestacao), origem: num(b.origem), dtEmissaoExtra: dateIso(b.dtEmissaoExtra), 
            totalExtra: num(b.totalExtra), idRateio: num(b.idRateio), dataPgto: dateIso(b.dataPgto), diferenca: num(b.diferenca)
          });
        }
        
        if (boletosToInsert.length > 0) {
           insertMany(boletosToInsert);
           bCount += boletosToInsert.length;
           console.log(`  Progresso TbBoleto: ${bCount}`);
        }
        
        offset += limit;
      }
      
      rawDb.close();
      console.log(`✓ TbBoleto concluído (${bCount} registros)`);
    }

    console.log("============== SINCRONIZAÇÃO TOTAL CONCLUÍDA ==============");

  } catch (error) {
    console.error("Erro no Worker:", error);
  } finally {
    if (connection) await connection.end();
    await prisma.$disconnect();
  }
}

run();
