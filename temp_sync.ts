import { PrismaClient as LocalPrismaClient } from './prisma/generated/local-client';
import { PrismaClient as GlobalPrismaClient } from '@prisma/client';

const prismaLocal = new LocalPrismaClient({ datasources: { db: { url: 'file:./local.db' } } } as any);
const prismaGlobal = new GlobalPrismaClient();

async function main() {
    console.log("Iniciando sincronização dos agregados do Dashboard...");
    try {
        console.log("Buscando agrupamento FATURAMENTO...");
        const faturamento = await prismaGlobal.tbBoleto.groupBy({
            by: ['idImovel', 'dataVecto'],
            _sum: { total: true },
            where: { idEmpresa: 75, cancelado: false, dataVecto: { not: null } }
        });
        console.log(`> Obtidos ${faturamento.length} registros de Faturamento.`);
        
        let batch: any[] = [];
        for (const item of faturamento) {
            if (item.dataVecto && item._sum.total !== null) {
                batch.push({
                    idImovel: item.idImovel,
                    tipo: "FATURAMENTO",
                    data: item.dataVecto,
                    total: item._sum.total
                });
            }
        }

        console.log(`Inserindo ${batch.length} registros no SQLite...`);
        const chunkSize = 10000;
        for (let i = 0; i < batch.length; i += chunkSize) {
            const chunk = batch.slice(i, i + chunkSize);
            await prismaLocal.dashboardAggregates.createMany({ data: chunk });
            console.log(`> Lote inserido: ${i + chunk.length} / ${batch.length}`);
        }
        
        console.log("Sincronização dos agregados concluída com sucesso!");
    } catch (error) {
        console.error("Erro ao sincronizar agregados:", error);
    } finally {
        await prismaGlobal.$disconnect();
    }
}

main().catch(console.error);
