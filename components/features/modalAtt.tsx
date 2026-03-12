"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClienteAtualizado } from "@/utils/compare";
import { Button } from "@/components/ui/button";

type Props = {
  atualizados: ClienteAtualizado[];
};

const PAGE_SIZE = 20;

const ModalAtualizados = ({ atualizados }: Props) => {
  const [pagina, setPagina] = useState(0);
  const [busca, setBusca] = useState("");

  const filtrados = atualizados.filter((c) =>
    [c.nome, c.cnpj, c.statusAntes, c.statusDepois, c.aba].some((v) =>
      v.toLowerCase().includes(busca.toLowerCase()),
    ),
  );

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE);
  const linhasPagina = filtrados.slice(
    pagina * PAGE_SIZE,
    (pagina + 1) * PAGE_SIZE,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-green-500 text-green-600 hover:bg-green-50"
        >
          Ver atualizados ({atualizados.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Clientes Atualizados ({atualizados.length})</DialogTitle>
        </DialogHeader>

        <input
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPagina(0);
          }}
          placeholder="Buscar por nome, CNPJ, status..."
          className="border border-neutral-300 rounded px-3 py-1.5 text-sm"
        />

        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left font-semibold whitespace-nowrap border-b">
                  CNPJ
                </th>
                <th className="px-4 py-2 text-left font-semibold whitespace-nowrap border-b">
                  RAZÃO SOCIAL
                </th>
                <th className="px-4 py-2 text-left font-semibold whitespace-nowrap border-b">
                  STATUS ANTES
                </th>
                <th className="px-4 py-2 text-left font-semibold whitespace-nowrap border-b">
                  STATUS DEPOIS
                </th>
                <th className="px-4 py-2 text-left font-semibold whitespace-nowrap border-b">
                  ABA
                </th>
              </tr>
            </thead>
            <tbody>
              {linhasPagina.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-neutral-400">
                    Nenhum resultado
                  </td>
                </tr>
              ) : (
                linhasPagina.map((c, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                  >
                    <td className="px-4 py-2 whitespace-nowrap border-b">
                      {c.cnpj}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-b">
                      {c.nome}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-b text-neutral-400">
                      {c.statusAntes || "—"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-b font-medium text-green-600">
                      {c.statusDepois}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-b text-neutral-400 text-xs">
                      {c.aba}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-neutral-500">
            Página {pagina + 1} de {totalPaginas} — {filtrados.length}{" "}
            registro(s)
          </span>
          <div className="flex gap-2">
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
      </DialogContent>
    </Dialog>
  );
};

export default ModalAtualizados;
