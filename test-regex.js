const line = "4970956      05/2025    10/05/2025    R$ 401,47";
let singleLineDoc = line.match(/^(?:\*\s*)?(\d{6,9})\s+(\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+(-?R\$)\s*([\d\.,]+)/i);
console.log(singleLineDoc);

const line2 = "4970956";
console.log(/^(?:\*\s*)?\d{6,9}$/.test(line2));
