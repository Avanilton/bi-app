const fs = require('fs');
const cache = JSON.parse(fs.readFileSync('planilhas/cache-boletos.json', 'utf-8'));

let juri = 0;
for (const id in cache) {
  juri += (cache[id].juridico || 0);
}
console.log("Total juridico in cache: ", juri);
