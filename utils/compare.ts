import { parseNomeAba } from "@/utils/normalize";

type SheetData = Record<string, { asObjects: any[]; asArrays: any[][] }>;

const normalizeCnpj = (value: any) =>
  String(value ?? "")
    .replace(/\D/g, "")
    .padStart(14, "0");

const findKey = (obj: Record<string, any>, keys: string[]) =>
  Object.keys(obj).find((k) => keys.includes(k.trim().toUpperCase()));

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
    const documentoCliente = normalizeCnpj(documentoRaw);

    const abaCorreta = Object.keys(tabelaSheets).find((nomeAba) => {
      const parsed = parseNomeAba(nomeAba);
      return parsed && parsed.ano === ano && parsed.mes === mes;
    });

    if (!abaCorreta) continue;

    const linhas = tabelaSheets[abaCorreta].asObjects;

    const registro = linhas.find((linha) => {
      const cnpjKey = findKey(linha, ["CNPJ"]);
      const cnpjTabela = normalizeCnpj(linha?.[cnpjKey ?? ""] ?? "");
      return cnpjTabela === documentoCliente;
    });

    if (!registro) continue;

    const statusKey = findKey(registro, ["STATUS CLIENTE", "STATUS"]);
    if (statusKey) {
      registro[statusKey] = detalhe;
    } else {
      registro["STATUS CLIENTE"] = detalhe;
    }
  }

  return tabelaSheets;
}

export function processarFaturas(linhas3: any[], tabelaSheets: SheetData) {
  const faturas: Record<string, any[]> = {
    A_Vencer: [],
    "01a30": [],
    "31a60": [],
    "61a90": [],
    Outros: [],
  };

  const PRIORIDADE = ["A_Vencer", "01a30", "31a60", "61a90"];
  const TIPOS_VALIDOS = new Set(["A_Vencer", "01a30", "31a60", "61a90"]);

  const porCnpj: Record<
    string,
    {
      tipos: string[];
      linhasPorTipo: Record<string, any>;
      dadosExcel2: any;
      cnpj: string;
    }
  > = {};

  for (const linha of linhas3) {
    const documentoRaw = linha?.DOCUMENTO_CLIENTE;
    const tipoFatura = String(linha?.DETALHE_TIPO_MOVIMENTO ?? "").trim();

    if (!documentoRaw || !tipoFatura) continue;
    if (!TIPOS_VALIDOS.has(tipoFatura)) continue; // ignora 106a180, 91a105 etc

    const cnpj = String(documentoRaw).replace(/\D/g, "").padStart(14, "0");

    // Filtra pela OBSERVACAO: só aceita dos últimos 12 meses
    const observacao = String(linha?.OBSERVACAO ?? "").trim();
    if (observacao) {
      const ano = parseInt(observacao.slice(0, 4));
      const mes = parseInt(observacao.slice(4, 6));

      if (!isNaN(ano) && !isNaN(mes)) {
        const dataObs = new Date(ano, mes - 1, 1);
        const hoje = new Date();
        const dozeAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 12, 1);

        if (dataObs < dozeAtras) continue; // ignora se for mais de 12 meses atrás
      }
    }

    // Busca dados no Excel 2
    let dadosCliente: any = null;
    for (const nomeAba of Object.keys(tabelaSheets)) {
      const linhasAba = tabelaSheets[nomeAba].asObjects;
      const encontrado = linhasAba.find((l) => {
        const cnpjKey = Object.keys(l).find(
          (k) => k.trim().toUpperCase() === "CNPJ",
        );
        const cnpjTabela = String(l?.[cnpjKey ?? ""] ?? "")
          .replace(/\D/g, "")
          .padStart(14, "0");
        return cnpjTabela === cnpj;
      });
      if (encontrado) {
        dadosCliente = { ...encontrado, _aba: nomeAba };
        break;
      }
    }

    if (!porCnpj[cnpj]) {
      porCnpj[cnpj] = {
        tipos: [],
        linhasPorTipo: {},
        dadosExcel2: dadosCliente ?? {
          "RAZÃO SOCIAL": "—",
          CNPJ: documentoRaw,
          _aba: "Não encontrado no Excel 2",
        },
        cnpj: documentoRaw,
      };
    }

    if (!porCnpj[cnpj].tipos.includes(tipoFatura)) {
      porCnpj[cnpj].tipos.push(tipoFatura);
    }

    // guarda a linha do excel3 para cada tipo
    porCnpj[cnpj].linhasPorTipo[tipoFatura] = linha;
  }

  for (const { tipos, linhasPorTipo, dadosExcel2, cnpj } of Object.values(
    porCnpj,
  )) {
    let grupoPrioritario = "Outros";
    let maiorIndice = -1;

    for (const tipo of tipos) {
      const idx = PRIORIDADE.indexOf(tipo);
      if (idx > maiorIndice) {
        maiorIndice = idx;
        grupoPrioritario = tipo;
      }
    }

    faturas[grupoPrioritario].push({
      cnpj,
      tipoFatura: grupoPrioritario,
      todosTipos: tipos,
      dadosExcel2,
      dadosExcel3:
        linhasPorTipo[grupoPrioritario] ?? Object.values(linhasPorTipo)[0],
    });
  }

  return Object.fromEntries(
    Object.entries(faturas).filter(([_, v]) => v.length > 0),
  );
}
