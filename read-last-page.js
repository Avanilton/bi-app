const fs = require('fs');

async function extractLastPage(filename) {
  // Use dynamic import because pdfjs-dist is an ES module in newer versions, or commonjs depending on the install.
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
  
  // Create a standard Uint8Array
  const data = new Uint8Array(fs.readFileSync(filename));
  
  // Load the document
  const loadingTask = pdfjs.getDocument({ data });
  const pdfDocument = await loadingTask.promise;
  
  console.log(`Document loaded. Pages: ${pdfDocument.numPages}`);
  
  // Get the last page
  const page = await pdfDocument.getPage(pdfDocument.numPages);
  
  // Extract text
  const textContent = await page.getTextContent();
  const text = textContent.items.map(item => item.str).join(' ');
  
  console.log('--- TEXT OF LAST PAGE ---');
  console.log(text);
}

extractLastPage('planilhas/inadimplencia.pdf').catch(console.error);
