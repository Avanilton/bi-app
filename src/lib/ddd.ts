export const DDD_ESTADOS: Record<string, number[]> = {
  AC: [68], AL: [82], AM: [92, 97], AP: [96], 
  BA: [71, 73, 74, 75, 77], CE: [85, 88], DF: [61], 
  ES: [27, 28], GO: [61, 62, 64], MA: [98, 99], 
  MG: [31, 32, 33, 34, 35, 37, 38], MS: [67], MT: [65, 66], 
  PA: [91, 93, 94], PB: [83], PE: [81, 87], PI: [86, 89], 
  PR: [41, 42, 43, 44, 45, 46], RJ: [21, 22, 24], RN: [84], 
  RO: [69], RR: [95], RS: [51, 53, 54, 55], SC: [47, 48, 49], 
  SE: [79], SP: [11, 12, 13, 14, 15, 16, 17, 18, 19], TO: [63]
};

export const ESTADOS_REGIAO: Record<string, string[]> = {
  "Sul": ["PR", "SC", "RS"],
  "Sudeste": ["SP", "RJ", "ES", "MG"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"],
  "Nordeste": ["BA", "SE", "PE", "AL", "PB", "RN", "CE", "PI", "MA"],
  "Norte": ["AM", "PA", "RR", "AP", "AC", "RO", "TO"]
};

export function getDDDsForEstado(estado: string): number[] {
  return DDD_ESTADOS[estado] || [];
}

export function getDDDsForRegiao(regiao: string): number[] {
  const estados = ESTADOS_REGIAO[regiao] || [];
  let ddds: number[] = [];
  estados.forEach(uf => {
    ddds = ddds.concat(DDD_ESTADOS[uf] || []);
  });
  return ddds;
}
