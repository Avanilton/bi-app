import Database from 'better-sqlite3';

const db = new Database('dev.db');

const pagoNulls = db.prepare('SELECT COUNT(*) as c FROM tbBoleto WHERE pago IS NULL').get();
const canceladoNulls = db.prepare('SELECT COUNT(*) as c FROM tbBoleto WHERE cancelado IS NULL').get();

console.log('Pago NULLs:', pagoNulls);
console.log('Cancelado NULLs:', canceladoNulls);
