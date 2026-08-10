import Database from 'better-sqlite3';

const start = Date.now();
console.log("Connecting to dev.db...");
const db = new Database('dev.db');

console.log("Creating index...");
db.exec('CREATE INDEX IF NOT EXISTS idx_tbboleto_empresa_origem_cliente ON tbBoleto(idEmpresa, origem, idCliente, idBoleto);');

console.log(`Index created in ${Date.now() - start}ms`);
