import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const abertos = await prisma.$queryRaw`
      SELECT idBoleto, total, dataVecto, origem, pago, cancelado
      FROM TbBoleto 
      WHERE idImovel = 1241 
        AND idEmpresa = 75
        AND pago = false 
        AND cancelado = false
        AND (origem IS NULL OR origem = 0)
    `;

    return NextResponse.json({ success: true, count: (abertos as any[]).length, data: abertos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
