import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DebugPage() {
  const boletos = await prisma.tbBoleto.findMany({
    where: {
      idImovel: 542,
      OR: [{ pago: false }, { pago: null }],
      AND: [ { OR: [{ cancelado: false }, { cancelado: null }] } ]
    }
  });

  const ids = [7348766, 3622010, 7348769, 6188759, 6972768, 7174688, 7348761];
  
  const problemBoletos = boletos.filter(b => ids.includes(b.idBoleto));
  const missingIds = ids.filter(id => !boletos.some(b => b.idBoleto === id));

  let total = 0;
  for (const b of boletos) {
    total += b.total || 0;
  }

  const result = {
    totalAbertosNaoCancelados: total,
    quantidadeAbertos: boletos.length,
    problemBoletosEncontrados: problemBoletos,
    missingIds: missingIds
  };

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h1>Debug 542</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
