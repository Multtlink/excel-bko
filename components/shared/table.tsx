"use client";
import { columns } from "@/utils/label";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";

const abaColumn: ColumnDef<any> = {
  id: "_aba",
  header: "ABA",
  cell: ({ row }) => (
    <span className="text-xs text-neutral-400">{row.original._aba ?? "—"}</span>
  ),
};

const Table = ({ data, mostrarAba }: { data: any[]; mostrarAba?: boolean }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  const colunasAtivas = mostrarAba ? [abaColumn, ...columns] : columns;

  const table = useReactTable({
    data,
    columns: colunasAtivas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-neutral-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left font-semibold whitespace-nowrap border-b border-neutral-200"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={colunasAtivas.length} className="text-center py-6 text-neutral-400">
                  Nenhum resultado encontrado
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 whitespace-nowrap border-b border-neutral-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-neutral-500">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()} — {data.length} registro(s)
        </span>
        <div className="flex items-center gap-2">
          <select
            value={pagination.pageSize}
            onChange={(e) => setPagination((p) => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))}
            className="border border-neutral-300 rounded px-2 py-1 text-sm"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>{size} por página</option>
            ))}
          </select>
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100">«</button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100">‹</button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100">›</button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100">»</button>
        </div>
      </div>
    </div>
  );
};

export default Table;