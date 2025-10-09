import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://haunted.gr';
const OUTPUT_PATH = path.resolve('dist', 'sitemap.xml');
const DATA_ROOT = path.resolve('public', 'data');
const TODAY = new Date().toISOString().split('T')[0];

const STATIC_ROUTES = [
  { loc: '/', priority: '1.0' },
  { loc: '/laografia', priority: '0.9' },
  { loc: '/etaireia-psychikon-ereynon', priority: '0.9' },
  { loc: '/efimerides', priority: '0.9' },
  { loc: '/map', priority: '0.6' },
  { loc: '/map2', priority: '0.6' },
  { loc: '/about-us', priority: '0.5' },
  { loc: '/terms', priority: '0.3' },
  { loc: '/privacy', priority: '0.3' }
];

const normalizeLoc = (loc = '/') => {
  const prefixed = loc.startsWith('/') ? loc : `/${loc}`;
  return prefixed.replace(/\/{2,}/g, '/');
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (date) => date.toISOString().split('T')[0];

const formatDateString = (value) => {
  const parsed = parseDate(value);
  return parsed ? formatDate(parsed) : null;
};

const getLatestArticleDate = (articles = []) => {
  let latest = null;

  articles.forEach(({ date }) => {
    const parsed = parseDate(date);
    if (parsed && (!latest || parsed > latest)) {
      latest = parsed;
    }
  });

  return latest ? formatDate(latest) : null;
};

const generateSitemap = () => {
  const urlMap = new Map();

  const addUrl = ({ loc, priority = '0.5', lastmod, image }) => {
    const normalizedLoc = normalizeLoc(loc);
    const existing = urlMap.get(normalizedLoc);

    const candidates = [];
    if (existing?.lastmod) {
      candidates.push(existing.lastmod);
    }
    if (lastmod) {
      candidates.push(lastmod);
    }

    let resolvedLastmod = null;
    candidates.forEach(candidate => {
      const parsed = parseDate(candidate);
      if (parsed && (!resolvedLastmod || parsed > resolvedLastmod)) {
        resolvedLastmod = parsed;
      }
    });

    urlMap.set(normalizedLoc, {
      loc: normalizedLoc,
      priority: existing?.priority || priority,
      lastmod: resolvedLastmod ? formatDate(resolvedLastmod) : (existing?.lastmod || TODAY),
      image: image || existing?.image || null
    });
  };

  STATIC_ROUTES.forEach(route => addUrl(route));

  if (fs.existsSync(DATA_ROOT)) {
    const categories = fs.readdirSync(DATA_ROOT).filter(entry => {
      const fullPath = path.join(DATA_ROOT, entry);
      return fs.statSync(fullPath).isDirectory();
    });

    categories.forEach(category => {
      const categoryPath = path.join(DATA_ROOT, category);
      const files = fs.readdirSync(categoryPath).filter(file => path.extname(file) === '.json');

      files.forEach(file => {
        const subcategorySlug = path.basename(file, '.json');
        const filePath = path.join(categoryPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const articles = Array.isArray(data.articles) ? data.articles : [];
        const latestDate = getLatestArticleDate(articles) || TODAY;

        const listingLoc = normalizeLoc(data.slug || `/${category}/${subcategorySlug}`);
        addUrl({
          loc: listingLoc,
          priority: '0.6',
          lastmod: latestDate
        });

        articles.forEach(article => {
          const detailSegments = [category];
          const detailSubcategory = article.subcategory || subcategorySlug;

          if (detailSubcategory && detailSubcategory !== category) {
            detailSegments.push(detailSubcategory);
          }

          detailSegments.push(article.slug);

          const articleLoc = normalizeLoc(`/${detailSegments.filter(Boolean).join('/')}`);
          addUrl({
            loc: articleLoc,
            priority: '0.7',
            lastmod: formatDateString(article.date) || latestDate,
            image: article.image?.src ? `${DOMAIN}${article.image.src}` : null
          });
        });
      });
    });
  }

  const urls = Array.from(urlMap.values());

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  urls.forEach(url => {
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;

    if (url.image) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${url.image}</image:loc>\n`;
      xml += `    </image:image>\n`;
    }

    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(OUTPUT_PATH, xml);
  console.log(`✅ Sitemap generated at ${OUTPUT_PATH} with ${urls.length} URLs`);
};

export default generateSitemap;
