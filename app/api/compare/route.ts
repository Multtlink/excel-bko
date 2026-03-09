import { readExcel } from "@/utils/readExcel";
import { compararExcels } from "@/utils/compare";
import { NextResponse } from "next/server";
import * as xlsx from "xlsx";

const ORDEM_COLUNAS = [
  "DATA ENTRADA",
  "RAZÃO SOCIAL",
  "CNPJ",
  "SEGMENTO",
  "FAMILIA",
  "PEDIDO PORTIN",
  "STATUS PORTIN",
  "CONSULTOR",
  "DATA PORTIN",
  "MVE",
  "CONTATO",
  "OVER 30",
  "OVER 60",
  "STATUS CLIENTE",
  "QTD",
  "OBS PORTIN",
  "TIPO DE CHIP",
  "DATA DE ENTRADA/CODIGO RASTREIO",
  "OBG ENTREGA",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const formexcel1 = formData.get("excel-1") as File | null;
    const formexcel2 = formData.get("excel-2") as File | null;

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
    compararExcels(clientes, excel2);

    // Monta dados reordenados por aba para o frontend
    const abasDados: Record<string, any[]> = {};

    for (const nomeAba of workbook2.SheetNames) {
      const dados = excel2[nomeAba]?.asObjects;
      if (!dados || dados.length === 0) continue;

      const dadosOrdenados = dados.map((linha: any) => {
        const novaLinha: Record<string, any> = {};
        for (const col of ORDEM_COLUNAS) {
          const key = Object.keys(linha).find((k) => {
            const kNorm = k.trim().toUpperCase();
            const colNorm = col.trim().toUpperCase();
            if (colNorm === "STATUS CLIENTE") {
              return kNorm === "STATUS CLIENTE" || kNorm === "STATUS";
            }
            return kNorm === colNorm;
          });
          novaLinha[col] = key ? linha[key] : null;
        }
        return novaLinha;
      });

      abasDados[nomeAba] = dadosOrdenados;

      // Atualiza o workbook para o download
      const novaSheet = xlsx.utils.json_to_sheet(dadosOrdenados, {
        header: ORDEM_COLUNAS,
      });
      workbook2.Sheets[nomeAba] = novaSheet;
    }

    // Gera o Excel em base64 para download sob demanda
    const outputBuffer = xlsx.write(workbook2, { type: "base64", bookType: "xlsx" });

    return NextResponse.json({
      abas: Object.keys(abasDados),
      dados: abasDados,
      excelBase64: outputBuffer,
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}