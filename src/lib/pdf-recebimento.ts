import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);

export async function getRecebimentoTotalAsync(): Promise<string> {
  const cachePath = path.join(process.cwd(), 'planilhas', 'recebimentos_total_cache.txt');
  const pdfPath = path.join(process.cwd(), 'planilhas', 'recebimentos.pdf');
  
  if (!fs.existsSync(pdfPath)) return "0,00";

  const pdfStats = fs.statSync(pdfPath);
  
  let useCache = false;
  if (fs.existsSync(cachePath)) {
    const cacheStats = fs.statSync(cachePath);
    if (cacheStats.mtime > pdfStats.mtime) {
      useCache = true;
    }
  }

  if (useCache) {
    return fs.readFileSync(cachePath, 'utf-8').trim();
  }

  try {
    const pythonScript = path.join(process.cwd(), 'get_recebimentos_total.py');
    const { stdout } = await execAsync(`python "${pythonScript}"`);
    const total = stdout.trim();
    if (total) {
      fs.writeFileSync(cachePath, total);
      return total;
    }
  } catch (e) {
    console.error("Erro ao ler PDF de recebimentos via python", e);
  }
  return "0,00";
}
