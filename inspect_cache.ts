const fs = require('fs');
const cache = JSON.parse(fs.readFileSync('planilhas/cache-boletos.json', 'utf-8'));
console.log(cache.data['98']);
