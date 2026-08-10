import Database from 'better-sqlite3';

const db = new Database('dev.db');

const query = `
EXPLAIN QUERY PLAN
SELECT SUM("total") FROM "tbBoleto" 
WHERE "idEmpresa" = 75 
  AND "idImovel" = 966
  AND ("pago" = 0 OR "pago" IS NULL) 
  AND ("cancelado" = 0 OR "cancelado" IS NULL)
  AND ("origem" IS NULL OR "origem" NOT IN (5, 6))
`;

console.log(db.prepare(query).all());
