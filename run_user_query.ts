import fs from "fs";
import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    host: "sistemasnovacorp.com.br",
    port: 5643,
    user: "Intelligence",
    password: "@bv2026@",
    database: "novacorpconect",
    timezone: "-03:00",
    connectTimeout: 10000,
  });

  const queries = [
    `SELECT
    SUM(
        CASE
            WHEN M.tipoMvto = 2
                THEN (M.valorRecebido - M.troco)
        END
    ) AS valorCredito,

    SUM(
        CASE
            WHEN M.tipoMvto = 1
                THEN M.valorMvto
        END
    ) AS valorDebito,

    T.tipoPgto,
    M.idTipoPgto

FROM TbCaixaMovi M,
     TbTipoPgto T

WHERE M.idEmpresa = T.idEmpresa
  AND M.idTipoPgto = T.idTipoPgto
  AND M.idFuncionario = 1
  AND M.idEmpresa = 75
  AND M.transferido = false

GROUP BY
    T.tipoPgto,
    M.idTipoPgto;`,
    `SELECT
    *
FROM TbConta
WHERE inativo = 0
  AND idEmpresa = 75;`
  ];

  const results: any[] = [];

  for (let i = 0; i < queries.length; i++) {
    try {
      console.log(`Running query ${i + 1}...`);
      const [rows] = await connection.execute(queries[i]);
      results.push({ query: queries[i], status: 'success', data: rows });
      console.log(`Query ${i + 1} succeeded!`);
    } catch (e: any) {
      console.log(`Error in query ${i + 1}:`, e.message);
      results.push({ query: queries[i], status: 'error', error: e.message });
    }
  }

  const outputPath = 'resultado_novacorp.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outputPath}`);
  await connection.end();
}

main().catch(console.error);
