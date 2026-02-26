import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Environment variables
  // In production, these should be set via .env.production or build-time environment variables
  define: {
    // En dev: /api → proxy vers http://localhost:8000 (API Laravel locale)
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.VITE_API_BASE_URL || 
      (process.env.NODE_ENV === 'production' ? 'https://acmpt.online/api' : '/api')
    ),
    'import.meta.env.VITE_STORAGE_BASE_URL': JSON.stringify(
      process.env.VITE_STORAGE_BASE_URL || 
      (process.env.NODE_ENV === 'production' ? 'https://acmpt.online' : '/api')
    ),
  },
  // Development server configuration
  server: {
    // Force port 5173 to match CORS configuration on server
    // If port 5173 is busy, you'll need to update CORS on the server
    port: 5173,
    strictPort: false, // Allow fallback to next available port if 5173 is busy
    // Désactiver le cache en dev pour éviter les anciennes versions
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
    // Proxy API requests to avoid CORS issues in development
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/peerjs': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        ws: true, // WebSocket support for PeerJS
      },
    }
  },
  // Build configuration for production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'ui-vendor': ['@headlessui/vue', '@tabler/icons-vue'],
        },
      },
    },
  },
});
