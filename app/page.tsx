"use client";
import ModalAtualizados from "@/components/features/modalAtt";
import AbaSelect from "@/components/features/table/abaSelect";
import FilterTable from "@/components/features/table/filter";
import Charts from "@/components/shared/charts";
import Faturas from "@/components/shared/faturas";
import Field from "@/components/shared/field";
import Table from "@/components/shared/table";
import { Button } from "@/components/ui/button";
import { ClienteAtualizado } from "@/utils/compare";
import { useState, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Data = {
  abas: string[];
  dados: Record<string, any[]>;
  excelBase64: string;
  excelFaturas: Record<string, string>;
  faturas: Record<string, any[]>;
  atualizados: ClienteAtualizado[];
};

export default function Home() {
  const [data, setData] = useState<Data | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<string>("");
  const [filtroOver30, setFiltroOver30] = useState("");
  const [filtroOver60, setFiltroOver60] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroMVE, setFiltroMVE] = useState("");
  const [filtroSegmento, setFiltroSegmento] = useState("");
  const [busca, setBusca] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Processando...");
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/compare", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const err = await response.text();
      console.error(err);
      toast.update(toastId, {
        render: "Erro ao processar a solicitação",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }
    const result = await response.json();
    setData(result);
    setAbaAtiva(result.abas?.[0] ?? "");
    toast.update(toastId, {
      render: "Processado com sucesso",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  };

  const handleDownload = () => {
    if (!data?.excelBase64) return;
    const byteChars = atob(data.excelBase64);
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
    a.download = "planilha_atualizada.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const linhasAba = useMemo(() => {
    return abaAtiva && data?.dados[abaAtiva] ? data.dados[abaAtiva] : [];
  }, [abaAtiva, data]);

  const todasLinhas = useMemo(() => {
    if (!data?.dados) return [];
    return Object.entries(data.dados).flatMap(([aba, linhas]) =>
      linhas.map((linha) => ({ ...linha, _aba: aba })),
    );
  }, [data]);

  const segmentoOptions = useMemo(() => {
    const valores = linhasAba
      .map((l) => String(l["SEGMENTO"] ?? "").trim())
      .filter(Boolean);
    return [...new Set(valores)].sort();
  }, [linhasAba]);

  const statusOptions = useMemo(() => {
    const valores = linhasAba
      .map((l) => String(l["STATUS CLIENTE"] ?? "").trim())
      .filter(Boolean);
    return [...new Set(valores)].sort();
  }, [linhasAba]);

  const linhasFiltradas = useMemo(() => {
    const fonte = busca.trim() ? todasLinhas : linhasAba;

    return fonte.filter((linha) => {
      const over30 = String(linha["OVER 30"] ?? "")
        .trim()
        .toUpperCase();
      const over60 = String(linha["OVER 60"] ?? "")
        .trim()
        .toUpperCase();
      const status = String(linha["STATUS CLIENTE"] ?? "").trim();
      const mve = String(linha["MVE"] ?? "")
        .trim()
        .toUpperCase();
      const segmento = String(linha["SEGMENTO"] ?? "").trim();

      if (filtroOver30 && over30 !== filtroOver30.toUpperCase()) return false;
      if (filtroOver60 && over60 !== filtroOver60.toUpperCase()) return false;
      if (filtroStatus && status !== filtroStatus) return false;
      if (filtroMVE && mve !== filtroMVE.toUpperCase()) return false;
      if (filtroSegmento && segmento !== filtroSegmento) return false;

      if (busca.trim()) {
        const buscaLower = busca.toLowerCase();
        return Object.values(linha).some((val) =>
          String(val ?? "")
            .toLowerCase()
            .includes(buscaLower),
        );
      }

      return true;
    });
  }, [
    linhasAba,
    todasLinhas,
    busca,
    filtroOver30,
    filtroOver60,
    filtroStatus,
    filtroMVE,
    filtroSegmento,
  ]);

  const somaQTD = useMemo(() => {
    return linhasFiltradas.reduce((acc, linha) => {
      const qtd = Number(linha["QTD"] ?? 0);
      return acc + (isNaN(qtd) ? 0 : qtd);
    }, 0);
  }, [linhasFiltradas]);

  return (
    <div className="flex flex-col relative">
      <form
        className="flex flex-1 max-w-2xl gap-6 p-6 border-2 border-neutral-300 rounded-lg my-6 self-center relative"
        onSubmit={handleSubmit}
      >
        <Field label="Safra" name="excel-1" />
        <Field label="Pós" name="excel-2" />
        <Field label="Car" name="excel-3" />
        <Button className="self-end px-6 py-4 cursor-pointer bg-green-500 hover:bg-green-600 font-semibold">
          Enviar
        </Button>
      </form>

      {data && (
        <Button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded self-center mb-6 absolute top-0 right-0 mt-6 mr-6"
        >
          Baixar Excel
        </Button>
      )}

      {data && (
        <div className="flex gap-3 absolute top-0 right-0 mt-6 mr-6">
          <ModalAtualizados atualizados={data.atualizados} />
          <Button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded"
          >
            Baixar Excel
          </Button>
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-4 mx-12">
          <div className="flex flex-col gap-6 flex-1 items-center mx-12 border-2 border-neutral-300 rounded-lg p-4">
            <AbaSelect
              abas={data.abas}
              abaAtiva={abaAtiva}
              onChange={setAbaAtiva}
            />

            <FilterTable
              filtroOver30={filtroOver30}
              setFiltroOver30={setFiltroOver30}
              filtroOver60={filtroOver60}
              setFiltroOver60={setFiltroOver60}
              filtroStatus={filtroStatus}
              setFiltroStatus={setFiltroStatus}
              filtroMVE={filtroMVE}
              setFiltroMVE={setFiltroMVE}
              statusOptions={statusOptions}
              linhasFiltradas={linhasFiltradas}
              filtroSegmento={filtroSegmento}
              setFiltroSegmento={setFiltroSegmento}
              segmentoOptions={segmentoOptions}
            />

            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar em todas as abas..."
              className="border border-neutral-300 rounded px-3 py-1.5 text-sm self-end w-full"
            />

            <div className="flex items-center gap-3 self-start bg-white border border-neutral-200 rounded-lg px-5 py-3 shadow-sm w-full justify-end">
              <span className="text-sm text-neutral-500">
                Total de linhas por Aba:
              </span>
              <span className="text-sm font-semibold text-neutral-700">
                {linhasFiltradas.length}
              </span>
              <div className="w-px h-4 bg-neutral-200" />
              <span className="text-sm text-neutral-500">
                Soma QTD por Aba:
              </span>
              <span className="text-lg font-bold text-green-600">
                {somaQTD}
              </span>
            </div>
          </div>

          <Table data={linhasFiltradas} mostrarAba={!!busca.trim()} />
          {data.faturas && Object.keys(data.faturas).length > 0 && (
            <Faturas faturas={data.faturas} excelFaturas={data.excelFaturas} />
          )}

          {linhasFiltradas.length > 0 && <Charts dados={linhasFiltradas} />}
        </div>
      )}
    </div>
  );
}
