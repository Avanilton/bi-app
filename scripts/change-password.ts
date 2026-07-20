import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function changeAdminPassword() {
  const email = "admin@bvgarantia.com.br";
  const newPassword = "123456";
  
  try {
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (existingAdmin) {
      await prisma.usuario.update({
        where: { email },
        data: { senha: hashedPassword },
      });
      console.log(`Senha atualizada para ${newPassword}`);
    } else {
      await prisma.usuario.create({
        data: {
          nome: "Administrador Geral",
          email: email,
          senha: hashedPassword,
          setor: "Admin",
        },
      });
      console.log(`Usuário criado com a senha ${newPassword}`);
    }
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

changeAdminPassword();
