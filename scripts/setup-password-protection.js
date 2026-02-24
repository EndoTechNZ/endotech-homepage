import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const secretPath = '50344740e79c4934ebc490ee8ab5dc08';
const secretDir = path.join(distDir, secretPath);

// Create the secret directory
fs.mkdirSync(secretDir, { recursive: true });

// Move all files/directories to the secret directory
const items = fs.readdirSync(distDir);
for (const item of items) {
  if (item === secretPath) continue;

  const srcPath = path.join(distDir, item);
  const destPath = path.join(secretDir, item);
  fs.renameSync(srcPath, destPath);
}

// Copy password gate to index.html
const passwordGateSrc = path.join(__dirname, '..', 'src', 'password-gate.html');
const indexDest = path.join(distDir, 'index.html');
fs.copyFileSync(passwordGateSrc, indexDest);

console.log(`Password protection setup complete. Content moved to /${secretPath}/`);
