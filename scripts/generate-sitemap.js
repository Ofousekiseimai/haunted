#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://haunted.gr';
const publicDir = path.join(__dirname, '..', 'public');
const dataDir = path.join(publicDir, 'data');

const staticPaths = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/laografia', priority: 0.9, changefreq: 'weekly' },
  { path: '/efimerides', priority: 0.9, changefreq: 'weekly' },
  { path: '/etaireia-psychikon-ereynon', priority: 0.8, changefreq: 'monthly' },
  { path: '/map', priority: 0.6, changefreq: 'monthly' },
  { path: '/map2', priority: 0.6, changefreq: 'monthly' },
  { path: '/about-us', priority: 0.6, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' }
];

const urls = new Map();

const normalizePath = (input) => {
  if (!input || typeof input !== 'string') return '/';
  let value = input.trim();
  if (!value) return '/';
  if (!value.startsWith('/')) {
    value = `/${value}`;
  }
  if (value.length > 1 && value.endsWith('/')) {
    value = value.slice(0, -1);
  }
  return value;
};

const formatDate = (input) => {
  if (!input) return null;
  const value = String(input).trim();
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split('T')[0];
};

const escapeXml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;');

const addUrl = ({ path: rawPath, priority = 0.5, changefreq = 'monthly', lastmod = null }) => {
  const normalized = normalizePath(rawPath);
  const loc = normalized === '/' ? baseUrl : `${baseUrl}${normalized}`;
  const encodedLoc = encodeURI(loc);

  const existing = urls.get(encodedLoc) || {};
  const numericPriority = Number(priority);
  const existingPriority = Number(existing.priority);

  const entry = {
    loc: encodedLoc,
    priority: Number.isFinite(existingPriority)
      ? Math.max(existingPriority, numericPriority)
      : numericPriority,
    changefreq: existing.changefreq ?? changefreq,
    lastmod: lastmod || existing.lastmod || null
  };

  urls.set(encodedLoc, entry);
};

const buildArticleEntries = (subcategoryPath, articles = []) => {
  const entries = [];

  for (const article of articles) {
    if (!article?.slug) continue;
    const slug = String(article.slug).trim();
    if (!slug) continue;

    const articlePath = `${normalizePath(subcategoryPath)}/${slug}`;
    const lastmod =
      formatDate(article.updatedAt) ||
      formatDate(article.date) ||
      formatDate(article.articledate) ||
      null;

    entries.push({
      path: articlePath,
      priority: 0.6,
      changefreq: 'monthly',
      lastmod
    });
  }

  return entries;
};

const buildCategoryEntries = async () => {
  const dirents = await fs.readdir(dataDir, { withFileTypes: true });

  for (const dirent of dirents) {
    if (!dirent.isDirectory()) continue;

    const category = dirent.name;
    addUrl({ path: `/${category}`, priority: 0.8, changefreq: 'weekly' });

    const files = await fs.readdir(path.join(dataDir, category));
    for (const fileName of files) {
      if (!fileName.endsWith('.json')) continue;

      const filePath = path.join(dataDir, category, fileName);
      const data = JSON.parse(await fs.readFile(filePath, 'utf8'));

      const subSlug = data.subcategorySlug || path.basename(fileName, '.json');
      const subcategoryPath = normalizePath(`/${category}/${subSlug}`);
      const lastmod = formatDate(data.seo?.lastModified) || null;

      addUrl({
        path: subcategoryPath,
        priority: 0.7,
        changefreq: 'weekly',
        lastmod
      });

      if (Array.isArray(data.articles)) {
        const articleEntries = buildArticleEntries(subcategoryPath, data.articles);
        for (const entry of articleEntries) {
          addUrl(entry);
        }
      }
    }
  }
};

const generateSitemap = async () => {
  staticPaths.forEach(addUrl);
  await buildCategoryEntries();

  const xmlLines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  const sortedEntries = [...urls.values()].sort((a, b) => a.loc.localeCompare(b.loc));

  for (const entry of sortedEntries) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    if (entry.lastmod) {
      xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    }
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');

  const outputPath = path.join(publicDir, 'sitemap.xml');
  await fs.writeFile(outputPath, `${xmlLines.join('\n')}\n`, 'utf8');
  console.log(`Sitemap written to ${outputPath}`);
};

generateSitemap().catch(error => {
  console.error('Failed to generate sitemap:', error);
  process.exitCode = 1;
});
