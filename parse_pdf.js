const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:\\Users\\Administrador\\.gemini\\antigravity-ide\\brain\\15af35e7-575c-457c-bdd6-4178cc503d92\\media__1786042133021.pdf');

pdf(dataBuffer).then(function(data) {
    const text = data.text;
    const lines = text.split('\n');
    const clients = new Set();
    
    for (const line of lines) {
        if (line.includes('Cod. ')) {
            const match = line.match(/Cod\.\s*(\d+)/);
            if (match) {
                clients.add(parseInt(match[1]));
            }
        }
    }
    
    fs.writeFileSync('pdf_clients.json', JSON.stringify(Array.from(clients)));
    console.log(`Extracted ${clients.size} clients from PDF`);
});
