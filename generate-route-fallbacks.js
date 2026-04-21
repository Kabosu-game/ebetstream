import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routeFile = path.join(__dirname, "src", "route.ts");
const distDir = path.join(__dirname, "dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("✗ dist/index.html introuvable. Lancez d'abord le build Vite.");
  process.exit(1);
}

if (!fs.existsSync(routeFile)) {
  console.error("✗ src/route.ts introuvable.");
  process.exit(1);
}

const routeContent = fs.readFileSync(routeFile, "utf8");
const routeMatches = [...routeContent.matchAll(/path:\s*["'`]([^"'`]+)["'`]/g)];

const staticRoutes = new Set();
for (const match of routeMatches) {
  const routePath = match[1].trim();
  if (!routePath || routePath === "/") continue;
  if (routePath.includes(":") || routePath.includes("*")) continue;
  if (!routePath.startsWith("/")) continue;
  staticRoutes.add(routePath);
}

const indexHtml = fs.readFileSync(indexPath, "utf8");
let generatedCount = 0;

// Fallback global utile pour certains hébergeurs statiques.
fs.writeFileSync(path.join(distDir, "404.html"), indexHtml);

for (const routePath of staticRoutes) {
  const routeDir = path.join(distDir, routePath.replace(/^\/+/, ""));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, "index.html"), indexHtml);
  generatedCount += 1;
}

console.log(`✓ Route fallbacks générés: ${generatedCount}`);
console.log("✓ 404.html généré");
