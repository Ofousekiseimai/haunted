import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// User agents that typically fetch Open Graph / Twitter cards
const SOCIAL_BOT_USER_AGENTS = /facebookexternalhit|twitterbot|pinterest|slackbot|discordbot|whatsapp|telegrambot|linkedinbot|skypeuripreview/i;

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  const isSocialBot = SOCIAL_BOT_USER_AGENTS.test(userAgent.toLowerCase());
  const isSocialMetaRequest = ['GET', 'HEAD'].includes(req.method) && req.path.startsWith('/api/social-meta');

  if (isSocialBot || isSocialMetaRequest) {
    return next();
  }

  if (req.get('X-Dev-Mode') !== 'true') {
    return res.status(403).send('Access denied');
  }
  next();
});

// Helper functions
const getFilePath = (category, subcategory) => {
  const validCategories = ['laografia', 'efimerides' ,'etaireia-psychikon-ereynon'];
  if (!validCategories.includes(category)) {
    throw new Error('Invalid category');
  }
  
  return path.join(
    __dirname,
    'public',
    'data',
    category,
    `${subcategory}.json`
  );
};

// NEW: Helper function to get article data
const getArticleData = async (category, subcategory, slug) => {
  try {
    const filePath = getFilePath(category, subcategory);
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    const article = jsonData.articles.find(a => a.slug === slug);
    if (!article) throw new Error('Article not found');
    
    return {
      article,
      collection: jsonData,
      subcategorySlug: subcategory
    };
  } catch (error) {
    throw new Error(`Error loading article: ${error.message}`);
  }
};

// NEW: Helper function to get category data
const getCategoryData = async (category, subcategory) => {
  try {
    if (!subcategory) {
      throw new Error('Subcategory is required for category data');
    }

    const filePath = getFilePath(category, subcategory);
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    return {
      title: jsonData.seo?.metaTitle || jsonData.subcategory || subcategory,
      description: jsonData.seo?.metaDescription || `Explore ${subcategory} stories on haunted.gr`,
      image: jsonData.seo?.image,
      keywords: jsonData.seo?.keywords,
      canonical: jsonData.seo?.canonical,
      raw: jsonData
    };
  } catch (error) {
    throw new Error(`Error loading category: ${error.message}`);
  }
};

const buildAbsoluteUrl = (pathSegment = '') => {
  const base = 'https://haunted.gr';
  if (!pathSegment) return base;
  return pathSegment.startsWith('http') ? pathSegment : `${base}${pathSegment}`;
};

