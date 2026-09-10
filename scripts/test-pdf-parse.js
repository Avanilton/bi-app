const fs = require('fs');

const mockPdfText = `
BV GARANTIA SA
RUA MARECHAL DEODORO 344
CENTRO - 80010010 CURITIBA/PR
FONE: 41992244242
COBRANCA@BVGARANTIA.COM.BR
ESTA É UMA INFORMAÇÃO CONFIDENCIAL, A DIVULGAÇÃO DO MESMO A TERCEIRO PODERÁ SER PUNIDO DE ACORDO COM O CÓDIGO PREVISTO EM LEI.
Desde o início a 08/09/2026
IMPRESSO POR TOM
DEMONSTRATIVO DE COBRANÇA
ACORDO JURÍDICO*    ACORDO AMIGAVEL*   CRÉDITO *    NÃO ANTECIPADAS *
AGUAS CLARAS
126281 - CARLOS EDUARDO FIGUEREDO DA SILVA - CARTEIRA
BLOCO 01-002
Documento
Ref.
Vecto
Valor
Total
4684839
03/2025
10/03/2025
R$ 393,03
R$ 393,03
4970700
05/2025
10/05/2025
R$ 393,03
R$ 393,03
Total cliente:
R$ 786,06

126282 - JACKELINE SULAMITA DE CASTRO - CARTEIRA
BLOCO 01-003
Documento
Ref.
Vecto
Valor
Total
7289651
08/2026
10/08/2026
R$ 362,88
R$ 362,88
Total cliente:
R$ 362,88

Quantidade documentos: 424
Quantidade clientes: 57
R$ 157.825,34
R$ 157.825,34
`;

// Parse Logic
const results = [];
let currentCondomino = null;

// The text structure is line-by-line, but often rows are broken or consecutive.
// A condômino line starts with a number (ID), hyphen, name.
// Block info might be on the next line or same line.
// Document rows usually follow "Documento Ref. Vecto Valor Total"

const lines = mockPdfText.split('\n').map(l => l.trim()).filter(l => l);

let i = 0;
while (i < lines.length) {
    let line = lines[i];
    
    // Check for Condômino header: "126281 - CARLOS EDUARDO ..."
    let condominoMatch = line.match(/^(\d+)\s*-\s*(.+?)\s*-\s*CARTEIRA/);
    if (condominoMatch) {
        currentCondomino = {
            codigo: condominoMatch[1],
            nome: condominoMatch[2].trim(),
            bloco: '',
            documentos: []
        };
        results.push(currentCondomino);
        
        // Next line might be the block
        if (i + 1 < lines.length && lines[i+1].includes('BLOCO')) {
            currentCondomino.bloco = lines[i+1];
            i++;
        } else if (line.includes('BLOCO')) {
             currentCondomino.bloco = line.substring(line.indexOf('BLOCO')).trim();
        }
    } 
    // Check for Document row
    // A document row in this mock is spread across multiple lines if pdf-parse breaks it
    // Or it might be on the same line if pdf-parse keeps it together
    // Let's assume it's spread, or look for a pattern:
    // e.g. 7 digits for doc, MM/YYYY, DD/MM/YYYY, R$ XX,XX, R$ XX,XX
    // Let's just look for a line with a document number (7 digits)
    else if (currentCondomino && /^\d{6,8}$/.test(line)) {
        // We found a document number!
        let doc = line;
        let ref = lines[++i];
        let vecto = lines[++i];
        let valorStr = lines[++i];
        let totalStr = lines[++i];
        
        // Clean values
        let valor = parseFloat(valorStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        currentCondomino.documentos.push({
            documento: doc,
            ref: ref,
            vecto: vecto,
            valor: valor
        });
    }
    // What if it's on a single line? "4684839  03/2025  10/03/2025  R$ 393,03  R$ 393,03"
    else if (currentCondomino) {
        let singleLineDoc = line.match(/^(\d{6,8})\s+(\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+R\$\s*([\d\.,]+)/);
        if (singleLineDoc) {
            currentCondomino.documentos.push({
                documento: singleLineDoc[1],
                ref: singleLineDoc[2],
                vecto: singleLineDoc[3],
                valor: parseFloat(singleLineDoc[4].replace(/\./g, '').replace(',', '.'))
            });
        }
    }
    
    i++;
}

console.log(JSON.stringify(results, null, 2));

