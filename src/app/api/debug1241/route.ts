import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const boletos = await prisma.tbBoleto.findMany({
      where: {
        idImovel: 1241,
        idEmpresa: 75,
        pago: false,
        cancelado: false
      },
      select: {
        idBoleto: true,
        total: true,
        origem: true,
        dataVecto: true
      }
    });

    return NextResponse.json({ success: true, boletos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
