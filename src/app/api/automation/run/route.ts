import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST() {
    try {
        const statusFile = path.resolve(process.cwd(), 'public', 'data', 'automation_status.json');
        
        // Limpar o status antigo para que o frontend não mostre lixo enquanto a automação liga
        if (fs.existsSync(statusFile)) {
            fs.unlinkSync(statusFile);
        }

        const logPath = path.resolve(process.cwd(), 'public', 'data', 'spawn.log');
        const out = fs.openSync(logPath, 'a');
        const err = fs.openSync(logPath, 'a');

        const isWindows = process.platform === 'win32';
        const cmd = isWindows ? 'npx.cmd' : 'npx';

        // Usar caminho relativo para evitar problemas de parse no shell do Windows com pastas com espaços (ex: 'Projetos BV')
        const child = spawn(cmd, ['tsx', 'scripts/run_automation.ts'], {
            detached: true,
            stdio: ['ignore', out, err],
            shell: true,
            cwd: process.cwd()
        });

        child.unref();

        return NextResponse.json({ message: 'Automação iniciada com sucesso em segundo plano.' });
    } catch (error) {
        console.error("Erro ao tentar iniciar automação:", error);
        return NextResponse.json({ error: 'Falha ao iniciar a automação.' }, { status: 500 });
    }
}
