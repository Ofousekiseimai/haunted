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
// server.js - Fix the file path
const getFilePath = (category, subcategory) => {
  // Validate against your category configuration
  const validCategories = ['laografia', 'efimerides'];
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

// Endpoints
app.put('/api/article/:category/:subcategory/:id', async (req, res) => {
  try {
    const { category, subcategory, id } = req.params;
    const updatedArticle = req.body;
    
    const filePath = getFilePath(category, subcategory);
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    const articleIndex = jsonData.articles.findIndex(a => a.id === id);
    if (articleIndex === -1) return res.status(404).send('Article not found');
    
    jsonData.articles[articleIndex] = updatedArticle;
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).send('Error saving article');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.put('/api/article/:category/:subcategory/:id', async (req, res) => {
  try {
    const { category, subcategory, id } = req.params;
    const updatedArticle = req.body;
    
    const filePath = getFilePath(category, subcategory);
    console.log('Attempting to save to:', filePath); // Add logging
    
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    const articleIndex = jsonData.articles.findIndex(a => a.id === id);
    if (articleIndex === -1) return res.status(404).send('Article not found');
    
    jsonData.articles[articleIndex] = updatedArticle;
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Server error:', error); // Detailed logging
    res.status(500).send('Error saving article: ' + error.message);
  }
});