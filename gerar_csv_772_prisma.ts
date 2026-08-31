import prisma from './src/lib/prisma';
import * as fs from "fs";
import * as path from "path";

async function generateCsvPrisma() {
  console.log("Buscando boletos localmente via Prisma...");
  
  const boletos = await prisma.tbBoleto.findMany({
    where: {
      idImovel: 772,
      pago: false,
      cancelado: false
    }
  });
  
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
    } else if (b.origem === 3) {
      motivo = "origem 3 (Amigavel/Outro)";
    } else {
      motivo = "Lido pelo App";
      totalApp += Number(b.total) || 0;
    }
    
    const dataVecto = b.dataVecto ? new Date(b.dataVecto).toISOString().split('T')[0] : "";
    const valorParc = Number(b.valorParc || 0).toFixed(2).replace('.', ',');
    const total = Number(b.total || 0).toFixed(2).replace('.', ',');
    
    csvLines.push(`${b.idBoleto};${b.idEmpresa};${dataVecto};${valorParc};${total};${b.origem};${motivo}`);
  }

  const csvContent = csvLines.join("\n");
  
  const dirPath = path.join(__dirname, "planilhas");
  if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "boletos_772_comparacao.csv");
  fs.writeFileSync(filePath, csvContent, "utf8");
  
  console.log(`CSV gerado com sucesso em: ${filePath}`);
  console.log(`Total calculado pelo App: R$ ${totalApp.toFixed(2)}`);

  await prisma.$disconnect();
}

generateCsvPrisma().catch(console.error);
