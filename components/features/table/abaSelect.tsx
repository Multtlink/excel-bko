
interface AbaSelectProps {
  abas: string[];
  abaAtiva: string;
  onChange: (aba: string) => void;
}

const AbaSelect = ({ abas, abaAtiva, onChange }: AbaSelectProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-medium text-neutral-500">ABA</label>
      <select
        value={abaAtiva}
        onChange={(e) => onChange(e.target.value)}
        className="border border-neutral-300 rounded px-3 py-1.5 text-sm"
      >
        {abas.map((aba) => (
          <option key={aba} value={aba}>
            {aba}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AbaSelect;
