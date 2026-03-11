import * as xlsx from "xlsx";

export async function readExcel(input: File | ArrayBuffer) {
  const buffer = input instanceof ArrayBuffer ? input : await input.arrayBuffer();
  const workbook = xlsx.read(buffer, { type: "array" });
  const result: Record<string, { asObjects: any[]; asArrays: any[] }> = {};
  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    const asObjects = xlsx.utils.sheet_to_json(sheet, { defval: null, raw: false });
    const asArrays = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: false });
    result[name] = { asObjects, asArrays };
  }
  return result;
}