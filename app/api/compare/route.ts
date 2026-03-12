import { readExcel } from "@/utils/readExcel";
import { compararExcels, processarFaturas } from "@/utils/compare";
import { NextResponse } from "next/server";
import * as xlsx from "xlsx";

const ORDEM_COLUNAS = [
  "DATA ENTRADA", "RAZÃO SOCIAL", "CNPJ", "SEGMENTO", "FAMILIA",
  "PEDIDO PORTIN", "STATUS PORTIN", "CONSULTOR", "DATA PORTIN", "MVE",
  "CONTATO", "OVER 30", "OVER 60", "STATUS CLIENTE", "QTD", "OBS PORTIN",
  "TIPO DE CHIP", "DATA DE ENTRADA/CODIGO RASTREIO", "OBG ENTREGA",
];

const COLUNAS_FATURA = [
  "DOCUMENTO_CLIENTE", "NOME_CLIENTE", "CONTATO",
  "COMPETENCIA", "NUMERO_PEDIDO", "NUMERO_CONTA", "NUMERO_LINHA",
  "DATA_EVENTO", "DATA_SERVICO", "DESCRICAO_PRODUTO", "TIPO_MOVIMENTO",
  "DETALHE_TIPO_MOVIMENTO", "VALOR_ASSINATURA", "VALOR_DESCONTO",
  "VALOR_FINAL", "QUANTIDADE",
];

function gerarExcelFatura(lista: any[]): string {
  const dadosFormatados = lista.map((item) => {
    const d3 = item.dadosExcel3 ?? {};
    const d2 = item.dadosExcel2 ?? {};
    const contatoKey = Object.keys(d2).find(
      (k) => k.trim().toUpperCase() === "CONTATO"
    );
    const contato = contatoKey ? d2[contatoKey] : null;
    const linha: Record<string, any> = {};
    for (const col of COLUNAS_FATURA) {
      linha[col] = col === "CONTATO" ? contato : d3[col] ?? null;
    }
    return linha;
  });

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(dadosFormatados, { header: COLUNAS_FATURA });
  const colWidths = COLUNAS_FATURA.map((col) => ({
    wch: Math.max(col.length, ...dadosFormatados.map((l) => String(l[col] ?? "").length)) + 2,
  }));
  ws["!cols"] = colWidths;
  xlsx.utils.book_append_sheet(wb, ws, "Faturas");
  return xlsx.write(wb, { type: "base64", bookType: "xlsx" });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const formexcel1 = formData.get("excel-1") as File | null;
    const formexcel2 = formData.get("excel-2") as File | null;
    const formexcel3 = formData.get("excel-3") as File | null;

    if (!formexcel1 || !formexcel2) {
      return NextResponse.json({ error: "Arquivos obrigatórios não enviados" }, { status: 400 });
    }

    const excel1 = await readExcel(formexcel1);
    const buffer2 = await formexcel2.arrayBuffer();
    const workbook2 = xlsx.read(buffer2);
    const excel2 = await readExcel(new File([buffer2], formexcel2.name));

    const firstSheet1 = Object.keys(excel1)[0];
    if (!firstSheet1) {
      return NextResponse.json({ error: "Excel 1 não tem abas" }, { status: 400 });
    }

    const clientes = excel1[firstSheet1].asObjects ?? [];
    const { tabelaSheets, atualizados } = compararExcels(clientes, excel2);

    let faturas: Record<string, any[]> = {};
    let excelFaturas: Record<string, string> = {};

    if (formexcel3) {
      const excel3 = await readExcel(formexcel3);
      const firstSheet3 = Object.keys(excel3)[0];
      if (firstSheet3) {
        const linhas3 = excel3[firstSheet3].asObjects ?? [];
        faturas = processarFaturas(linhas3, tabelaSheets);
        for (const tipo of ["01a30", "31a60", "61a90"]) {
          if (faturas[tipo]?.length > 0) {
            excelFaturas[tipo] = gerarExcelFatura(faturas[tipo]);
          }
        }
      }
    }

    const abasDados: Record<string, any[]> = {};
    for (const nomeAba of workbook2.SheetNames) {
      const dados = tabelaSheets[nomeAba]?.asObjects;
      if (!dados || dados.length === 0) continue;

      const dadosOrdenados = dados.map((linha: any) => {
        const novaLinha: Record<string, any> = {};
        for (const col of ORDEM_COLUNAS) {
          const key = Object.keys(linha).find((k) => {
            const kNorm = k.trim().toUpperCase();
            const colNorm = col.trim().toUpperCase();
            if (colNorm === "STATUS CLIENTE") return kNorm === "STATUS CLIENTE" || kNorm === "STATUS";
            return kNorm === colNorm;
          });
          novaLinha[col] = key ? linha[key] : null;
        }
        return novaLinha;
      });

      abasDados[nomeAba] = dadosOrdenados;

      const novaSheet = xlsx.utils.json_to_sheet(dadosOrdenados, { header: ORDEM_COLUNAS });
      const colWidths = ORDEM_COLUNAS.map((col) => ({
        wch: Math.max(col.length, ...dadosOrdenados.map((l: any) => String(l[col] ?? "").length)) + 2,
      }));
      novaSheet["!cols"] = colWidths;
      workbook2.Sheets[nomeAba] = novaSheet;
    }

    const outputBuffer = xlsx.write(workbook2, { type: "base64", bookType: "xlsx" });

    return NextResponse.json({
      abas: Object.keys(abasDados),
      dados: abasDados,
      excelBase64: outputBuffer,
      excelFaturas,
      faturas,
      atualizados,
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}