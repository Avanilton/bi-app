import { NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";

// Polyfill DOMMatrix for pdfjs-dist in Node.js
if (typeof global !== 'undefined' && !global.DOMMatrix) {
  global.DOMMatrix = class DOMMatrix {} as any;
}

const PLANILHAS_DIR = path.join(process.cwd(), "planilhas");
const DADOS_FILE = path.join(PLANILHAS_DIR, "dados.json");

/**
 * Lê APENAS a última página do PDF usando pdfjs-dist
 * Isso evita travar o servidor ao ler relatórios de 11.000 páginas
 */
async function extrairValorDePdf(nomeArquivo: string): Promise<number> {
  const filePath = path.join(PLANILHAS_DIR, nomeArquivo);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`Arquivo não encontrado: ${filePath}`);
    return 0; // Se o usuário ainda não colocou o PDF, retorna 0
  }

  try {
    // @ts-expect-error No type definitions for pdf.mjs
    const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
    const { pathToFileURL } = await import("url");
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.join(process.cwd(), "node_modules", "pdfjs-dist", "build", "pdf.worker.mjs")).href;
    
    const data = new Uint8Array(fs.readFileSync(filePath));
    
    // Ignora erros de fontes e carrega o documento
    const loadingTask = pdfjs.getDocument({ 
      data,
      standardFontDataUrl: path.join(process.cwd(), "node_modules", "pdfjs-dist", "standard_fonts") + "/"
    });
    
    const pdfDocument = await loadingTask.promise;
    
    // Pega APENAS a última página (onde fica o Total Geral)
    const page = await pdfDocument.getPage(pdfDocument.numPages);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(" ");
    
    // Tenta encontrar o padrão do relatório 1 (Inadimplência / Abertos S/ Acordo)
    // Exemplo: Quantidade documentos: R$ 500698 R$ 165.648.244,32 48415 Quantidade clientes: 11634
    let regexTotal = /R\$\s*([\d\.,]+)(?=\s*\d+\s*Quantidade clientes)/i;
    let match = text.match(regexTotal);
    
    if (!match) {
      // Tenta encontrar o padrão do relatório 2 (Jurídico / Amigável não pago)
      // Exemplo: R$ 4.790.120,00 Qtde títulos: 5264 R$ 1.086.781,38
      regexTotal = /R\$\s*([\d\.,]+)(?=\s*Qtde títulos)/i;
      match = text.match(regexTotal);
    }
    
    if (!match) {
      // Fallback genérico caso exista a palavra Total Geral
      regexTotal = /Total Geral.*?(?:R\$\s*)?([\d\.,]+)/i;
      match = text.match(regexTotal);
    }
    
    if (match && match[1]) {
      const valorStr = match[1].replace(/\./g, "").replace(",", ".");
      return parseFloat(valorStr) || 0;
    }

    return 0;
  } catch (error) {
    console.error(`Erro ao ler PDF ${nomeArquivo}:`, error);
    return 0;
  }
}

export async function POST() {
  try {
    if (!fs.existsSync(PLANILHAS_DIR)) {
      fs.mkdirSync(PLANILHAS_DIR, { recursive: true });
    }

    // Lê apenas a última página de cada PDF rapidamente
    const inadimplencia = await extrairValorDePdf("inadimplencia.pdf");
    const juridiconaopago = await extrairValorDePdf("juridiconaopago.pdf");
    const amigavelnaopago = await extrairValorDePdf("amigavelnaopago.pdf");
    const abertosSemAcordo = await extrairValorDePdf("abertossemacordo.pdf");

    const dadosExtraidos = {
      inadimplencia,
      juridiconaopago,
      amigavelnaopago,
      abertosSemAcordo,
      updatedAt: new Date().toISOString()
    };

    // Salva no dados.json
    fs.writeFileSync(DADOS_FILE, JSON.stringify(dadosExtraidos, null, 2), "utf-8");

    // Remove logs antigos
    ["status.json", "progresso.log"].forEach(file => {
      const p = path.join(PLANILHAS_DIR, file);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });

    return NextResponse.json({
      success: true,
      message: "Planilhas lidas com sucesso!",
      dados: dadosExtraidos
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao ler as planilhas." },
      { status: 500 }
    );
  }
}
