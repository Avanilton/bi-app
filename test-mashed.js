const fs = require('fs');

const text = fs.readFileSync('aguas_claras_raw.txt', 'utf8');
const lines = text.split('\n').map(l => l.trim()).filter(l => l);

let count = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let mashedDoc = line.match(/(-?R\$\s*[\d\.,]+)(\d{2}\/\d{2}\/\d{4})(-?R\$\s*[\d\.,]+)(\d{6,9})/i);
    if (mashedDoc) {
        let numStr = mashedDoc[1].replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
        let v = parseFloat(numStr);
        let vecto = mashedDoc[2];
        let doc = mashedDoc[4];
        let ref = (lines[i+1] && lines[i+1].match(/^\d{2}\/\d{4}$/)) ? lines[i+1] : '';
        console.log(`Matched: doc=${doc} ref=${ref} vecto=${vecto} val=${v}`);
        count++;
    }
}
console.log("Total matched:", count);
