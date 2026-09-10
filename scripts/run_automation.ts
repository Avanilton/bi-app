import { chromium } from 'playwright';
import { PrismaClient } from '../prisma/generated/local-client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(process.cwd(), "local.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const STATUS_FILE = path.resolve(process.cwd(), "public", "data", "automation_status.json");

let logs: string[] = [];

function updateStatus(message: string, progress: number = 0, isRunning: boolean = true, isError: boolean = false) {
    const timestampStr = new Date().toLocaleTimeString('pt-BR');
    const logEntry = `[${timestampStr}] ${message}`;
    logs.push(logEntry);

    // Manter apenas as últimas 50 mensagens para não inchar o arquivo
    if (logs.length > 50) logs.shift();

    const statusData = {
        message,
        progress,
        isRunning,
        isError,
        logs,
        timestamp: new Date().toISOString()
    };
    try {
        const dir = path.dirname(STATUS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(STATUS_FILE, JSON.stringify(statusData, null, 2));
    } catch (e) {
        console.error("Erro ao escrever status da automação:", e);
    }
}

function checkCancelation() {
    try {
        if (fs.existsSync(STATUS_FILE)) {
            const data = fs.readFileSync(STATUS_FILE, 'utf8');
            const statusData = JSON.parse(data);
            if (statusData.cancelRequested) {
                throw new Error("Cancelado pelo usuário.");
            }
        }
    } catch (e: any) {
        if (e.message === "Cancelado pelo usuário.") throw e;
    }
}

function getYesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

export async function runInadimplenciaAutomation() {
    console.log("Iniciando automação de Inadimplência via Playwright...");
    updateStatus("Iniciando automação Playwright...", 5);
    
    // Executa em headless para rodar em servidor. Se precisar debugar mude para false.
    const browser = await chromium.launch({ headless: true }); 
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log("1. Acessando página de login...");
        updateStatus("Acessando página de login do Novacorp...", 10);
        await page.goto("https://sistemasnovacorp.com.br/County/login.jsf", { waitUntil: 'networkidle' });

        // 3.2 - Coloque usuário: tom e senha: 123456
        console.log("2. Preenchendo credenciais...");
        updateStatus("Preenchendo credenciais de acesso...", 15);
        await page.fill('input[type="text"]', 'tom');
        await page.fill('input[type="password"]', '123456');

        // Check botão "não sou robô"
        console.log("3. Clicando no check 'não sou robô'...");
        await page.click('xpath=//*[@id="login"]/div[2]/label/span[2]');
        await page.waitForTimeout(500);

        // 3.3 - Clicar no botão login
        console.log("4. Tentando login...");
        const loginBtnXPath = 'xpath=//*[@id="login:loginButton"]/span';
        await page.click(loginBtnXPath);
        await page.waitForTimeout(2000);
        
        // Verifica se continua na tela de login
        const loginStillVisible = await page.isVisible(loginBtnXPath).catch(() => false);
        if (loginStillVisible) {
            console.log("Login não concluiu na primeira tentativa, clicando novamente...");
            await page.click(loginBtnXPath);
            await page.waitForTimeout(2000);
        }

        // Aguarda a tela inicial carregar
        await page.waitForSelector('xpath=//*[@id="menuform:immnA_Relatorio"]/a/span/span', { timeout: 15000 });
        console.log("Login efetuado com sucesso.");
        updateStatus("Login efetuado com sucesso. Navegando para o relatório...", 25);

        // 3.4 e 3.5 - Menus
        console.log("5. Navegando nos menus...");
        await page.click('xpath=//*[@id="menuform:immnA_Relatorio"]/a/span/span');
        await page.waitForTimeout(1000);
        await page.click('xpath=//*[@id="menuform:immnA_Pendencia-xx1"]/a/span');
        
        // Aguarda tela de relatório
        await page.waitForSelector('xpath=//*[@id="frmRelaCobranca01:rbnnRelatorioCobrancaVectoMesRef"]/tbody/tr[2]/td/label', { timeout: 15000 });

        // 3.6 - Filtros
        console.log("6. Aplicando filtros...");
        updateStatus("Aplicando os 7 filtros exigidos no relatório...", 30);
        await page.click('xpath=//*[@id="frmRelaCobranca01:rbnnRelatorioCobrancaVectoMesRef"]/tbody/tr[2]/td/label', { force: true });
        await page.waitForTimeout(1000);
        await page.click('xpath=//*[@id="frmRelaCobranca01:rbnnRelatorioCobrancaOrigem"]/tbody/tr[1]/td/div/div[2]/span', { force: true });
        await page.waitForTimeout(1000);
        await page.click('xpath=//*[@id="frmRelaCobranca01:rbnnRelatorioCobrancaPrestacao"]/tbody/tr[1]/td/div/div[2]/span', { force: true });
        await page.waitForTimeout(1000);
        await page.click('xpath=//*[@id="frmRelaCobranca01:rbnnRelatorioCobrancaSituacao"]/tbody/tr[1]/td/div', { force: true });
        await page.waitForTimeout(1000);
        await page.click('xpath=//*[@id="frmRelaCobranca01:rbnnRelatorioCobrancaValor"]/tbody/tr[5]/td/div', { force: true });
        await page.waitForTimeout(1000);
        await page.click('xpath=//*[@id="frmRelaCobranca01:semFiltroData"]/div[2]/span', { force: true });
        await page.waitForTimeout(1000);

        const d1Str = getYesterdayStr();
        console.log(`Definindo data D-1: ${d1Str}`);
        const dateInput = 'xpath=//*[@id="frmRelaCobranca01:calDateFimRelatorioAcordo_input"]';
        await page.fill(dateInput, ''); 
        await page.fill(dateInput, d1Str);
        await page.waitForTimeout(1000);

        // O Select de condomínios
        const selectLabelXPath = 'xpath=//*[@id="frmRelaCobranca01:txtRelatorioImovelSelecionado_label"]';
        await page.click(selectLabelXPath, { force: true });
        await page.waitForTimeout(1000);

        const optionsLocator = page.locator('div[id="frmRelaCobranca01:txtRelatorioImovelSelecionado_panel"] li');
        const count = await optionsLocator.count();
        console.log(`Encontradas ${count} opções de condomínio na lista.`);
        updateStatus(`Encontrados ${count-1} condomínios. Iniciando extração...`, 35);

        if (count === 0) {
            throw new Error("Nenhum condomínio encontrado ou lista não abriu.");
        }

        let totalGeral = 0;
        let detalhes: any[] = [];
        let alreadyImported = new Set<string>();

        const today = new Date();
        today.setDate(today.getDate() - 1);
        today.setHours(0,0,0,0);
        
        try {
            const existingRun = await prisma.inadimplenciaDiaria.findUnique({
                where: { dataReferencia: today }
            });
            if (existingRun && existingRun.detalhes) {
                const existingDetalhes = JSON.parse(existingRun.detalhes as string);
                detalhes = existingDetalhes;
                totalGeral = existingRun.valorTotal || 0;
                existingDetalhes.forEach((d: any) => alreadyImported.add(d.condominio));
                console.log(`Retomando extração... ${alreadyImported.size} condomínios já foram importados hoje.`);
            }
        } catch(e) {}

        let isDropdownOpen = true;

        for (let i = 1; i < count; i++) {
            let nomeCondominio = await optionsLocator.nth(i).getAttribute('data-label') || await optionsLocator.nth(i).textContent() || '';
            nomeCondominio = nomeCondominio.trim();

            if (alreadyImported.has(nomeCondominio)) {
                console.log(`[${i}/${count-1}] Pulando: ${nomeCondominio} (já importado)`);
                continue;
            }

            if (!isDropdownOpen) {
                await page.click(selectLabelXPath, { force: true });
                await page.waitForTimeout(1000);
            }
            
            console.log(`[${i}/${count-1}] Extraindo: ${nomeCondominio}`);
            
            let progressoPerc = Math.round(35 + (i / (count - 1)) * 55);
            updateStatus(`Processando: ${nomeCondominio} (${i}/${count-1})`, progressoPerc);
            
            checkCancelation(); // Verifica se o usuário pediu para cancelar
            
            await optionsLocator.nth(i).click({ force: true });
            isDropdownOpen = false;
            await page.waitForTimeout(1000);

            let pdfBuffer: Buffer | null = null;

            const routeHandler = async (route: any) => {
                try {
                    const response = await route.fetch();
                    const body = await response.body();
                    if (body.length > 4 && body.subarray(0, 4).toString() === '%PDF') {
                        pdfBuffer = body;
                    }
                    await route.fulfill({ response });
                } catch (e) {
                    await route.fallback();
                }
            };
            
            await context.route('**/*', routeHandler);

            const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);

            await page.click('xpath=//*[@id="frmRelaCobranca01:btGeracaoRelatorioCobranca"]/span[2]', { force: true });

            for (let i = 0; i < 30; i++) {
                if (pdfBuffer) break;
                await page.waitForTimeout(500);
            }

            await context.unroute('**/*', routeHandler);

            const download = await downloadPromise;
            if (!pdfBuffer && download) {
                try {
                    const stream = await download.createReadStream();
                    const chunks: Buffer[] = [];
                    for await (const chunk of stream) {
                        chunks.push(chunk);
                    }
                    pdfBuffer = Buffer.concat(chunks);
                    await download.delete();
                } catch(e) {}
            }

            const pages = context.pages();
            if (pages.length > 1) {
                for (let i = 1; i < pages.length; i++) {
                    await pages[i].close().catch(() => null);
                }
            }
            await page.bringToFront();

            const pdfResponse = pdfBuffer ? true : false;

            let valor = 0;
            let condominos: any[] = [];

            if (pdfResponse) {
                try {
                    let pdfText = '';
                    try {
                        const pdfParse = require('pdf-parse');
                        const pdfData = await pdfParse(pdfBuffer);
                        pdfText = pdfData.text;
                    } catch (e: any) {
                        console.log(`-> Erro ao extrair PDF do ${nomeCondominio} (pdf-parse original):`, e.message);
                        try {
                            const { PDFDocument } = require('pdf-lib');
                            const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
                            const fixedBuffer = Buffer.from(await pdfDoc.save());
                            const pdfParse = require('pdf-parse');
                            const pdfData = await pdfParse(fixedBuffer);
                            pdfText = pdfData.text;
                            console.log(`-> Recuperação do PDF com pdf-lib bem sucedida!`);
                        } catch (e2: any) {
                            console.log(`-> Falha irreparável no PDF do ${nomeCondominio}:`, e2.message);
                        }
                    }

                    if (pdfText) {
                        const lines = pdfText.split('\n').map((l: string) => l.trim()).filter((l: string) => l);

                        let currentCondomino: any = null;

                    for (let j = 0; j < lines.length; j++) {
                        let line = lines[j];
                        
                        // Captura condômino com qualquer sufixo após o nome e o nome do bloco/unidade restante
                        let condominoMatch = line.match(/^(\d+)\s*-\s*(.+?)\s*-\s*([A-Za-z]+)\s*(.*)/i);
                        if (condominoMatch) {
                            currentCondomino = {
                                codigo: condominoMatch[1],
                                nome: condominoMatch[2].trim(),
                                bloco: condominoMatch[4] ? condominoMatch[4].trim() : '',
                                documentos: []
                            };
                            condominos.push(currentCondomino);
                            
                            // Se a linha do condomino não tinha o bloco e a próxima linha não for um documento nem condomino, pode ser o bloco
                            if (!currentCondomino.bloco && j + 1 < lines.length) {
                                const nextLine = lines[j+1];
                                if (!/^(?:\*\s*)?\d{6,9}$/.test(nextLine) && !/^(\d+)\s*-/.test(nextLine)) {
                                    currentCondomino.bloco = nextLine.trim();
                                    j++;
                                }
                            }
                        } else if (currentCondomino && /^(?:\*\s*)?\d{6,9}$/.test(line)) {
                            // Documento quebrado em múltiplas linhas (comum no pdf-parse)
                            let doc = line.replace('*', '').trim();
                            let ref = lines[++j] || '';
                            let vecto = lines[++j] || '';
                            let valorStr = lines[++j] || '';
                            j++; // ignora a quinta linha que é o Total
                            
                            if (valorStr && valorStr.includes('R$')) {
                                let numStr = valorStr.replace(/\s+/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.');
                                let v = parseFloat(numStr);
                                if (!isNaN(v)) {
                                    currentCondomino.documentos.push({ documento: doc, ref, vecto, valor: v });
                                }
                            }
                        } else if (currentCondomino) {
                            // Documento em linha única
                            let singleLineDoc = line.match(/^(?:\*\s*)?(\d{6,9})\s+(\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+(-?R\$)\s*([\d\.,]+)/i);
                            if (singleLineDoc) {
                                let isNegative = singleLineDoc[4].includes('-');
                                let num = parseFloat(singleLineDoc[5].replace(/\./g, '').replace(',', '.'));
                                if (isNegative) num = -num;
                                currentCondomino.documentos.push({
                                    documento: singleLineDoc[1],
                                    ref: singleLineDoc[2],
                                    vecto: singleLineDoc[3],
                                    valor: num
                                });
                            }
                        }
                    }

                    const matches = [...pdfText.matchAll(/TOTAL.*?R\$\s*([\d\.,\-]+)/ig)];
                    if (matches && matches.length > 0) {
                        const textMatch = matches[matches.length - 1][1];
                        let isNeg = textMatch.includes('-');
                        const numStr = textMatch.replace('-', '').replace(/\./g, '').replace(',', '.');
                        valor = parseFloat(numStr);
                        if (isNeg) valor = -valor;
                    } else {
                        const fallbackMatches = [...pdfText.matchAll(/R\$\s*([\d\.,\-]+)/ig)];
                        if (fallbackMatches && fallbackMatches.length > 0) {
                            const textMatch = fallbackMatches[fallbackMatches.length - 1][1];
                            let isNeg = textMatch.includes('-');
                            const numStr = textMatch.replace('-', '').replace(/\./g, '').replace(',', '.');
                            valor = parseFloat(numStr);
                            if (isNeg) valor = -valor;
                        }
                        }
                    }
                } catch (e) {
                    console.log(`-> Erro inesperado ao processar PDF do ${nomeCondominio}:`, e);
                }
            } else {
                console.log(`-> Resposta do PDF não encontrada para ${nomeCondominio}.`);
            }

            console.log(`-> Valor extraído: R$ ${valor.toFixed(2)} (Encontrados ${condominos.length} condôminos)`);
            totalGeral += valor;
            detalhes.push({ condominio: nomeCondominio, valor, condominos });

            await page.bringToFront();
        }

        console.log(`\n=== SOMA TOTAL DA INADIMPLÊNCIA: R$ ${totalGeral.toFixed(2)} ===\n`);
        updateStatus("Salvando os dados no banco local...", 95);

        // 3.9 Gravar na base de dados
        const dbToday = new Date();
        dbToday.setDate(dbToday.getDate() - 1);
        dbToday.setHours(0,0,0,0);

        await prisma.inadimplenciaDiaria.upsert({
            where: { dataReferencia: dbToday },
            update: {
                valorTotal: totalGeral,
                detalhes: JSON.stringify(detalhes),
                dataExecucao: new Date()
            },
            create: {
                dataReferencia: dbToday,
                valorTotal: totalGeral,
                detalhes: JSON.stringify(detalhes),
                dataExecucao: new Date()
            }
        });

        console.log("Processo concluído com sucesso e gravado no DB Local.");
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

// Se rodar direto via linha de comando
if (require.main === module) {
    async function main() {
        try {
            await runInadimplenciaAutomation();
            updateStatus("Automação concluída com sucesso!", 100, false);
        } catch (error: any) {
            console.error("Erro fatal na automação:", error);
            updateStatus(`Erro fatal: ${error.message}`, 0, false, true);
        }
    }
    main().catch(console.error);
}
