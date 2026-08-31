import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as path from "path";
import * as fs from "fs";
import { INACTIVE_CONDOMINIOS } from "@/lib/constants";
const PLANILHAS_DIR = path.join(process.cwd(), "planilhas");
const CACHE_FILE = path.join(PLANILHAS_DIR, "cache-boletos.json");

export async function GET() {
  try {
    if (!fs.existsSync(PLANILHAS_DIR)) {
      fs.mkdirSync(PLANILHAS_DIR, { recursive: true });
    }

    console.log("Iniciando geração de cache...");
    const inactiveList = INACTIVE_CONDOMINIOS.join(',');

    // 1. Inadimplência
    const inadimplenciaRaw = await prisma.$queryRawUnsafe(`
      SELECT idImovel, SUM(total) as total
      FROM TbBoleto 
      WHERE idEmpresa = 75 
        AND pago = false 
        AND cancelado = false 
        AND (origem IS NULL OR origem = 0)
        AND idImovel IS NOT NULL
        AND idImovel NOT IN (${inactiveList})
        AND dataVecto <= LAST_DAY(CURDATE())
      GROUP BY idImovel
    `);

    // 2. Jurídicos Não Pagos
    const juridicoRaw = await prisma.$queryRawUnsafe(`
      SELECT idImovel, SUM(total) as total
      FROM TbBoleto 
      WHERE idEmpresa = 75 
        AND pago = false 
        AND cancelado = false 
        AND origem = 5
        AND idImovel IS NOT NULL
        AND idImovel NOT IN (${inactiveList})
      GROUP BY idImovel
    `);

    // 3. Amigáveis Não Pagos
    const amigavelRaw = await prisma.$queryRawUnsafe(`
      SELECT idImovel, SUM(total) as total
      FROM TbBoleto 
      WHERE idEmpresa = 75 
        AND pago = false 
        AND cancelado = false 
        AND origem = 6
        AND idImovel IS NOT NULL
        AND idImovel NOT IN (${inactiveList})
      GROUP BY idImovel
    `);

    // 4. Recebimentos Mês Atual
    const recebimentoPorMesRaw = await prisma.$queryRawUnsafe(`
      SELECT idImovel, YEAR(dataPgto) as ano, MONTH(dataPgto) as mes, SUM(total) as total
      FROM TbBoleto
      WHERE idEmpresa = 75 
        AND pago = true 
        AND cancelado = false
        AND dataPgto IS NOT NULL
        AND idImovel IS NOT NULL
        AND idImovel NOT IN (${inactiveList})
      GROUP BY idImovel, YEAR(dataPgto), MONTH(dataPgto)
    `);

    // Initialize ALL imoveis first so they don't disappear
    const allImoveis = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT idImovel FROM TbBoleto 
      WHERE idEmpresa = 75 
        AND idImovel IS NOT NULL
        AND idImovel NOT IN (${inactiveList})
    `);

    const cache: Record<number, any> = {};

    const initializeId = (id: number) => {
      if (!cache[id]) {
        cache[id] = {
          inadimplencia: 0,
          juridico: 0,
          amigavel: 0,
          recebimentosPorMes: {}
        };
      }
    };

    (allImoveis as any[]).forEach(row => {
      if (row.idImovel) initializeId(row.idImovel);
    });

    (inadimplenciaRaw as any[]).forEach(row => {
      const id = row.idImovel;
      initializeId(id);
      cache[id].inadimplencia = Number(row.total || 0);
    });

    (juridicoRaw as any[]).forEach(row => {
      const id = row.idImovel;
      initializeId(id);
      cache[id].juridico = Number(row.total || 0);
    });

    (amigavelRaw as any[]).forEach(row => {
      const id = row.idImovel;
      initializeId(id);
      cache[id].amigavel = Number(row.total || 0);
    });

    (recebimentoPorMesRaw as any[]).forEach(row => {
      const id = row.idImovel;
      initializeId(id);
      const key = `${row.ano}-${String(row.mes).padStart(2, '0')}`;
      cache[id].recebimentosPorMes[key] = Number(row.total || 0);
    });

    // Save
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ updatedAt: new Date().toISOString(), data: cache }), 'utf-8');

    console.log("Cache gerado com sucesso.");

    return NextResponse.json({ success: true, message: "Cache gerado com sucesso!" });
  } catch (error: any) {
    console.error("Erro ao gerar cache:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
