import Database from 'better-sqlite3';

console.log("Analyzing dev.db...");
const db = new Database('dev.db');
db.exec('ANALYZE;');
console.log("Analyze complete.");
