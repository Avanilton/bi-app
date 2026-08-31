import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const columns = await prisma.$queryRaw`SELECT * FROM TbImovel LIMIT 1`;
    return NextResponse.json({ success: true, columns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
