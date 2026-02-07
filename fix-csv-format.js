import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const inputFile = 'src/components/Pages/Dashboard/https___www_micasamobile_it_shopify_.csv';
const outputFile = 'src/components/Pages/Dashboard/https___www_micasamobile_it_shopify_pt.csv';

console.log('📖 Lecture du fichier CSV original...');
const csvContent = fs.readFileSync(inputFile, 'utf-8');

console.log('🔍 Parsing du CSV...');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: false,
  relax_column_count: true,
  bom: false
});

console.log(`📊 Nombre de lignes: ${records.length}`);

// Obtenir les colonnes dans l'ordre exact de l'original
const headers = records.length > 0 ? Object.keys(records[0]) : [];

console.log('💾 Écriture du fichier avec format correct...');

// Écrire le fichier en préservant exactement le format original
const output = stringify(records, {
  header: true,
  columns: headers,
  quoted: true,
  quoted_empty: false, // IMPORTANT: false pour correspondre au format Shopify
  escape: '"',
  quoted_match: /[,"\n\r]/,
  record_delimiter: '\n' // Utiliser \n au lieu de \r\n
});

// Écrire sans BOM UTF-8
fs.writeFileSync(outputFile, output, { encoding: 'utf8' });

console.log(`\n✅ Fichier créé: ${outputFile}`);
console.log(`📊 Total: ${records.length} lignes`);
console.log(`📏 Taille: ${fs.statSync(outputFile).size} bytes`);

// Vérifier que le fichier est valide
try {
  const testContent = fs.readFileSync(outputFile, 'utf-8');
  const testRecords = parse(testContent, {
    columns: true,
    skip_empty_lines: false,
    relax_column_count: true
  });
  console.log(`✅ Fichier CSV valide: ${testRecords.length} lignes parsées`);
} catch (error) {
  console.error(`❌ Erreur de validation: ${error.message}`);
}



