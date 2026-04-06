#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '..', 'src', 'content', 'docs');

const docExtensions = new Set(['.md', '.mdx']);
const violations = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!docExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Reject markdown links and raw href/src attributes that start at the site root.
      const hasAbsoluteMarkdownLink = /\]\(\//.test(trimmed);
      const hasAbsoluteHref = /\bhref=(["'])\//.test(trimmed);
      const hasAbsoluteSrc = /\bsrc=(["'])\//.test(trimmed);

      if (hasAbsoluteMarkdownLink || hasAbsoluteHref || hasAbsoluteSrc) {
        violations.push({
          file: path.relative(path.join(__dirname, '..'), fullPath),
          line: index + 1,
          text: trimmed,
        });
      }
    });
  }
}

walk(docsDir);

if (violations.length > 0) {
  console.error('\nFound docs links that start from the site root. In Starlight docs, use relative links so GitHub Pages base paths keep working.\n');
  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line}`);
    console.error(`  ${violation.text}`);
  }
  console.error('\nUse relative paths like `../../technique/motor-settings/` instead of `/technique/motor-settings/` inside `src/content/docs`.\n');
  process.exit(1);
}

console.log('Docs link check passed.\n');
