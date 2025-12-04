import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Anything starting with /api will be forwarded to the backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})

/*
// Elastic Search stuff (still commented out)
const connector = new ElasticsearchAPIConnector({
  host: "http://localhost:5173/BrowseEvents/", 
  index: "main.jsx", 
});

export const driver = new SearchDriver({
  apiConnector: connector,
  searchQuery: {
    search_fields: {
      title: {}, // Replace with fields you want to search
    },
    result_fields: {
      title: { raw: {} },
      description: { raw: {} },
    },
  },
});
*/
