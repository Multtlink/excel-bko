"use client";
import AbaSelect from "@/components/features/table/abaSelect";
import FilterTable from "@/components/features/table/filter";
import Charts from "@/components/shared/charts";
import Field from "@/components/shared/field";
import Table from "@/components/shared/table";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

type Data = {
  abas: string[];
  dados: Record<string, any[]>;
  excelBase64: string;
};

export default function Home() {
  const [data, setData] = useState<Data | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<string>("");
  const [filtroOver30, setFiltroOver30] = useState("");
  const [filtroOver60, setFiltroOver60] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroMVE, setFiltroMVE] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/compare", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const err = await response.text();
      console.error(err);
      return;
    }
    const result = await response.json();
    setData(result);
    setAbaAtiva(result.abas?.[0] ?? "");
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

  const linhasAba =
    abaAtiva && data?.dados[abaAtiva] ? data.dados[abaAtiva] : [];

  // Opções únicas de status para o select
  const statusOptions = useMemo(() => {
    const valores = linhasAba
      .map((l) => String(l["STATUS CLIENTE"] ?? "").trim())
      .filter(Boolean);
    return [...new Set(valores)].sort();
  }, [linhasAba]);

  const linhasFiltradas = useMemo(() => {
    return linhasAba.filter((linha) => {
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

      if (filtroOver30 && over30 !== filtroOver30.toUpperCase()) return false;
      if (filtroOver60 && over60 !== filtroOver60.toUpperCase()) return false;
      if (filtroStatus && status !== filtroStatus) return false;
      if (filtroMVE && mve !== filtroMVE.toUpperCase()) return false;

      return true;
    });
  }, [linhasAba, filtroOver30, filtroOver60, filtroStatus, filtroMVE]);

  return (
    <div className="flex flex-col">
      <form
        className="flex flex-1 max-w-2xl gap-6 p-6 border-2 border-neutral-300 rounded-lg my-6 self-center relative"
        onSubmit={handleSubmit}
      >
        <Field label="Safra" name="excel-1" />
        <Field label="Pós" name="excel-2" />
        <Field label="Excel 3" name="excel-3" />
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
        <div className="flex flex-col gap-4 mx-12">
          <div className="flex gap-6 flex-1 mx-12 border-2 border-neutral-300 rounded-lg p-4">
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
            />
          </div>

          <Table data={linhasFiltradas} />
          {linhasFiltradas.length > 0 && <Charts dados={linhasFiltradas} />}
        </div>
      )}
    </div>
  );
}
