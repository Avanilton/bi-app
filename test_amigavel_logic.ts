import "dotenv/config";
import mysql from "mysql2/promise";

async function hunt() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    decimalNumbers: true
  });
  
  const [rows] = await connection.execute(`
    SELECT idBoleto, idCliente, origem, pago, cancelado, total, dataVecto
    FROM TbBoleto 
    WHERE idEmpresa = 75 
      AND origem IN (5, 6, 99)
  `);

  const boletos = rows as any[];

  // Group by client
  const byClient: Record<string, any[]> = {};
  for (const b of boletos) {
    if (!byClient[b.idCliente]) byClient[b.idCliente] = [];
    byClient[b.idCliente].push(b);
  }

  let totalAmigavel = 0;
  let countBoletos = 0;

  for (const idCliente in byClient) {
    const clientBoletos = byClient[idCliente];
    
    // Sort by idBoleto DESC to find the LATEST action
    clientBoletos.sort((a, b) => b.idBoleto - a.idBoleto);
    
    const latestAction = clientBoletos[0];
    
    // If their latest action is 5, they are Amigável.
    if (latestAction.origem === 5) {
      // Sum their unpaid, uncancelled origem 5 boletos that are <= today
      for (const b of clientBoletos) {
        if (b.origem === 5 && !b.pago && !b.cancelado) {
          const dtVecto = new Date(b.dataVecto);
          const today = new Date();
          // Ignorar hora
          dtVecto.setHours(0,0,0,0);
          today.setHours(0,0,0,0);
          
          if (dtVecto <= today) {
            totalAmigavel += parseFloat(b.total);
            countBoletos++;
          }
        }
      }
    }
  }

  console.log("Total Amigavel (Latest = 5):", totalAmigavel);
  console.log("Count Boletos:", countBoletos);
  
  await connection.end();
}

hunt().catch(console.error);
