import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const boletos = await prisma.tbBoleto.findMany({
      where: {
        idEmpresa: 75,
        idImovel: 98,
        pago: false,
        cancelado: false,
      },
      select: {
        idBoleto: true,
        total: true,
        dataVecto: true,
        origem: true,
        idRateio: true,
      }
    });
    
    return NextResponse.json({ success: true, boletos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
