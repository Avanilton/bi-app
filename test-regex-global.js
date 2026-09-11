const text = `
126537 - TIAGO DE AGUIAR SANTOS - CARTEIRA                     BLOCO 02-105
Documento      Ref.      Vecto      Valor              Total
4970956
05/2025
10/05/2025
R$ 401,47
R$ 401,47

5934334 12/2025 10/05/2025 R$ 1.389,01
`;

const regex = /(?:\*\s*)?(\d{6,9})\s+(\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+(-?R\$)\s*([\d\.,]+)/g;

let match;
while ((match = regex.exec(text)) !== null) {
  console.log("Matched:", match[1], match[2], match[3], match[4], match[5]);
}
