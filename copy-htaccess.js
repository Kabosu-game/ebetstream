import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, 'public', '.htaccess');
const dest = path.join(__dirname, 'dist', '.htaccess');

if (fs.existsSync(source)) {
  fs.copyFileSync(source, dest);
  console.log('✓ .htaccess copied to dist/');
} else {
  console.log('⚠ .htaccess not found in public/');
}

