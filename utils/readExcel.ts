import * as xlsx from "xlsx";

export async function readExcel(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = xlsx.read(buffer);

  const result: Record<string, { asObjects: any[]; asArrays: any[] }> = {};
  
  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];    
    const asObjects = xlsx.utils.sheet_to_json(sheet, { defval: null });
    const asArrays = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
    result[name] = { asObjects, asArrays };
  }

  return result;
}

