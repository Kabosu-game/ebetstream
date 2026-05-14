#!/usr/bin/env node
/**
 * i18n migration script — extracts hardcoded strings from .vue <template> only,
 * adds keys to en.json, and replaces with $t() calls.
 * Run: node scripts/i18n-migrate.cjs [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const SRC = path.join(__dirname, '../src');
const EN_JSON = path.join(SRC, 'i18n/locales/en.json');

const SKIP_PATTERNS = [
  /^[\d\.\,\:\+\-\'′″\s\$€£%]+$/,
  /^[\d]+\/[\d]+$/,
  /^\([\-\d\.]+\)\s*\d$/,
  /^over\s+[\d\.]+$/i,
  /^under\s+[\d\.]+$/i,
  /^[\d\.]+$/,
  /^[A-Z]{2,4}$/,
  /^\d+′\s/,
  /^Today,?\s/,
  /^Jan\s|^Feb\s|^Mar\s|^Apr\s|^May\s|^Jun\s|^Jul\s|^Aug\s|^Sep\s|^Oct\s|^Nov\s|^Dec\s/,
];

function shouldSkip(s) {
  if (!s || s.length < 2) return true;
  if (s.includes('{{') || s.includes('$t(') || s.includes('t(')) return true;
  if (s.startsWith('@') || s.startsWith('v-') || s.startsWith(':')) return true;
  return SKIP_PATTERNS.some((p) => p.test(s));
}

function toKey(str) {
  return str
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 60);
}

function categorize(str) {
  const s = str.toLowerCase();
  if (['home', 'login', 'sign up', 'logout', 'dashboard', 'search', 'cancel', 'save', 'delete', 'edit', 'view', 'loading...', 'submit', 'back', 'close', 'yes', 'no', 'confirm', 'all', 'active', 'inactive', 'pending', 'approved', 'rejected', 'completed', 'cancelled', 'actions', 'status', 'name', 'email', 'description', 'date', 'type', 'id', 'user', 'country', 'game', 'admin', 'show more', 'processing...', 'saving...'].includes(s)) return 'common';
  if (['live matches', 'upcoming events', 'betslip', 'place bet', 'book', 'bet amount', 'possible win', 'sign in & bet', 'settings', 'live', 'total', 'draw', 'winner', '1x2', 'double chance', 'draw no bet', 'handicap (incl. overtime)', 'handicap (incl overtime)', 'total (incl overtime)', 'winner (incl. overtime)', 'winner (incl overtime)', 'total runs', 'first innings', 'first set-winner', '1 or draw', '1 or 2', 'draw or 2', 'single', 'multiple', 'system', 'betslip bet', 'max', 'vs.', 'vs', 'top soccer'].includes(s)) return 'betting';
  if (['soccer', 'tennis', 'basketball', 'cricket', 'ecricket', 'american football', 'ice hockey', 'nba 2k', 'fifa', 'fifa: volta', 'futsal', 'boxing', 'mma', 'darts', 'rugby', 'volleyball', 'cycling', 'floorball', 'bandy', 'squash', 'wrestling', 'efighting', 'eshooter', 'erocket league'].includes(s)) return 'sports';
  if (['live streams', 'championships', 'challenges', 'events', 'clans', 'ambassadors', 'promotions', 'monetisation', 'monetization', 'more', 'ebetstream arena', 'espace agent', 'agent space'].includes(s)) return 'nav';
  return 'ui';
}

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory() && f !== 'node_modules') walk(p, files);
    else if (f.endsWith('.vue')) files.push(p);
  }
  return files;
}

function splitVueSFC(content) {
  const templateMatch = content.match(/<template[^>]*>([\s\S]*)<\/template>/);
  if (!templateMatch) return null;
  return {
    before: content.slice(0, templateMatch.index),
    template: templateMatch[0],
    templateInner: templateMatch[1],
    after: content.slice(templateMatch.index + templateMatch[0].length),
  };
}

function extractStrings(templateInner) {
  const found = new Set();

  const textRe = />([^<>{}\n][^<>{}]{0,120})</g;
  let m;
  while ((m = textRe.exec(templateInner))) {
    const s = m[1].trim();
    if (!shouldSkip(s)) found.add(s);
  }

  const phRe = /placeholder="([^"]+)"/g;
  while ((m = phRe.exec(templateInner))) {
    const s = m[1].trim();
    if (!shouldSkip(s) && !s.includes('$t(')) found.add(s);
  }

  const ariaRe = /aria-label="([^"]+)"/g;
  while ((m = ariaRe.exec(templateInner))) {
    const s = m[1].trim();
    if (!shouldSkip(s) && !s.includes('$t(')) found.add(s);
  }

  const altRe = /alt="(?!Icon)([^"]+)"/g;
  while ((m = altRe.exec(templateInner))) {
    const s = m[1].trim();
    if (!shouldSkip(s) && !s.includes('$t(')) found.add(s);
  }

  return [...found];
}

function ensureUseI18n(content) {
  if (content.includes('useI18n')) return content;

  const scriptMatch = content.match(/<script setup[^>]*>/);
  if (scriptMatch) {
    const insertPos = scriptMatch.index + scriptMatch[0].length;
    const importLine = '\nimport { useI18n } from "vue-i18n";\nconst { t } = useI18n();\n';
    return content.slice(0, insertPos) + importLine + content.slice(insertPos);
  }

  const scriptBlock = '\n<script setup lang="ts">\nimport { useI18n } from "vue-i18n";\nconst { t } = useI18n();\n</script>\n';
  if (content.includes('<style')) {
    return content.replace('<style', scriptBlock + '<style');
  }
  return content + scriptBlock;
}

function replaceInTemplate(template, stringToKey) {
  let result = template;
  const entries = [...stringToKey.entries()].sort((a, b) => b[0].length - a[0].length);

  for (const [str, key] of entries) {
    const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    result = result.replace(
      new RegExp(`>\\s*${escaped}\\s*<`, 'g'),
      `>{{ $t('${key}') }}<`
    );

    result = result.replace(
      new RegExp(`placeholder="${escaped}"`, 'g'),
      `:placeholder="$t('${key}')"`
    );

    result = result.replace(
      new RegExp(`aria-label="${escaped}"`, 'g'),
      `:aria-label="$t('${key}')"`
    );

    if (str !== 'Icon') {
      result = result.replace(
        new RegExp(`alt="${escaped}"`, 'g'),
        `:alt="$t('${key}')"`
      );
    }
  }

  return result;
}

// Main
const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf8'));
const globalKeyMap = new Map();
const usedKeys = new Set();

function setNested(obj, parts, value) {
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  const last = parts[parts.length - 1];
  if (!cur[last]) {
    cur[last] = value;
    return true;
  }
  return false;
}

function assignKey(str) {
  if (globalKeyMap.has(str)) return globalKeyMap.get(str);

  const ns = categorize(str);
  let baseKey = toKey(str);
  if (!baseKey) baseKey = 'text';

  let fullKey = `${ns}.${baseKey}`;
  let counter = 2;
  while (usedKeys.has(fullKey)) {
    fullKey = `${ns}.${baseKey}_${counter++}`;
  }
  usedKeys.add(fullKey);

  const parts = fullKey.split('.');
  setNested(en, parts, str);
  globalKeyMap.set(str, fullKey);
  return fullKey;
}

const vueFiles = walk(SRC);
let totalReplaced = 0;
let filesModified = 0;

for (const file of vueFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const parts = splitVueSFC(content);
  if (!parts) continue;

  const strings = extractStrings(parts.templateInner);
  if (strings.length === 0) continue;

  const fileMap = new Map();
  for (const s of strings) {
    fileMap.set(s, assignKey(s));
  }

  const newTemplate = replaceInTemplate(parts.template, fileMap);
  let newContent = parts.before + newTemplate + parts.after;
  newContent = ensureUseI18n(newContent);

  if (newContent !== content) {
    totalReplaced += fileMap.size;
    filesModified++;
    if (!DRY_RUN) fs.writeFileSync(file, newContent);
    console.log(`✓ ${path.relative(SRC, file)} — ${fileMap.size} strings`);
  }
}

if (!DRY_RUN) {
  fs.writeFileSync(EN_JSON, JSON.stringify(en, null, 2) + '\n');
}

console.log(`\nDone${DRY_RUN ? ' (dry-run)' : ''}: ${filesModified} files, ${totalReplaced} strings, ${globalKeyMap.size} unique keys in en.json`);
