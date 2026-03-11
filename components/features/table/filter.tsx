interface FilterTableProps {
  filtroOver30: string;
  setFiltroOver30: (value: string) => void;
  filtroOver60: string;
  setFiltroOver60: (value: string) => void;
  filtroStatus: string;
  setFiltroStatus: (value: string) => void;
  filtroMVE: string;
  setFiltroMVE: (value: string) => void;
  filtroSegmento: string;
  setFiltroSegmento: (value: string) => void;
  statusOptions: string[];
  segmentoOptions: string[];
  linhasFiltradas: any[];
}

const FilterTable = ({
  filtroOver30, setFiltroOver30,
  filtroOver60, setFiltroOver60,
  filtroStatus, setFiltroStatus,
  filtroMVE, setFiltroMVE,
  filtroSegmento, setFiltroSegmento,
  statusOptions,
  segmentoOptions,
  linhasFiltradas,
}: FilterTableProps) => {
  const temFiltro = filtroOver30 || filtroOver60 || filtroStatus || filtroMVE || filtroSegmento;

  return (
    <div className="flex gap-4 flex-wrap items-end w-full">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">OVER 30</label>
        <select value={filtroOver30} onChange={(e) => setFiltroOver30(e.target.value)} className="border border-neutral-300 rounded px-3 py-1.5 text-sm">
          <option value="">Todos</option>
          <option value="SIM">SIM</option>
          <option value="NÃO">NÃO</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">OVER 60</label>
        <select value={filtroOver60} onChange={(e) => setFiltroOver60(e.target.value)} className="border border-neutral-300 rounded px-3 py-1.5 text-sm">
          <option value="">Todos</option>
          <option value="SIM">SIM</option>
          <option value="NÃO">NÃO</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">STATUS CLIENTE</label>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="border border-neutral-300 rounded px-3 py-1.5 text-sm">
          <option value="">Todos</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">MVE</label>
        <select value={filtroMVE} onChange={(e) => setFiltroMVE(e.target.value)} className="border border-neutral-300 rounded px-3 py-1.5 text-sm">
          <option value="">Todos</option>
          <option value="SIM">SIM</option>
          <option value="NÃO">NÃO</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">SEGMENTO</label>
        <select value={filtroSegmento} onChange={(e) => setFiltroSegmento(e.target.value)} className="border border-neutral-300 rounded px-3 py-1.5 text-sm">
          <option value="">Todos</option>
          {segmentoOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {temFiltro && (
        <button
          onClick={() => { setFiltroOver30(""); setFiltroOver60(""); setFiltroStatus(""); setFiltroMVE(""); setFiltroSegmento(""); }}
          className="text-sm text-red-500 hover:text-red-700 underline self-end pb-1.5"
        >
          Limpar filtros
        </button>
      )}

      <span className="text-sm text-neutral-400 self-end pb-1.5">
        {linhasFiltradas.length} registro(s)
      </span>
    </div>
  );
};

export default FilterTable;