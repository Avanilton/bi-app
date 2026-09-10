import { createClient } from '@libsql/client';
const client = createClient({ url: 'file:local.db' });
async function run() {
    const today = new Date().toISOString().split('T')[0];
    const r = await client.execute({ sql: 'SELECT * FROM InadimplenciaDiaria WHERE substr(dataExecucao, 1, 10) = ? ORDER BY dataExecucao DESC LIMIT 1', args: [today] });
    if (r.rows.length > 0) {
        const row = r.rows[0];
        let data = JSON.parse(row.detalhes as string);
        const oldLength = data.length;
        data = data.filter((d: any) => d.valor > 0 && d.condominos.length > 0);
        console.log('Removendo ' + (oldLength - data.length) + ' zerados...');
        await client.execute({ sql: 'UPDATE InadimplenciaDiaria SET detalhes = ? WHERE id = ?', args: [JSON.stringify(data), row.id] });
        console.log('Limpeza concluída!');
    }
}
run().catch(console.error);
