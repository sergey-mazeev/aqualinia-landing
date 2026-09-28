export type CsvCell = string | number | null | undefined;

const FORMULA_START = /^[=+\-@\t\r]/;

/** Escapes one cell: neutralises spreadsheet formulas and quotes separators. */
export function csvCell(value: CsvCell): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (FORMULA_START.test(text)) text = `'${text}`;
  if (/[";\r\n]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

/** CSV for Russian-locale Excel: UTF-8 BOM, `;` separator, CRLF line endings. */
export function toCsv(rows: CsvCell[][]): string {
  return "﻿" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n") + "\r\n";
}

/**
 * Phone for spreadsheets. A leading `+` makes Excel parse the cell as a formula,
 * so Russian numbers use the familiar `8 (999) 123-45-67`; others keep E.164
 * (and get an apostrophe from the formula guard).
 */
export function csvPhone(e164: string): string {
  const m = /^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return m ? `8 (${m[1]}) ${m[2]}-${m[3]}-${m[4]}` : e164;
}
