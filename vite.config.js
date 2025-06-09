import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generateSitemap from './src/utils/sitemapGenerator' // Import your generator

export default defineConfig({
  plugins: [
    react(),
    // Sitemap generator plugin
    {
      name: 'sitemap-generator',
      apply: 'build', // Only run during build
      closeBundle: {
        async handler() {
          try {
            console.log('⏳ Generating sitemap...')
            await generateSitemap()
            console.log('✅ Sitemap generated successfully')
          } catch (error) {
            console.error('❌ Sitemap generation failed:', error)
          }
        }
      }
    }
  ],
  base: '/',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  server: {
    allowedHosts: ['haunted.gr'],
  },
  build: {
    // Ensure this matches your output directory
    outDir: 'dist'
  }
})