import prisma from './src/lib/prisma';

async function run() {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email: 'admin@bvgarantia.com.br' },
    });
    console.log(usuario);
  } catch (error) {
    console.error("Prisma error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
run();
