"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CORES_FATURA: Record<string, string> = {
  A_Vencer: "bg-blue-100 text-blue-700 border-blue-300",
  "01a30": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "31a60": "bg-orange-100 text-orange-700 border-orange-300",
  "61a90": "bg-red-100 text-red-700 border-red-300",
  Outros: "bg-neutral-100 text-neutral-700 border-neutral-300",
};

const COLUNAS_EXIBIR = [
  "DOCUMENTO_CLIENTE",
  "NOME_CLIENTE",
  "CONTATO",
  "COMPETENCIA",
  "NUMERO_PEDIDO",
  "NUMERO_CONTA",
  "NUMERO_LINHA",
  "DATA_EVENTO",
  "DATA_SERVICO",
  "DESCRICAO_PRODUTO",
  "TIPO_MOVIMENTO",
  "DETALHE_TIPO_MOVIMENTO",
  "VALOR_ASSINATURA",
  "VALOR_DESCONTO",
  "VALOR_FINAL",
  "QUANTIDADE",
];

const PAGE_SIZE = 20;

type FaturasProps = {
  faturas: Record<string, any[]>;
  excelFaturas: Record<string, string>;
};

const Faturas = ({ faturas, excelFaturas }: FaturasProps) => {
  const tipos = Object.keys(faturas);
  const [tipoAtivo, setTipoAtivo] = useState(tipos[0] ?? "");
  const [pagina, setPagina] = useState(0);

  const linhas = faturas[tipoAtivo] ?? [];
  const totalPaginas = Math.ceil(linhas.length / PAGE_SIZE);
  const linhasPagina = linhas.slice(
    pagina * PAGE_SIZE,
    (pagina + 1) * PAGE_SIZE,
  );

  const trocarTipo = (tipo: string) => {
    setTipoAtivo(tipo);
    setPagina(0);
  };

  const handleDownloadFatura = (tipo: string) => {
    if (!excelFaturas?.[tipo]) return;
    const byteChars = atob(excelFaturas[tipo]);
    const byteArray = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteArray[i] = byteChars.charCodeAt(i);
    }
    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `faturas_${tipo}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Faturas</h2>

      <div className="flex justify-between">
        <div className="flex gap-4 flex-wrap">
          {tipos.map((tipo) => (
            <button
              key={tipo}
              onClick={() => trocarTipo(tipo)}
              className={`flex flex-col px-5 py-3 rounded-lg border font-medium text-sm transition-all ${CORES_FATURA[tipo] ?? CORES_FATURA.Outros} ${tipoAtivo === tipo ? "ring-2 ring-offset-1 ring-current" : "opacity-70 hover:opacity-100"}`}
            >
              <span className="text-2xl font-bold">{faturas[tipo].length}</span>
              <span>{tipo}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          {excelFaturas &&
            Object.keys(excelFaturas).map((tipo) => (
              <Button
                key={tipo}
                onClick={() => handleDownloadFatura(tipo)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded"
              >
                Baixar {tipo}
              </Button>
            ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-neutral-700">
            <tr>
              {COLUNAS_EXIBIR.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left font-semibold whitespace-nowrap border-b border-neutral-200"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhasPagina.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUNAS_EXIBIR.length}
                  className="text-center py-6 text-neutral-400"
                >
                  Nenhum cliente nesse grupo
                </td>
              </tr>
            ) : (
              linhasPagina.map((item, i) => {
                const d3 = item.dadosExcel3 ?? {};
                const d2 = item.dadosExcel2 ?? {};

                // busca CONTATO no excel2 ignorando espaços
                const contatoKey = Object.keys(d2).find(
                  (k) => k.trim().toUpperCase() === "CONTATO",
                );
                const contato = contatoKey ? d2[contatoKey] : "—";

                return (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                  >
                    {COLUNAS_EXIBIR.map((col) => (
                      <td
                        key={col}
                        className="px-4 py-2 whitespace-nowrap border-b border-neutral-100"
                      >
                        {col === "CONTATO"
                          ? (contato ?? "—")
                          : (d3[col] ?? "—")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-neutral-500">
          Página {pagina + 1} de {totalPaginas} — {linhas.length} registro(s)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPagina(0)}
            disabled={pagina === 0}
            className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100"
          >
            «
          </button>
          <button
            onClick={() => setPagina((p) => p - 1)}
            disabled={pagina === 0}
            className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100"
          >
            ‹
          </button>
          <button
            onClick={() => setPagina((p) => p + 1)}
            disabled={pagina >= totalPaginas - 1}
            className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100"
          >
            ›
          </button>
          <button
            onClick={() => setPagina(totalPaginas - 1)}
            disabled={pagina >= totalPaginas - 1}
            className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Faturas;
