import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL ||
        (mode === 'production' ? 'https://api.ebetstream.live/api' : '/api')
      ),
      'import.meta.env.VITE_STORAGE_BASE_URL': JSON.stringify(
        env.VITE_STORAGE_BASE_URL ||
        (mode === 'production' ? 'https://api.ebetstream.live' : '/api')
      ),
      'import.meta.env.VITE_STREAM_WS_URL': JSON.stringify(
        env.VITE_STREAM_WS_URL || 'wss://ebetstreamvf-production.up.railway.app'
      ),
    },
    server: {
      port: 5173,
      strictPort: false,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
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
          ws: true,
        },
      },
    },
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
  };
});
