import prisma from './src/lib/prisma';
import * as fs from "fs";
import * as path from "path";

async function generateCsvPrisma1241() {
  console.log("Buscando boletos localmente via Prisma...");
  
  const boletos = await prisma.tbBoleto.findMany({
    where: {
      idImovel: 1241,
      pago: false,
      cancelado: false
    }
  });
  
  const csvLines = [
    "idBoleto;idEmpresa;dataVecto;valorParc;total;origem;motivoDescarteApp"
  ];
  
  let totalApp = 0;
  const validBoletos = [];

  for (const b of boletos) {
    let motivo = "";
    
    // Regras do app
    const dataVecto = b.dataVecto ? new Date(b.dataVecto) : null;
    const isPastDue = dataVecto && dataVecto < new Date(new Date().setHours(0,0,0,0));
    
    if (b.idEmpresa !== 75) {
      motivo = "idEmpresa != 75";
    } else if (b.origem === 5) {
      motivo = "origem 5 (Juridico)";
    } else if (b.origem === 3) {
      motivo = "origem 3 (Amigavel/Outro)";
    } else if (!isPastDue) {
      motivo = "Vencimento no futuro";
    } else {
      motivo = "Lido pelo App";
      totalApp += Number(b.total) || 0;
      validBoletos.push(b);
    }
    
    const dateStr = b.dataVecto ? new Date(b.dataVecto).toISOString().split('T')[0] : "";
    const valorParc = Number(b.valorParc || 0).toFixed(2).replace('.', ',');
    const total = Number(b.total || 0).toFixed(2).replace('.', ',');
    
    csvLines.push(`${b.idBoleto};${b.idEmpresa};${dateStr};${valorParc};${total};${b.origem};${motivo}`);
  }

  const csvContent = csvLines.join("\n");
  
  const dirPath = path.join(__dirname, "planilhas");
  if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "boletos_1241_comparacao.csv");
  fs.writeFileSync(filePath, csvContent, "utf8");
  
  console.log(`CSV gerado com sucesso em: ${filePath}`);
  console.log(`Total calculado pelo App: R$ ${totalApp.toFixed(2)}`);
  
  const diff = 850.54;
  console.log(`\nProcurando boletos no App que somem aproximadamente R$ ${diff}...`);
  for (const b of validBoletos) {
      const val = Number(b.total) || 0;
      if (Math.abs(val - diff) < 0.10) {
          console.log(`Boleto achado (id: ${b.idBoleto}): R$ ${val}`);
      }
  }

  await prisma.$disconnect();
}

generateCsvPrisma1241().catch(console.error);
