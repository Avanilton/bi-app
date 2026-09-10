import { createClient } from '@libsql/client';
const client = createClient({ url: 'file:local.db' });
async function run() {
    await client.execute(`DELETE FROM InadimplenciaDiaria WHERE dataExecucao >= date('now', '-1 day') AND (valorTotal = 0 OR nomeCondominio = 'TOMAZINA')`);
    console.log('Cleaned TOMAZINA and zeros');
}
run();
