#!/usr/bin/env node
/* Guardia de CSP y de confidencialidad del sitio de Movix Studio.

   La política es de denegación por defecto y ya NO usa hashes ni
   'unsafe-inline': todo el JS y el CSS vive en archivos propios bajo assets/.
   Eso elimina la deriva de hashes y cierra la inyección de código en línea.

   Este script falla (código 1) si alguien reintroduce un <script> o un <style>
   en línea, un atributo style=, un recurso externo, si debilita la política en
   cualquiera de los dos archivos _headers, o si se filtra al contenido público
   un dato del pitch deck corporativo.

   Uso: node scripts/check-csp.js */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");

const HEADERS = ["_headers", "intake/_headers"];
const REQUIRED = [
  "default-src 'none'", "script-src 'self'", "style-src 'self'",
  "font-src 'self'", "form-action 'none'", "base-uri 'none'",
  "frame-ancestors 'none'", "object-src 'none'", "upgrade-insecure-requests"
];
const FORBIDDEN = ["'unsafe-inline'", "'unsafe-eval'", "'unsafe-hashes'"];

let failed = false;
const fail = m => { console.error("✗ " + m); failed = true; };

/* ---------- 1. las cabeceras ---------- */
for (const f of HEADERS){
  const raw = fs.readFileSync(path.join(ROOT, f), "utf8");
  const csp = raw.split("\n").find(l => l.trim().startsWith("Content-Security-Policy:")) || "";
  if (!csp){ fail(`${f}: no define Content-Security-Policy`); continue; }
  for (const d of REQUIRED) if (!csp.includes(d)) fail(`${f}: falta la directiva ${d}`);
  for (const d of FORBIDDEN) if (csp.includes(d)) fail(`${f}: la CSP contiene ${d}`);
  if (/\s\*[;\s]/.test(csp + " ")) fail(`${f}: la CSP usa el comodín *`);
  if (!raw.includes("Strict-Transport-Security"))      fail(`${f}: falta HSTS`);
  if (!raw.includes("X-Frame-Options: DENY"))          fail(`${f}: falta X-Frame-Options`);
  if (!raw.includes("X-Content-Type-Options: nosniff")) fail(`${f}: falta nosniff`);
  console.log(`✓ ${f}`);
}

/* ---------- 2. el HTML publicado ---------- */
function htmlFiles(dir, acc = []){
  for (const e of fs.readdirSync(dir, { withFileTypes:true })){
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}
const pages = htmlFiles(ROOT);
for (const p of pages){
  const rel = path.relative(ROOT, p);
  const html = fs.readFileSync(p, "utf8");
  if (/<script(?![^>]*\ssrc=)[^>]*>/i.test(html)) fail(`${rel}: tiene un <script> en línea (la CSP lo bloquearía)`);
  if (/<style[\s>]/i.test(html))                  fail(`${rel}: tiene un <style> en línea (la CSP lo bloquearía)`);
  if (/\sstyle=["']/i.test(html))                 fail(`${rel}: tiene un atributo style= (la CSP lo bloquearía)`);
  if (/\son[a-z]+=["']/i.test(html))              fail(`${rel}: tiene un manejador de eventos en línea (onclick=, onload=…)`);
  for (const u of html.match(/(?:src|href)=["']https?:\/\/[^"']+/gi) || []){
    const url = u.replace(/^(?:src|href)=["']/i, "");
    if (!/^https:\/\/wa\.me\//.test(url))
      fail(`${rel}: referencia externa que la CSP bloquearía → ${url}`);
  }
}
console.log(`✓ ${pages.length} páginas sin código en línea ni recursos externos`);

/* ---------- 3. confidencialidad ----------
   El pitch deck corporativo trae cédulas de los socios, participación
   accionaria, CAPEX/OPEX, márgenes y el stack interno. Nada de eso puede
   terminar en un archivo publicado. */
const SECRETS = [
  [/\bc[ée]dula\s*(jur[íi]dica|f[íi]sica)?\s*[:#]?\s*\d-\d{4}-\d{4}\b/i, "un número de cédula"],
  [/\b(royner|kristel|menj[íi]var|poveda)\b/i, "nombre de socio del pitch deck"],
  [/\b(capex|opex)\b/i, "referencia a CAPEX/OPEX"],
  [/margen\s+(bruto|neto)/i, "margen bruto o neto"],
  [/\b(midjourney|magnific|cloudways|supabase|sesame\s*hr|claude\s+enterprise)\b/i, "herramienta del stack interno"],
  [/(api[_-]?key\s*[:=]\s*["'][^"']{8,}|secret[_-]?key\s*[:=]|bearer\s+[A-Za-z0-9._-]{20,}|AKIA[0-9A-Z]{16})/i, "posible credencial"]
];
const scanned = pages.concat(
  ["assets/site.js","assets/site.css","assets/intake.js","assets/intake.css","build-pages.js","README.md"]
    .map(f => path.join(ROOT, f)).filter(fs.existsSync));
for (const p of scanned){
  const rel = path.relative(ROOT, p);
  const txt = fs.readFileSync(p, "utf8");
  for (const [re, what] of SECRETS){
    const m = txt.match(re);
    if (m) fail(`${rel}: se filtró ${what} → "${m[0].slice(0,60)}"`);
  }
}
console.log("✓ sin datos confidenciales en el contenido publicado");

if (failed){ console.error("\nCorregí lo anterior antes de desplegar."); process.exit(1); }
console.log("\nCabeceras, contenido y confidencialidad en orden.");
