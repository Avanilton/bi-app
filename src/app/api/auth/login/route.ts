import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import Database from "better-sqlite3";

const JWT_SECRET = process.env.JWT_SECRET || "bi-bvgarantia-secret-key-2026";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Usa SQLite local para autenticação (tabela Usuario existe no dev.db)
    const dbPath = path.join(process.cwd(), "dev.db");
    const db = new Database(dbPath, { readonly: true });

    const usuario = db.prepare("SELECT * FROM Usuario WHERE email = ?").get(email) as {
      id: number;
      nome: string;
      email: string;
      senha: string;
      setor: string;
    } | undefined;

    db.close();

    if (!usuario) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.senha);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Criar token JWT
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email, setor: usuario.setor },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        setor: usuario.setor
      }
    });

    // Definir cookie HttpOnly
    response.cookies.set("bi_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 horas
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

