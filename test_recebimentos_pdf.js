const fs = require('fs');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

async function extractLastPage(filename) {
  const data = new Uint8Array(fs.readFileSync(filename));
  const loadingTask = pdfjs.getDocument({ data });
  const pdfDocument = await loadingTask.promise;
  console.log(`Document loaded. Pages: ${pdfDocument.numPages}`);
  
  const page = await pdfDocument.getPage(pdfDocument.numPages);
  const textContent = await page.getTextContent();
  
  const items = textContent.items;
  items.sort((a, b) => {
      if (Math.abs(a.transform[5] - b.transform[5]) > 2) {
          return b.transform[5] - a.transform[5];
      }
      return a.transform[4] - b.transform[4];
  });
  
  const text = items.map(item => item.str).join(' | ');
  console.log('--- TEXT OF LAST PAGE ---');
  console.log(text);
}

extractLastPage('planilhas/recebimentos.pdf').catch(console.error);
