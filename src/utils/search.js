export const normalizeString = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };
  
  export const searchAllArticles = async (query) => {
    // Get all category configurations
    const { CATEGORY_CONFIG, SUBCATEGORY_MAP } = await import('../constants/categories');
    
    // Load all articles from all categories
    const allArticles = await Promise.all(
      Object.values(SUBCATEGORY_MAP).map(async (config) => {
        try {
          const categoryConfig = CATEGORY_CONFIG[config.category];
          const data = await import(/*vite-ignore*/ `${categoryConfig.dataPath}${config.slug}.json`);
          return data.default.articles.map(article => ({
            ...article,
            category: config.category,
            subcategory: config.slug
          }));
        } catch (error) {
          console.error('Error loading category data:', error);
          return [];
        }
      })
    );
  
    // Flatten the array of arrays
    const flattened = allArticles.flat();
  
    // Normalize search query
    const normalizedQuery = normalizeString(query);
  
    // Filter articles
    return flattened.filter(article => {
      const searchFields = [
        article.title,
        article.excerpt,
        article.content?.map(c => c.value).join(' '),
        article.locationTags?.join(' '),
        article.category,
        article.subcategory
      ].join(' ');
  
      return normalizeString(searchFields).includes(normalizedQuery);
    });
  };