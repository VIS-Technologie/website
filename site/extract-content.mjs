// Jednorazowy ekstraktor: DX_COPY (dx-variation.jsx) -> site/content.json.
// Uruchomienie z katalogu repo: node site/extract-content.mjs
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const src = readFileSync("visualizations/variations/dx/dx-variation.jsx", "utf8");
const start = src.indexOf("const DX_COPY = {");
const end = src.indexOf("\nfunction DxVariation()");
if (start < 0 || end < 0) throw new Error("Nie znaleziono bloku DX_COPY");

const ctx = vm.createContext({});
vm.runInContext(src.slice(start, end) + "\n;globalThis.DX_COPY = DX_COPY;", ctx);

const data = ctx.DX_COPY;
for (const lang of ["pl", "en"]) {
  for (const key of ["nav", "cta", "hero", "partners", "services", "tech", "pull", "stats", "process", "about", "close", "workPage", "contact", "cookieNote", "footer", "legal"]) {
    if (!(key in data[lang])) throw new Error(`Brak klucza ${lang}.${key}`);
  }
}
writeFileSync("site/content.json", JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("OK: site/content.json zapisany");
