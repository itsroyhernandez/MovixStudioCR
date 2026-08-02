#!/usr/bin/env node
/* Verifica que los hashes CSP de _headers correspondan al <script> real de
   cada página. Si alguien edita un script y olvida regenerar el header, el
   navegador bloquearía el script — este check lo detecta antes del deploy.
   Uso: node scripts/check-csp.js   (falla con código 1 si hay desajuste) */
"use strict";
const fs = require("fs"), crypto = require("crypto"), path = require("path");
const ROOT = path.join(__dirname, "..");

function hashOf(file){
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) return null;
  return "'sha256-" + crypto.createHash("sha256").update(m[1], "utf8").digest("base64") + "'";
}
function cspOf(headersFile){
  const raw = fs.readFileSync(path.join(ROOT, headersFile), "utf8");
  const line = raw.split("\n").find(l => l.trim().startsWith("Content-Security-Policy:"));
  return line || "";
}

let failed = false;
const checks = [
  { headers: "_headers",        pages: ["intake/index.html"] },
  { headers: "intake/_headers", pages: ["intake/index.html"] }
];
for (const c of checks){
  const csp = cspOf(c.headers);
  for (const page of c.pages){
    const h = hashOf(page);
    if (!h) continue;
    if (!csp.includes(h)){
      console.error(`✗ ${c.headers} no contiene el hash de ${page}\n  esperado: ${h}`);
      failed = true;
    } else {
      console.log(`✓ ${c.headers} ← ${page}`);
    }
  }
}
// las páginas generadas no llevan script inline (usan assets/site.js con 'self')
const generated = ["index.html","nosotros.html","contacto.html","soporte.html","blog/index.html","servicios/index.html"];
for (const g of generated){
  const html = fs.readFileSync(path.join(ROOT, g), "utf8");
  if (/<script>[\s\S]*?<\/script>/.test(html)){
    console.error(`✗ ${g} tiene un <script> inline sin hash en la CSP`);
    failed = true;
  }
}
if (failed){ console.error("\nRegenerá los _headers antes de desplegar."); process.exit(1); }
console.log("\nCabeceras CSP coherentes con el contenido.");
