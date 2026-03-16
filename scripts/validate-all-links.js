#!/usr/bin/env node

/**
 * Post-build link validator for ALL HTML pages (including non-Starlight pages)
 * Validates that internal links point to existing files in the build output
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const basePath = process.env.DEPLOY_TARGET === 'github-pages'
  ? '/endotech-homepage/'
  : '/';

function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function resolveLink(link, basePath) {
  // Skip external links, anchors, mailto, tel, etc.
  if (link.startsWith('http://') || link.startsWith('https://') ||
      link.startsWith('#') || link.startsWith('mailto:') ||
      link.startsWith('tel:') || link.startsWith('javascript:') ||
      link.startsWith('data:')) {
    return null;
  }

  // Handle absolute links
  if (link.startsWith('/')) {
    return link;
  }

  // Handle relative links - resolve from current page's directory
  const baseDir = path.dirname(basePath);
  const resolved = path.resolve(baseDir, link);
  // Convert back to URL path relative to dist
  return '/' + path.relative(distDir, resolved).replace(/\\/g, '/');
}

function linkExistsInDist(link) {
  // Remove trailing slash and anchor
  let cleanLink = link.split('#')[0];
  const normalizedBase = basePath === '/' ? '' : basePath.replace(/\/$/, '');

  if (normalizedBase && cleanLink === normalizedBase) {
    cleanLink = '/';
  } else if (normalizedBase && cleanLink.startsWith(normalizedBase + '/')) {
    cleanLink = cleanLink.slice(normalizedBase.length);
  }

  if (cleanLink.endsWith('/')) {
    cleanLink = cleanLink.slice(0, -1);
  }

  // Try as file
  const asFile = path.join(distDir, cleanLink);
  if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) {
    return true;
  }

  // Try as directory with index.html
  const asDir = path.join(distDir, cleanLink, 'index.html');
  if (fs.existsSync(asDir)) {
    return true;
  }

  // Try with .html extension
  const withHtml = path.join(distDir, cleanLink + '.html');
  if (fs.existsSync(withHtml)) {
    return true;
  }

  return false;
}

function validateHtmlFile(filePath) {
  const relativePath = path.relative(distDir, filePath);
  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const errors = [];

  // Check all links
  const links = document.querySelectorAll('a[href]');
  for (const link of links) {
    const href = link.getAttribute('href');
    const resolved = resolveLink(href, filePath);

    if (resolved && !linkExistsInDist(resolved)) {
      errors.push({
        file: relativePath,
        href: href,
        resolved: resolved,
        text: link.textContent?.trim().slice(0, 50) || '[no text]'
      });
    }
  }

  // Check link tags (CSS, favicon, etc.)
  const linkTags = document.querySelectorAll('link[href]');
  for (const link of linkTags) {
    const href = link.getAttribute('href');
    const resolved = resolveLink(href, filePath);

    if (resolved && !linkExistsInDist(resolved)) {
      errors.push({
        file: relativePath,
        href: href,
        resolved: resolved,
        text: `<link rel="${link.getAttribute('rel')}">`
      });
    }
  }

  // Check script tags
  const scripts = document.querySelectorAll('script[src]');
  for (const script of scripts) {
    const src = script.getAttribute('src');
    const resolved = resolveLink(src, filePath);

    if (resolved && !linkExistsInDist(resolved)) {
      errors.push({
        file: relativePath,
        href: src,
        resolved: resolved,
        text: '<script>'
      });
    }
  }

  // Check images
  const images = document.querySelectorAll('img[src]');
  for (const img of images) {
    const src = img.getAttribute('src');
    const resolved = resolveLink(src, filePath);

    if (resolved && !linkExistsInDist(resolved)) {
      errors.push({
        file: relativePath,
        href: src,
        resolved: resolved,
        text: `<img alt="${img.getAttribute('alt') || ''}">`
      });
    }
  }

  return errors;
}

function main() {
  console.log('Validating all links in build output...\n');

  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory not found. Run build first.');
    process.exit(1);
  }

  const htmlFiles = getAllHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML files to validate.\n`);

  let allErrors = [];

  for (const file of htmlFiles) {
    const errors = validateHtmlFile(file);
    allErrors = allErrors.concat(errors);
  }

  if (allErrors.length > 0) {
    console.error(`\n✗ Found ${allErrors.length} broken links:\n`);

    // Group by file
    const byFile = {};
    for (const err of allErrors) {
      if (!byFile[err.file]) byFile[err.file] = [];
      byFile[err.file].push(err);
    }

    for (const [file, errors] of Object.entries(byFile)) {
      console.error(`▶ ${file}`);
      for (const err of errors) {
        console.error(`  ├─ ${err.href} → ${err.resolved}`);
        console.error(`  │  (${err.text})`);
      }
    }

    console.error('\n');
    process.exit(1);
  }

  console.log('✓ All links are valid.\n');
}

main();
