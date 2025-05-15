export const normalizeString = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

// Static import of all JSON files
const jsonModules = import.meta.glob('../data/**/*.json', {
  eager: true,
  import: 'default'
});

export const searchAllArticles = async (query) => {
  // Get all category configurations
  const { CATEGORY_CONFIG, SUBCATEGORY_MAP } = await import('../constants/categories');

  // Load all articles from all categories
  const allArticles = await Promise.all(
    Object.values(SUBCATEGORY_MAP).map(async (config) => {
      try {
        const categoryConfig = CATEGORY_CONFIG[config.category];
        const jsonPath = `${categoryConfig.dataPath}${config.slug}.json`;
        const data = jsonModules[jsonPath];

        if (!data) {
          console.error(`Data not found for path: ${jsonPath}`);
          return [];
        }

        return data.articles.map(article => ({
          ...article,
          category: config.category,
          subcategory: config.slug
        }));
      } catch (error) {
        console.error('Error processing category data:', error);
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