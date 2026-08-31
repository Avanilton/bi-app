import "dotenv/config";
import mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";

async function generateCsv() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });

  console.log("Buscando boletos no banco de producao...");
  
  // Pegamos os boletos do condominio 772 (idImovel = 772)
  const [rows] = await connection.execute(`
    SELECT 
      idBoleto, 
      idEmpresa, 
      dataVecto, 
      valorParc, 
      total, 
      origem, 
      pago, 
      cancelado,
      idImovel
    FROM TbBoleto
    WHERE idImovel = 772 AND pago = 0 AND cancelado = 0
  `);

  const boletos = rows as any[];
  
  const csvLines = [
    "idBoleto;idEmpresa;dataVecto;valorParc;total;origem;motivoDescarteApp"
  ];
  
  let totalApp = 0;

  for (const b of boletos) {
    let motivo = "";
    
    // Regras do app
    if (b.idEmpresa !== 75) {
      motivo = "idEmpresa != 75";
    } else if (b.origem === 5) {
      motivo = "origem 5 (Juridico)";
    } else if (b.origem === 6) {
      motivo = "origem 6 (Amigavel)";
    } else {
      motivo = "Lido pelo App";
      totalApp += Number(b.total) || 0;
    }
    
    const dataVecto = b.dataVecto ? new Date(b.dataVecto).toISOString().split('T')[0] : "";
    
    csvLines.push(`${b.idBoleto};${b.idEmpresa};${dataVecto};${b.valorParc};${b.total};${b.origem};${motivo}`);
  }

  const csvContent = csvLines.join("\n");
  
  // Create dir if not exists
  const dirPath = path.join(__dirname, "planilhas");
  if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "boletos_772_comparacao.csv");
  fs.writeFileSync(filePath, csvContent, "utf8");
  
  console.log(`CSV gerado com sucesso em: ${filePath}`);
  console.log(`Total calculado pelo App (sem descartados): R$ ${totalApp.toFixed(2)}`);

  await connection.end();
}

generateCsv().catch(console.error);
