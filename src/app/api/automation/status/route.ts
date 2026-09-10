import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const statusFile = path.resolve(process.cwd(), "public", "data", "automation_status.json");
        if (fs.existsSync(statusFile)) {
            const data = fs.readFileSync(statusFile, 'utf8');
            return NextResponse.json(JSON.parse(data));
        } else {
            return NextResponse.json({
                message: "Nenhuma automação rodando no momento.",
                progress: 0,
                isRunning: false
            });
        }
    } catch (error) {
        console.error("Erro ao ler status:", error);
        return NextResponse.json({ error: "Falha ao ler o status" }, { status: 500 });
    }
}
