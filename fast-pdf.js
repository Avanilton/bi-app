const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');

async function test() {
  console.time('Load PDF');
  const pdfBytes = fs.readFileSync('planilhas/inadimplencia.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  console.timeEnd('Load PDF');
  
  const pageCount = pdfDoc.getPageCount();
  console.log('Total pages:', pageCount);
  
  // Extract only the last page
  console.time('Create single page PDF');
  const newPdf = await PDFDocument.create();
  const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageCount - 1]);
  newPdf.addPage(copiedPage);
  const singlePageBytes = await newPdf.save();
  console.timeEnd('Create single page PDF');
  
  console.time('Parse PDF text');
  const data = await pdfParse(Buffer.from(singlePageBytes));
  console.timeEnd('Parse PDF text');
  
  console.log('Text from last page:');
  console.log(data.text.trim());
  
  const regex = /Total Geral.*?([\d\.,]+)/i;
  const match = data.text.match(regex);
  console.log('MATCH:', match ? match[1] : 'NOT FOUND');
}
test();
