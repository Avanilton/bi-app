import * as fs from 'fs';
import * as path from 'path';

function checkCache() {
  const cachePath = path.join(__dirname, 'planilhas', 'cache-boletos.json');
  const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

  console.log("Data for 772:", cacheData.data['772']);
  
  const appValue = cacheData.data['772']?.inadimplencia || 0;
  console.log("Inadimplencia App: R$", appValue);
  
  const diff = 168468.07 - appValue;
  console.log("Difference:", diff);
}

checkCache();
