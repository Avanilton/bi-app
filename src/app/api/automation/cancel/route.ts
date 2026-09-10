import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        const statusFile = path.resolve(process.cwd(), "public", "data", "automation_status.json");
        
        if (fs.existsSync(statusFile)) {
            const data = fs.readFileSync(statusFile, 'utf8');
            const statusData = JSON.parse(data);
            
            if (statusData.isRunning) {
                // Atualiza o arquivo solicitando o cancelamento
                statusData.cancelRequested = true;
                statusData.message = "Cancelamento solicitado, aguarde...";
                fs.writeFileSync(statusFile, JSON.stringify(statusData, null, 2));
                return NextResponse.json({ success: true, message: "Cancelamento solicitado com sucesso." });
            }
        }
        
        return NextResponse.json({ success: false, message: "Nenhuma automação rodando no momento." });
    } catch (error) {
        console.error("Erro ao cancelar automação:", error);
        return NextResponse.json({ error: "Falha ao processar cancelamento" }, { status: 500 });
    }
}
