import prisma from '../src/lib/prisma';

async function main() {
    try {
        console.log("Connecting...");
        const res = await prisma.tbImovel.findMany({ take: 5, select: { idImovel: true, nomeFantasia: true } });
        console.log("Result:", res);
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}
main();
