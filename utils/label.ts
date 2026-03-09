import {ColumnDef} from "@tanstack/react-table";

type TableData = {
  "DATA ENTRADA": string;
  "RAZÃO SOCIAL": string;
  CNPJ: string;
  SEGMENTO: string;
  FAMILIA: string;
  "PEDIDO PORTIN": string;
  "STATUS PORTIN": string;
  CONSULTOR: string;
  "DATA PORTIN": string;
  MVE: string;
  CONTATO: string;
  "OVER 30": string;
  "OVER 60": string;
  "STATUS CLIENTE": string;
  QTD: number;
  "OBS PORTIN": string;
  "TIPO DE CHIP": string;
  "DATA DE ENTREGA/CODIGO RASTREIO": string;
  "OBS ENTREGA": string;
};

export const columns: ColumnDef<TableData>[] = [
  { accessorKey: "DATA ENTRADA", header: "DATA ENTRADA" },
  { accessorKey: "RAZÃO SOCIAL", header: "RAZÃO SOCIAL" },
  { accessorKey: "CNPJ", header: "CNPJ" },
  { accessorKey: "SEGMENTO", header: "SEGMENTO" },
  { accessorKey: "FAMILIA", header: "FAMILIA" },
  { accessorKey: "PEDIDO PORTIN", header: "PEDIDO PORTIN" },
  { accessorKey: "STATUS PORTIN", header: "STATUS PORTIN" },
  { accessorKey: "CONSULTOR", header: "CONSULTOR" },
  { accessorKey: "DATA PORTIN", header: "DATA PORTIN" },
  { accessorKey: "MVE", header: "MVE" },
  { accessorKey: "CONTATO", header: "CONTATO" },
  { accessorKey: "OVER 30", header: "OVER 30" },
  { accessorKey: "OVER 60", header: "OVER 60" },
  { accessorKey: "STATUS CLIENTE", header: "STATUS CLIENTE" },
  { accessorKey: "QTD", header: "QTD" },
  { accessorKey: "OBS PORTIN", header: "OBS PORTIN" },
  { accessorKey: "TIPO DE CHIP", header: "TIPO DE CHIP" },
  { accessorKey: "DATA DE ENTREGA/CODIGO RASTREIO", header: "DATA DE ENTREGA/CODIGO RASTREIO" },
  { accessorKey: "OBS ENTREGA", header: "OBS ENTREGA" },
];