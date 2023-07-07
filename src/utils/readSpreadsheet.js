//readSpreadsheet.js
import XLSX from "xlsx";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function readSpreadsheet(filePath) {
  const absolutePath = path.resolve(__dirname, filePath);
  const workbook = XLSX.readFile(absolutePath);
  const sheet_name_list = workbook.SheetNames;
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
}
