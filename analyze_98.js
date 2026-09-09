const fs = require('fs');

const data = JSON.parse(fs.readFileSync('boletos_98.json', 'utf8'));

let sumAll = 0;
let sumVencidosHoje = 0;
let sumVencidosOntem = 0;
let sumMenosSetembro = 0;
let sumAte31Agosto = 0;

const today = new Date();
today.setHours(0,0,0,0);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0,0,0,0);

const dateAte31Agosto = new Date('2026-08-31T23:59:59Z');

for (const b of data) {
    const d = new Date(b.dataVecto);
    const t = Number(b.total) || 0;
    sumAll += t;
    
    if (d <= new Date()) {
        sumVencidosHoje += t;
    }
    
    if (d <= yesterday) {
        sumVencidosOntem += t;
    }

    if (d <= dateAte31Agosto) {
        sumAte31Agosto += t;
    }
}

console.log("Sum All (BI Rule, ate fim do mes):", sumAll.toFixed(2));
console.log("Sum Vencidos Hoje:", sumVencidosHoje.toFixed(2));
console.log("Sum Vencidos Ontem:", sumVencidosOntem.toFixed(2));
console.log("Sum Ate 31 Agosto:", sumAte31Agosto.toFixed(2));

// BI App says: 229201.90
// Novacorp says: 226754.55
const biApp = 229201.90;
const novaCorp = 226754.55;

console.log("Difference BI - Novacorp:", (biApp - novaCorp).toFixed(2));
console.log("Difference All - Novacorp:", (sumAll - novaCorp).toFixed(2));
console.log("Difference VencidosHoje - Novacorp:", (sumVencidosHoje - novaCorp).toFixed(2));

// find subsets for 229201.90 and 226754.55
