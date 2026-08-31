const fs = require('fs');

const pdfText = fs.readFileSync('pdf_1241.txt', 'utf8');
const lines = pdfText.split('\n');

const pdfDocs = new Set();
let pdfTotal = 0;

for (const line of lines) {
  const match = line.match(/^(\d{7})\s+\d{2}\/\d{4}\s+\d{2}\/\d{2}\/\d{4}\s+R\$\s+([\d,]+)\s+R\$\s+([\d,]+)/);
  if (match) {
    const doc = match[1];
    const val = parseFloat(match[3].replace(',', '.'));
    pdfDocs.add(doc);
    pdfTotal += val;
  }
}

console.log(`Boletos no PDF: ${pdfDocs.size}`);
console.log(`Total PDF: R$ ${pdfTotal.toFixed(2)}`);

const appData = JSON.parse(fs.readFileSync('1241_boletos.json', 'utf8'));

let appTotal = 0;
let today = new Date();
today.setHours(0,0,0,0);

const appDocs = new Set();
const boletosInAppOnly = [];

for (const b of appData) {
  let isPastDue = false;
  if (b.dataVecto) {
    const dt = new Date(b.dataVecto);
    if (dt < today) isPastDue = true;
  }
  
  if (isPastDue && (b.origem === null || (b.origem !== 3 && b.origem !== 5))) {
    const docStr = b.idBoleto.toString();
    appDocs.add(docStr);
    appTotal += b.total;
    
    if (!pdfDocs.has(docStr)) {
      boletosInAppOnly.push(b);
    }
  }
}

console.log(`Boletos no App: ${appDocs.size}`);
console.log(`Total App: R$ ${appTotal.toFixed(2)}`);

console.log(`\nBoletos no App que NÃO estão no PDF:`);
for (const b of boletosInAppOnly) {
  console.log(`Documento: ${b.idBoleto}, Valor: R$ ${b.total}, DataVecto: ${b.dataVecto}, Origem: ${b.origem}`);
}
