export const NormalizeSafra = (safra: string): string => {
  const numeros = String(safra).replace(/\D/g, "");
  const ano = numeros.slice(0, 4);
  const mes = numeros.slice(4, 6);
  return `${ano}-${mes}`;
};

export function parseNomeAba(nomeAba: string): { ano: string; mes: string } | null {
  const limpo = nomeAba
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "") // remove todos os espaços
    .trim();

  const meses: Record<string, string> = {
    JANEIRO: "01",
    FEVEREIRO: "02",
    MARCO: "03",
    ABRIL: "04",
    MAIO: "05",
    JUNHO: "06",
    JULHO: "07",
    AGOSTO: "08",
    SETEMBRO: "09",
    OUTUBRO: "10",
    NOVEMBRO: "11",
    DEZEMBRO: "12",
  };

  // Formato: "FEVEREIRO25", "FEVEREIRO2025", "JANEIRO 24"
  const matchNome = limpo.match(/^([A-Z]+)(\d{2,4})$/);
  if (matchNome) {
    const mes = meses[matchNome[1]];
    if (mes) {
      const anoRaw = matchNome[2];
      const ano = anoRaw.length === 2 ? "20" + anoRaw : anoRaw;
      return { ano, mes };
    }
  }

  // Formato: sem ano — "JULHO", "ABRIL", "MAIO" (assume ano atual)
  const matchSemAno = limpo.match(/^([A-Z]+)$/);
  if (matchSemAno) {
    const mes = meses[matchSemAno[1]];
    if (mes) {
      const ano = new Date().getFullYear().toString();
      return { ano, mes };
    }
  }

  // Formato numérico: "202505"
  const matchNumerico = limpo.match(/^(\d{4})(\d{2})$/);
  if (matchNumerico) {
    return { ano: matchNumerico[1], mes: matchNumerico[2] };
  }

  return null;
}