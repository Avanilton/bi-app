import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function createAdmin() {
  const email = "admin@bvgarantia.com.br";
  const password = "admin";
  
  try {
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log(`Usuário ${email} já existe! Tente fazer login.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.usuario.create({
      data: {
        nome: "Administrador Geral",
        email: email,
        senha: hashedPassword,
        setor: "Admin",
      },
    });

    console.log("====================================");
    console.log("✅ Usuário administrador criado com sucesso!");
    console.log(`👤 Nome: ${admin.nome}`);
    console.log(`📧 E-mail: ${admin.email}`);
    console.log(`🔑 Senha: ${password}`);
    console.log(`🏢 Setor: ${admin.setor}`);
    console.log("====================================");
    console.log("Agora você já pode fazer login na plataforma.");
    
  } catch (error) {
    console.error("Erro ao criar usuário administrador:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
