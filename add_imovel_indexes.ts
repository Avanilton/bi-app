import Database from 'better-sqlite3';

const start = Date.now();
console.log("Connecting to dev.db...");
const db = new Database('dev.db');

console.log("Creating covering indexes for idImovel...");
db.exec('CREATE INDEX IF NOT EXISTS idx_cover_boleto_imovel ON tbBoleto(idEmpresa, idImovel, pago, cancelado, origem, dataVecto, total);');
db.exec('CREATE INDEX IF NOT EXISTS idx_cover_recebimento_imovel ON tbBoleto(idEmpresa, idImovel, pago, cancelado, dataPgto, total);');

console.log(`Indexes created in ${Date.now() - start}ms`);
