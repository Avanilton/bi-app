import Database from 'better-sqlite3';

const start = Date.now();
console.log("Connecting to dev.db...");
const db = new Database('dev.db');

console.log("Creating covering indexes...");
db.exec('CREATE INDEX IF NOT EXISTS idx_cover_boleto ON tbBoleto(idEmpresa, pago, cancelado, origem, dataVecto, total);');
db.exec('CREATE INDEX IF NOT EXISTS idx_cover_recebimento ON tbBoleto(idEmpresa, pago, cancelado, dataPgto, total);');

console.log(`Indexes created in ${Date.now() - start}ms`);
