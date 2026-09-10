import { chromium } from 'playwright';
const fs = require('fs');

async function testPdf(condoName: string) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();

    await page.goto('https://condominios.bvgarantia.com.br/novacorp/login.jsf');
    await page.fill('input[id="frmLogin:username"]', 'tom.ad');
    await page.fill('input[id="frmLogin:password"]', 'Mudar@123');
    await page.click('button[id="frmLogin:btnLogar"]');
    await page.waitForTimeout(3000);

    await page.goto('https://condominios.bvgarantia.com.br/novacorp/pages/cobranca/relatorioInadimplencia.jsf');
    await page.waitForTimeout(2000);

    await page.click('xpath=//*[@id="frmRelaCobranca01:somEmissaoBoleto"]/div[3]', { force: true });
    await page.waitForTimeout(500);
    await page.click('xpath=//*[@id="frmRelaCobranca01:somEmissaoBoleto_panel"]/div/ul/li[2]', { force: true });
    
    await page.click('xpath=//*[@id="frmRelaCobranca01:somStatusCobranca"]/div[3]', { force: true });
    await page.waitForTimeout(500);
    await page.click('xpath=//*[@id="frmRelaCobranca01:somStatusCobranca_panel"]/div/ul/li[3]', { force: true });
    
    await page.click('xpath=//*[@id="frmRelaCobranca01:somAcordoAmigavel"]/div[3]', { force: true });
    await page.waitForTimeout(500);
    await page.click('xpath=//*[@id="frmRelaCobranca01:somAcordoAmigavel_panel"]/div/ul/li[3]', { force: true });
    
    await page.click('xpath=//*[@id="frmRelaCobranca01:somAcordoJuridico"]/div[3]', { force: true });
    await page.waitForTimeout(500);
    await page.click('xpath=//*[@id="frmRelaCobranca01:somAcordoJuridico_panel"]/div/ul/li[3]', { force: true });
    
    await page.click('xpath=//*[@id="frmRelaCobranca01:somAjuizados"]/div[3]', { force: true });
    await page.waitForTimeout(500);
    await page.click('xpath=//*[@id="frmRelaCobranca01:somAjuizados_panel"]/div/ul/li[3]', { force: true });
    
    await page.click('xpath=//*[@id="frmRelaCobranca01:somAntecipado"]/div[3]', { force: true });
    await page.waitForTimeout(500);
    await page.click('xpath=//*[@id="frmRelaCobranca01:somAntecipado_panel"]/div/ul/li[3]', { force: true });
    
    await page.click('xpath=//*[@id="frmRelaCobranca01:somInativo"]/div[3]', { force: true });
    await page.waitForTimeout(500);
    await page.click('xpath=//*[@id="frmRelaCobranca01:somInativo_panel"]/div/ul/li[3]', { force: true });

    await page.waitForTimeout(1000);

    const selectLabelXPath = 'xpath=//*[@id="frmRelaCobranca01:txtRelatorioImovelSelecionado_label"]';
    await page.click(selectLabelXPath, { force: true });
    await page.waitForTimeout(1000);

    const optionsLocator = page.locator('div[id="frmRelaCobranca01:txtRelatorioImovelSelecionado_panel"] li');
    const count = await optionsLocator.count();
    
    let targetLocator = null;
    for (let i = 1; i < count; i++) {
        let name = await optionsLocator.nth(i).getAttribute('data-label') || await optionsLocator.nth(i).textContent() || '';
        if (name.trim() === condoName) {
            targetLocator = optionsLocator.nth(i);
            break;
        }
    }

    if (!targetLocator) {
        console.log("Condomínio não encontrado!");
        await browser.close();
        return;
    }

    await targetLocator.click({ force: true });
    await page.waitForTimeout(1000);

    let pdfBuffer: Buffer | null = null;
    const routeHandler = async (route: any) => {
        try {
            const response = await route.fetch();
            if (response.headers()['content-type'] === 'application/pdf') {
                pdfBuffer = await response.body();
                console.log("PDF INTERCEPTADO!");
                route.fulfill({ response });
            } else {
                route.continue();
            }
        } catch(e) { route.continue(); }
    };
    
    await context.route('**/*dashboard.jsf*', routeHandler);

    await Promise.all([
        page.waitForResponse(res => res.url().includes('dashboard.jsf') && res.request().method() === 'POST', { timeout: 15000 }).catch(()=>null),
        page.click('xpath=//*[@id="frmRelaCobranca01:btGeracaoRelatorioCobranca"]/span[2]', { force: true })
    ]);
    
    await page.waitForTimeout(2000);

    if (pdfBuffer) {
        fs.writeFileSync('debug.pdf', pdfBuffer);
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(pdfBuffer);
        fs.writeFileSync('debug_pdf.txt', pdfData.text);
        console.log("Salvo em debug.pdf e debug_pdf.txt");
    } else {
        console.log("Nenhum PDF capturado.");
    }

    await browser.close();
}

testPdf('BRISAS DO ATLANTICO NORTE').catch(console.error);
