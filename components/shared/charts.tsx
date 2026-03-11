"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CORES = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

type ChartsProps = {
  dados: any[];
};

function contarValores(dados: any[], campo: string) {
  const contagem: Record<string, number> = {};
  for (const linha of dados) {
    const val = String(linha[campo] ?? "").trim() || "Vazio";
    contagem[val] = (contagem[val] ?? 0) + 1;
  }
  return Object.entries(contagem).map(([name, value]) => ({ name, value }));
}

const PizzaChart = ({ dados, titulo }: { dados: any[]; titulo: string }) => (
  <div className="flex flex-col gap-2 flex-1 min-w-70">
    <h3 className="text-sm font-semibold text-neutral-600">{titulo}</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={dados}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) =>
            `${name} ${(percent! * 100).toFixed(0)}%`
          }
        >
          {dados.map((_, i) => (
            <Cell key={i} fill={CORES[i % CORES.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const Charts = ({ dados }: ChartsProps) => {
  const over30 = contarValores(dados, "OVER 30");
  const over60 = contarValores(dados, "OVER 60");
  const mve = contarValores(dados, "MVE");
  const status = contarValores(dados, "STATUS CLIENTE");
  const segmento = contarValores(dados, "SEGMENTO");

  return (
    <div className="flex flex-col gap-8">
      {/* Pizzas */}
      <div className="flex gap-8 flex-wrap">
        <PizzaChart dados={over30} titulo="OVER 30" />
        <PizzaChart dados={over60} titulo="OVER 60" />
        <PizzaChart dados={mve} titulo="MVE" />
        <PizzaChart dados={segmento} titulo="SEGMENTO" />
      </div>

      {/* Status - Barra */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-neutral-600">
          STATUS CLIENTE
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={status}
            margin={{ top: 5, right: 20, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" name="Quantidade">
              {status.map((_, i) => (
                <Cell key={i} fill={CORES[i % CORES.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
