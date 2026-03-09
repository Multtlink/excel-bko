import React from "react";

interface PaginationProps {
  table: any;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >;
}

const Pagination = ({ table, pagination, setPagination }: PaginationProps) => {
  return (
    <div className="flex items-center justify-between px-1">
      <span className="text-sm text-neutral-500">
        Página {table.getState().pagination.pageIndex + 1} de{" "}
        {table.getPageCount()} — {table.getFilteredRowModel().rows.length}{" "}
        registro(s)
      </span>

      <div className="flex items-center gap-2">
        <select
          value={pagination.pageSize}
          onChange={(e) =>
            setPagination((p) => ({
              ...p,
              pageSize: Number(e.target.value),
              pageIndex: 0,
            }))
          }
          className="border border-neutral-300 rounded px-2 py-1 text-sm"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} por página
            </option>
          ))}
        </select>

        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100"
        >
          «
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100"
        >
          ‹
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100"
        >
          ›
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="px-2 py-1 text-sm border rounded disabled:opacity-30 hover:bg-neutral-100"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
