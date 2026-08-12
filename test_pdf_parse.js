const fs = require('fs');
const pdf = require('pdf-parse');

async function extractLastPageTotal() {
  const dataBuffer = fs.readFileSync('planilhas/recebimentos.pdf');
  
  const options = {
    max: 0 // read all pages
  };

  const pdfData = await pdf(dataBuffer, options);
  console.log(`Document has ${pdfData.numpages} pages.`);
  
  // Read ONLY the last page using pdf-parse max feature
  // Actually max limits the number of pages from the beginning.
  // We can pass pagerender function to parse only the last page, but it's simpler to just parse everything and look at the text if it's small, or use pagerender to ignore other pages.
  
  const optionsLastPage = {
    pagerender: function(pageData) {
        if (pageData.pageIndex === pdfData.numpages - 1) {
            return pageData.getTextContent().then(function(textContent) {
                 let text = '';
                 for (let item of textContent.items) {
                     text += item.str + ' ';
                 }
                 return text;
            });
        }
        return '';
    }
  };
  
  const lastPageData = await pdf(dataBuffer, optionsLastPage);
  console.log('--- LAST PAGE TEXT ---');
  console.log(lastPageData.text);
}

extractLastPageTotal().catch(console.error);
