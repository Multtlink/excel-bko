import { parseNomeAba, NormalizeSafra } from "@/utils/normalize";

type SheetData = Record<string, { asObjects: any[]; asArrays: any[][] }>;

export function compararExcels(clientesSheet: any[], tabelaSheets: SheetData) {
  for (const cliente of clientesSheet) {
    const documentoRaw = cliente?.DOCUMENTO_CLIENTE;
    const descricaoProduto = cliente?.DESCRICAO_PRODUTO;
    const detalhe = String(cliente?.DETALHE_TIPO_MOVIMENTO ?? "").trim();

    if (!descricaoProduto || !detalhe) continue;

    const safraNumeros = String(descricaoProduto).replace(/\D/g, "");
    if (!safraNumeros) continue;

    const ano = safraNumeros.slice(0, 4);
    const mes = safraNumeros.slice(4, 6);

    const documentoCliente = String(documentoRaw ?? "")
      .replace(/\D/g, "")
      .padStart(14, "0");

    const abaCorreta = Object.keys(tabelaSheets).find((nomeAba) => {
      const parsed = parseNomeAba(nomeAba);
      return parsed && parsed.ano === ano && parsed.mes === mes;
    });

    if (!abaCorreta) continue;

    const linhas = tabelaSheets[abaCorreta].asObjects;

    const registro = linhas.find((linha) => {
      const cnpjKey = Object.keys(linha).find(
        (k) => k.trim().toUpperCase() === "CNPJ",
      );
      const cnpjTabela = String(linha?.[cnpjKey ?? ""] ?? "")
        .replace(/\D/g, "")
        .padStart(14, "0");
      return cnpjTabela === documentoCliente;
    });

    if (!registro) continue;

    // Acha a chave STATUS CLIENTE ignorando espaços
    const statusKey = Object.keys(registro).find(
      (k) =>
        k.trim().toUpperCase() === "STATUS CLIENTE" ||
        k.trim().toUpperCase() === "STATUS",
    );

    if (statusKey) {
      // console.log(
      //   `[${abaCorreta}] CNPJ: ${documentoCliente} | STATUS ANTES: "${registro[statusKey]}" → DEPOIS: "${detalhe}"`,
      // );
      registro[statusKey] = detalhe;
    } else {
      // console.log(
      //     `[${abaCorreta}] CNPJ: ${documentoCliente} | STATUS ANTES: null → DEPOIS: "${detalhe}" (coluna nova)`,
      //   );
      registro["STATUS CLIENTE"] = detalhe;
    }
  }

  return tabelaSheets;
}
