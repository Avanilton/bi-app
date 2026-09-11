const fs = require('fs');
const { PrismaClient } = require('./prisma/generated/local-client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({url: 'file:local.db'});
const p = new PrismaClient({adapter});

const parseDDMMYYYY = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  }
  return null;
};

async function test() {
  const lastRecord = await p.inadimplenciaDiaria.findFirst({
    orderBy: { dataExecucao: "desc" }
  });
  
  if (!lastRecord || !lastRecord.detalhes) {
    console.log("No record");
    return;
  }
  
  let detalhes = JSON.parse(lastRecord.detalhes);
  
  const nome = "AGUAS CLARAS";
  let condDetalhes = detalhes.filter(d => {
    const docNome = (d.condominio || "").toUpperCase().trim();
    return docNome.includes(nome) || nome.includes(docNome);
  });
  
  console.log(`Found ${condDetalhes.length} matches for ${nome}`);
  if (condDetalhes.length > 0) {
    const c = condDetalhes[0];
    console.log(`Total before date filter:`, c.valor);
    console.log(`Condominos count:`, c.condominos.length);
    if (c.condominos.length > 0) {
       console.log("Sample docs:", c.condominos[0].documentos.slice(0, 2));
    }
    
    // Simulate date filter
    const startDate = new Date('2025-05-01T00:00:00.000Z');
    const endDate = new Date('2025-05-31T23:59:59.999Z');
    
    let totalCondominio = 0;
    const condominosFiltrados = c.condominos.map(pessoa => {
      const documentosFiltrados = pessoa.documentos.filter(doc => {
        const docDate = parseDDMMYYYY(doc.vecto);
        if (!docDate) return false;
        return docDate >= startDate && docDate <= endDate;
      });
      const totalPessoa = documentosFiltrados.reduce((acc, cur) => acc + (cur.valor || 0), 0);
      totalCondominio += totalPessoa;
      return { ...pessoa, documentos: documentosFiltrados, valor: totalPessoa };
    });
    console.log(`Total after date filter:`, totalCondominio);
  }
  
  p.$disconnect();
}
test();
