import { describe, expect, it } from "vitest";
import { csvCell, csvPhone, toCsv } from "./csv";

describe("csv", () => {
  it("neutralises formulas", () => {
    expect(csvCell("=HYPERLINK(1)")).toBe("'=HYPERLINK(1)");
    expect(csvCell("-2+3")).toBe("'-2+3");
    expect(csvCell("@cmd")).toBe("'@cmd");
  });
  it("quotes separators and quotes", () => {
    expect(csvCell('a;b "c"')).toBe('"a;b ""c"""');
    expect(csvCell("line\nbreak")).toBe('"line\nbreak"');
  });
  it("builds a BOM-prefixed CRLF document", () => {
    const csv = toCsv([["Имя", "Телефон"], ["Анна", null]]);
    expect(csv.startsWith("﻿Имя;Телефон\r\n")).toBe(true);
    expect(csv.endsWith("Анна;\r\n")).toBe(true);
  });
  it("formats phones for spreadsheets", () => {
    expect(csvPhone("+79991234567")).toBe("8 (999) 123-45-67");
    expect(csvPhone("+442079460958")).toBe("+442079460958");
  });
});
