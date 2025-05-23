/// <reference types="vite/client" />

declare module "*.json" {
  const value: {
    articles: Array<{
      id: string;
      title: string;
      excerpt: string;
      // Add other article properties
    }>;
  };
  export default value;
}