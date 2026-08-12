import { NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";

const PLANILHAS_DIR = path.join(process.cwd(), "planilhas");
const STATUS_FILE = path.join(PLANILHAS_DIR, "status.json");
const DADOS_FILE = path.join(PLANILHAS_DIR, "dados.json");
const LOG_FILE = path.join(PLANILHAS_DIR, "progresso.log");

export async function GET() {
  try {
    let status = { status: "idle" } as any;
    let dados = null as any;
    let log = "";

    if (fs.existsSync(STATUS_FILE)) {
      const raw = fs.readFileSync(STATUS_FILE, "utf-8");
      status = JSON.parse(raw);
    }

    if (fs.existsSync(DADOS_FILE)) {
      const raw = fs.readFileSync(DADOS_FILE, "utf-8");
      dados = JSON.parse(raw);
    }

    if (fs.existsSync(LOG_FILE)) {
      // Retorna as últimas 50 linhas do log
      const allLines = fs.readFileSync(LOG_FILE, "utf-8").split("\n");
      log = allLines.slice(-50).join("\n");
    }

    return NextResponse.json({
      status: status.status,   // "idle" | "running" | "done" | "error"
      startedAt: status.startedAt || null,
      updatedAt: status.updatedAt || dados?.updatedAt || null,
      error: status.error || null,
      dados,
      log,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao ler status." },
      { status: 500 }
    );
  }
}