const buildSocialMetaHtml = ({
  title,
  description = '',
  image,
  url,
  type = 'website',
  publishedTime
}) => {
  const siteName = 'haunted.gr';
  const absoluteImage = image ? buildAbsoluteUrl(image) : buildAbsoluteUrl('/images/og-default-image.webp');

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(title)} | ${siteName}</title>
          <meta name="description" content="${escapeHtml(description)}" />
          <link rel="canonical" href="${escapeHtml(url)}" />
          <meta property="og:title" content="${escapeHtml(title)} | ${siteName}" />
          <meta property="og:description" content="${escapeHtml(description)}" />
          <meta property="og:url" content="${escapeHtml(url)}" />
          <meta property="og:image" content="${escapeHtml(absoluteImage)}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:type" content="${escapeHtml(type)}" />
          <meta property="og:site_name" content="${siteName}" />
          <meta property="og:locale" content="el_GR" />
          ${type === 'article' && publishedTime ? `<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />` : ''}
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${escapeHtml(title)} | ${siteName}" />
          <meta name="twitter:description" content="${escapeHtml(description)}" />
          <meta name="twitter:url" content="${escapeHtml(url)}" />
          <meta name="twitter:image" content="${escapeHtml(absoluteImage)}" />
        </head>
        <body>
          <script>
            window.location.href = "${url}";
          </script>
        </body>
      </html>
    `;
};

const buildArticleMeta = ({ article, collection }, urlPath) => {
  const description = article.excerpt || article.description || collection.seo?.metaDescription || '';
  const title = article.title || collection.seo?.metaTitle || collection.subcategory || 'Haunted Greece';

  return {
    title,
    description,
    image: article.image?.src || collection.seo?.image,
    url: buildAbsoluteUrl(urlPath),
    type: 'article',
    publishedTime: article.date
  };
};

const buildCategoryMeta = (categoryData, urlPath) => ({
  title: categoryData.title || 'Haunted Greece',
  description: categoryData.description || '',
  image: categoryData.image,
  url: buildAbsoluteUrl(urlPath),
  type: 'website'
});

// NEW: Social media meta tags endpoint
app.get('/api/social-meta/:category/:subcategory?/:slug?', async (req, res) => {
  try {
    const { category, subcategory, slug } = req.params;
    const pathSegments = [category, subcategory, slug].filter(Boolean);
    const path = `/${pathSegments.join('/')}`;
    
    let htmlMeta;
    if (slug) {
      const data = await getArticleData(category, subcategory, slug);
      htmlMeta = buildArticleMeta(data, path);
    } else if (subcategory) {
      const categoryData = await getCategoryData(category, subcategory);
      htmlMeta = buildCategoryMeta(categoryData, path);
    } else {
      htmlMeta = buildCategoryMeta(
        {
          title: 'Η στοιχειωμένη Ελλάδα',
          description: 'Haunted Greece - Η μεγαλύτερη συλλογή ελληνικής λαογραφίας και παραφυσικών ερευνών.',
          image: '/images/og-default-image.webp'
        },
        path || '/'
      );
    }
    
    const html = buildSocialMetaHtml(htmlMeta);
    
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Social meta error:', error);
    // Fallback to homepage if there's an error
    res.redirect('https://haunted.gr/');
  }
});

const SUPPORTED_SOCIAL_CATEGORIES = new Set([
  'laografia',
  'efimerides',
  'etaireia-psychikon-ereynon'
]);

const defaultMeta = (path = '/') =>
  buildCategoryMeta(
    {
      title: 'Η στοιχειωμένη Ελλάδα',
      description: 'Haunted Greece - Η μεγαλύτερη συλλογή ελληνικής λαογραφίας, παράξενων φαινομένων και ψυχικών ερευνών.',
      image: '/images/og-default-image.webp'
    },
    path
  );

app.get('*', async (req, res, next) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    return next();
  }

  if (req.path.startsWith('/api')) {
    return next();
  }

  const userAgent = (req.get('user-agent') || '').toLowerCase();
  const isSocialBot = SOCIAL_BOT_USER_AGENTS.test(userAgent);

  if (!isSocialBot) {
    return next();
  }

  try {
    const segments = req.path.split('/').filter(Boolean);
    const [rawCategory, rawSubcategory, ...rest] = segments;
    const category = rawCategory ? decodeURIComponent(rawCategory) : null;
    const subcategory = rawSubcategory ? decodeURIComponent(rawSubcategory) : null;
    const slug = rest.length ? decodeURIComponent(rest.join('/')) : null;
    const path = `/${segments.join('/')}`;

    let htmlMeta;

    if (category && slug && SUPPORTED_SOCIAL_CATEGORIES.has(category)) {
      const data = await getArticleData(category, subcategory, slug);
      htmlMeta = buildArticleMeta(data, path);
    } else if (category && subcategory && SUPPORTED_SOCIAL_CATEGORIES.has(category)) {
      const categoryData = await getCategoryData(category, subcategory);
      htmlMeta = buildCategoryMeta(categoryData, path);
    } else {
      htmlMeta = defaultMeta(path);
    }

    const html = buildSocialMetaHtml(htmlMeta);
    res.set('Content-Type', 'text/html');
    return res.send(html);
  } catch (error) {
    console.error('Social bot render error:', error);
    return next();
  }
});

// Your existing endpoints
app.put('/api/article/:category/:subcategory/:id', async (req, res) => {
  try {
    const { category, subcategory, id } = req.params;
    const updatedArticle = req.body;
    
    const filePath = getFilePath(category, subcategory);
    console.log('Attempting to save to:', filePath);
    
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    const articleIndex = jsonData.articles.findIndex(a => a.id === id);
    if (articleIndex === -1) return res.status(404).send('Article not found');
    
    jsonData.articles[articleIndex] = updatedArticle;
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Error saving article: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
