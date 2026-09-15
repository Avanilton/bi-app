import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClient } from "../../../../prisma/generated/local-client";
import path from "path";
import fs from "fs";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbPath = path.resolve(process.cwd(), "local.db");
    const dbExists = fs.existsSync(dbPath);
    let localStats = null;
    let localError = null;
    
    try {
      const prismaLocal = new PrismaClient({ datasources: { db: { url: `file:${dbPath}` } } } as any);
      const aggregates = await prismaLocal.dashboardAggregates.count();
      const inadimplencia = await prismaLocal.inadimplenciaDiaria.count();
      localStats = { aggregates, inadimplencia };
    } catch (e: any) {
      localError = e.message;
    }

    let globalStats = null;
    let globalError = null;
    
    try {
      const imoveis = await prisma.tbImovel.count();
      globalStats = { imoveis };
    } catch (e: any) {
      globalError = e.message;
    }

    return NextResponse.json({ 
      success: true, 
      localDbPath: dbPath,
      localDbExists: dbExists,
      localStats,
      localError,
      globalStats,
      globalError
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
