import fs from 'fs';
import path from 'path';

const generateSitemap = () => {
  const DOMAIN = 'https://haunted.gr';
  const OUTPUT_PATH = path.resolve('dist', 'sitemap.xml');
  const CATEGORIES = ['efimerides', 'laografia'];
  
  let urls = [
    { loc: '/', priority: '1.0' },
    { loc: '/about', priority: '0.8' },
    { loc: '/contact', priority: '0.8' },
    { loc: '/categories', priority: '0.9' }
  ];

  // Process all articles
  CATEGORIES.forEach(category => {
    const categoryPath = path.resolve('public', 'data', category);
    const files = fs.readdirSync(categoryPath);
    
    files.forEach(file => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(categoryPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        data.articles.forEach(article => {
          urls.push({
            loc: `/${category}/${article.slug}`,
            lastmod: new Date().toISOString().split('T')[0],
            priority: '0.7',
            image: article.image?.src ? `${DOMAIN}${article.image.src}` : null
          });
        });
      }
    });
  });

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  urls.forEach(url => {
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod || new Date().toISOString().split('T')[0]}</lastmod>\n`;
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