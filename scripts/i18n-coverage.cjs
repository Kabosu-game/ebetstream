#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '../src');
const EN = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n/locales/en.json'), 'utf8'));

function walkVue(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walkVue(f, files);
    else if (e.name.endsWith('.vue')) files.push(f);
  }
  return files;
}

const vueFiles = walkVue(SRC);
const withI18n = vueFiles.filter((f) => fs.readFileSync(f, 'utf8').includes('useI18n'));

const patterns = [
  /error\.value\s*=\s*['"][^'"]+['"]/g,
  /alert\(\s*['"][^'"]+['"]/g,
  />\s*[A-Za-zÀ-ÿ][^<{]{3,}\s*</g,
  /['"][^'"]*[àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ][^'"]*['"]/g,
];

let hardcoded = [];
for (const file of vueFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(path.join(__dirname, '..'), file);
  for (const re of patterns) {
    re.lastIndex = 0;
    const matches = content.match(re) || [];
    for (const m of matches) {
      if (m.includes('$t(') || m.includes('{{') || m.includes('console.') || m.includes('import ')) continue;
      if (/^>\s*(VS|LIVE|MOD|SUB|FAQ|FPS|IRL|MVP|EBT|MMR)\s*</.test(m)) continue;
      hardcoded.push({ file: rel, match: m.slice(0, 80) });
    }
  }
}

const keyCount = JSON.stringify(EN).match(/"[^"]+":\s*"[^"]*"/g)?.length || 0;
const errorsKeys = Object.keys(EN.errors || {}).length;
const successKeys = Object.keys(EN.success || {}).length;
const navKeys = Object.keys(EN.nav || {}).length;
const sportsKeys = Object.keys(EN.sports || {}).length;
const labelsKeys = Object.keys(EN.labels || {}).length;

console.log(JSON.stringify({
  vueTotal: vueFiles.length,
  vueWithI18n: withI18n.length,
  vueI18nPct: Math.round((withI18n.length / vueFiles.length) * 100),
  hardcodedEstimate: hardcoded.length,
  enKeyEstimate: keyCount,
  newNamespaces: { errors: errorsKeys, success: successKeys, nav: navKeys, sports: sportsKeys, labels: labelsKeys },
  sampleRemaining: [...new Map(hardcoded.map((h) => [h.file + h.match, h])).values()].slice(0, 25),
}, null, 2));
