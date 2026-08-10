import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseWhere = {
    idEmpresa: 75,
    origem: 5,
    OR: [{ pago: false }, { pago: null }],
    AND: [ { OR: [{ cancelado: false }, { cancelado: null }] } ],
    nrParcela: { not: null, notIn: [0] },
    dataVecto: { lte: new Date() }
  };

  const c4 = await prisma.tbBoleto.aggregate({
    _sum: { total: true }, _count: true,
    where: baseWhere
  });

  const origensRecentes = await prisma.tbBoleto.groupBy({
    by: ['idCliente', 'origem'],
    _max: { idBoleto: true },
    where: { idEmpresa: 75, origem: { in: [5, 6, 99] } }
  });

  const clientLatestOrigem: Record<number, { origem: number, idBoleto: number }> = {};
  for (const r of origensRecentes) {
    const idBoleto = r._max.idBoleto;
    if (idBoleto !== null && r.origem !== null) {
      const prev = clientLatestOrigem[r.idCliente];
      if (!prev || idBoleto > prev.idBoleto) {
        clientLatestOrigem[r.idCliente] = { origem: r.origem, idBoleto };
      }
    }
  }

  const rompidosIds: number[] = [];
  for (const idClienteStr in clientLatestOrigem) {
    const latest = clientLatestOrigem[idClienteStr];
    if (latest.origem === 99 || latest.origem === 6) {
      rompidosIds.push(Number(idClienteStr));
    }
  }

  const allAmigaveisBoletos = await prisma.tbBoleto.findMany({
    where: baseWhere,
    select: { idBoleto: true, idCliente: true, idImovel: true, total: true, dataVecto: true, totPrestacao: true, nrParcela: true, valorParc: true }
  });

  const rompidosSet = new Set(rompidosIds);
  const amigaveisFilteredBoletos = allAmigaveisBoletos.filter(b => !rompidosSet.has(b.idCliente));

  const fs = require('fs');
  const pdfBoletos = new Set(JSON.parse(fs.readFileSync('C:\\Users\\Administrador\\Documents\\Projetos BV\\bibvgarantia\\bi-app\\pdf_boletos.json', 'utf8')));

  // Test: idRateio=0 AND totPrestacao=0 (exclude confissão de dívida)
  const rateioZeroTotPrestacao = await prisma.tbBoleto.aggregate({
    _sum: { total: true },
    _count: true,
    where: {
      idEmpresa: 75,
      origem: 5,
      idRateio: 0,
      totPrestacao: 0,
      OR: [{ pago: false }, { pago: null }],
      AND: [{ OR: [{ cancelado: false }, { cancelado: null }] }],
      dataVecto: { lte: new Date() }
    }
  });

  // Check 183 PDF boletos with idRateio != 0: what idRateio do they have?
  const allRateioZeroIds = new Set(
    (await prisma.tbBoleto.findMany({
      where: { idEmpresa: 75, origem: 5, idRateio: 0, OR: [{ pago: false }, { pago: null }], AND: [{ OR: [{ cancelado: false }, { cancelado: null }] }], dataVecto: { lte: new Date() } },
      select: { idBoleto: true }
    })).map(b => b.idBoleto)
  );

  const pdfNotInRateio0Ids: number[] = [...pdfBoletos].filter((pid: any) => !allRateioZeroIds.has(pid)) as number[];
  
  const pdfNotInRateio0Details = await prisma.tbBoleto.findMany({
    where: { idBoleto: { in: pdfNotInRateio0Ids.slice(0, 50) } },
    select: { idBoleto: true, total: true, idRateio: true, totPrestacao: true, nrParcela: true, origem: true, pago: true, cancelado: true }
  });

  const rateioDistrib: Record<string, number> = {};
  for (const b of pdfNotInRateio0Details) {
    const key = `idRateio=${b.idRateio}`;
    rateioDistrib[key] = (rateioDistrib[key] || 0) + 1;
  }

  return NextResponse.json({
    rateioZeroTotPrestacao: rateioZeroTotPrestacao,
    pdfBoletosNotInRateio0Count: pdfNotInRateio0Ids.length,
    rateioDistribOf183: rateioDistrib,
    sampleOf183: pdfNotInRateio0Details.slice(0, 5),
    target: 2245020
  });
}
