import cron from 'node-cron';
import { runInadimplenciaAutomation } from './run_automation';

// Agenda para rodar todos os dias às 7h da manhã
cron.schedule('0 7 * * *', async () => {
    console.log(`[CRON] Iniciando automação de Inadimplência às ${new Date().toLocaleString()}`);
    try {
        await runInadimplenciaAutomation();
        console.log(`[CRON] Automação finalizada com sucesso.`);
    } catch (error) {
        console.error(`[CRON] Erro na automação:`, error);
    }
});

console.log("Serviço de Cron iniciado. Aguardando horários agendados...");
