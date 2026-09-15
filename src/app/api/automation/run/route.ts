import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST() {
    try {
        const isVercel = process.env.VERCEL === "1";

        if (isVercel) {
            // Em Vercel, dispara o GitHub Action Workflow
            const githubToken = process.env.GITHUB_PAT;
            const repoOwner = process.env.GITHUB_REPO_OWNER || "your-username"; // TODO: user will need to configure this
            const repoName = process.env.GITHUB_REPO_NAME || "bi-app";

            if (!githubToken) {
                return NextResponse.json(
                    { error: 'Token do GitHub não configurado (GITHUB_PAT). Não é possível rodar a automação na Vercel sem ele.' },
                    { status: 400 }
                );
            }

            const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/scraper.yml/dispatches`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ref: 'main' })
            });

            if (!response.ok) {
                const err = await response.text();
                console.error("Erro ao disparar GitHub Action:", err);
                return NextResponse.json({ error: `Falha no GitHub: ${response.statusText}` }, { status: response.status });
            }

            return NextResponse.json({ message: 'Automação disparada via GitHub Actions com sucesso!' });
        } else {
            // Ambiente Local (Localhost)
            const statusFile = path.resolve(process.cwd(), 'public', 'data', 'automation_status.json');
            
            if (fs.existsSync(statusFile)) {
                fs.unlinkSync(statusFile);
            }

            const logPath = path.resolve(process.cwd(), 'public', 'data', 'spawn.log');
            const out = fs.openSync(logPath, 'a');
            const err = fs.openSync(logPath, 'a');

            const isWindows = process.platform === 'win32';
            const cmd = isWindows ? 'npx.cmd' : 'npx';

            const child = spawn(cmd, ['tsx', 'scripts/run_automation.ts'], {
                detached: true,
                stdio: ['ignore', out, err],
                shell: true,
                cwd: process.cwd()
            });

            child.unref();

            return NextResponse.json({ message: 'Automação iniciada com sucesso em segundo plano (Local).' });
        }
    } catch (error) {
        console.error("Erro ao tentar iniciar automação:", error);
        return NextResponse.json({ error: 'Falha ao iniciar a automação.' }, { status: 500 });
    }
}
