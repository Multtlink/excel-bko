import React from "react";

interface SearchProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  setPagination: (pagination: any) => void;
}

const Search = ({
  globalFilter,
  setGlobalFilter,
  setPagination,
}: SearchProps) => {
  return (
    <input
      value={globalFilter}
      onChange={(e) => {
        setGlobalFilter(e.target.value);
        setPagination((p: any) => ({ ...p, pageIndex: 0 }));
      }}
      placeholder="Buscar em todos os campos..."
      className="border border-neutral-300 rounded px-3 py-1.5 text-sm w-full"
    />
  );
};

export default Search;
