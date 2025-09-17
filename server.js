import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
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
    
    return article;
  } catch (error) {
    throw new Error(`Error loading article: ${error.message}`);
  }
};

// NEW: Helper function to get category data
const getCategoryData = async (category, subcategory) => {
  try {
    const filePath = getFilePath(category, subcategory);
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    return {
      title: subcategory || category,
      description: `Explore ${subcategory || category} stories on haunted.gr`,
      // Add any other category metadata you need
    };
  } catch (error) {
    throw new Error(`Error loading category: ${error.message}`);
  }
};

// NEW: Social media meta tags endpoint
app.get('/api/social-meta/:category/:subcategory?/:slug?', async (req, res) => {
  try {
    const { category, subcategory, slug } = req.params;
    
    let metaData;
    if (slug) {
      // This is an article page
      metaData = await getArticleData(category, subcategory, slug);
    } else if (subcategory) {
      // This is a subcategory page
      metaData = await getCategoryData(category, subcategory);
    } else {
      // This is a main category page
      metaData = await getCategoryData(category);
    }
    
    // Construct the full URL
    const baseUrl = 'https://haunted.gr';
    let url = `${baseUrl}/${category}`;
    if (subcategory) url += `/${subcategory}`;
    if (slug) url += `/${slug}`;
    
    // Render HTML with meta tags
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${metaData.title} | haunted.gr</title>
          <meta property="og:title" content="${metaData.title} | haunted.gr" />
          <meta property="og:description" content="${metaData.excerpt || metaData.description}" />
          <meta property="og:url" content="${url}" />
          <meta property="og:image" content="https://haunted.gr${metaData.image?.src || '/og-default-image.jpg'}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:type" content="${slug ? 'article' : 'website'}" />
          <meta property="og:site_name" content="haunted.gr" />
          <meta property="og:locale" content="el_GR" />
          ${slug && metaData.date ? `<meta property="article:published_time" content="${metaData.date}" />` : ''}
          
          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${metaData.title} | haunted.gr" />
          <meta name="twitter:description" content="${metaData.excerpt || metaData.description}" />
          <meta name="twitter:image" content="https://haunted.gr${metaData.image?.src || '/og-default-image.jpg'}" />
        </head>
        <body>
          <script>
            // Redirect actual users to the main app
            window.location.href = "${url}";
          </script>
        </body>
      </html>
    `;
    
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Social meta error:', error);
    // Fallback to homepage if there's an error
    res.redirect('https://haunted.gr/');
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