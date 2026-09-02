import prisma from './src/lib/prisma';

async function run() {
  try {
    console.log("Creating Usuario table...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Usuario\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`nome\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL,
        \`senha\` VARCHAR(191) NOT NULL,
        \`setor\` VARCHAR(191) NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL,
        UNIQUE INDEX \`Usuario_email_key\`(\`email\`),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    console.log("Table created!");

    // Create default admin user
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 10);
    
    // Check if admin exists
    const admin = await prisma.usuario.findUnique({ where: { email: 'admin@bvgarantia.com.br' } });
    if (!admin) {
      await prisma.usuario.create({
        data: {
          nome: 'Administrador',
          email: 'admin@bvgarantia.com.br',
          senha: hash,
          setor: 'Admin'
        }
      });
      console.log("Admin user created! (password: admin123)");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
run();
