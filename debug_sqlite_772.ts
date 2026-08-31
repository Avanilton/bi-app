import Database from "better-sqlite3";

function debugSqlite772() {
  const db = new Database('dev.db');
  
  const boletos = db.prepare(`
    SELECT idBoleto, dataVecto, total, origem, idEmpresa, pago, cancelado
    FROM TbBoleto 
    WHERE idImovel = 772 AND pago = 0 AND cancelado = 0
  `).all();
  
  let totalApp = 0;
  let totalAll = 0;

  for (const b of boletos) {
    totalAll += Number(b.total) || 0;
    
    // Regra do App (idEmpresa = 75 e origem != 5 e origem != 6)
    if (b.idEmpresa === 75 && b.origem !== 5 && b.origem !== 6) {
      totalApp += Number(b.total) || 0;
    }
  }

  console.log(`Total App (Empresa=75, sem origem 5,6): R$ ${totalApp.toFixed(2)}`);
  console.log(`Total ALL (Todos idEmpresa e todas origens): R$ ${totalAll.toFixed(2)}`);
  
  // Find which boletos sum up to the difference (781.38)
  const diffTarget = 781.38;
  const tolerance = 0.05;
  
  for (const b of boletos) {
    if (Math.abs(Number(b.total) - diffTarget) < tolerance) {
      console.log(`Boleto com valor exato da diferenca achado! ID: ${b.idBoleto}, Origem: ${b.origem}, Empresa: ${b.idEmpresa}, Valor: ${b.total}, Venc: ${new Date(Number(b.dataVecto)).toISOString()}`);
    }
  }
}

debugSqlite772();
