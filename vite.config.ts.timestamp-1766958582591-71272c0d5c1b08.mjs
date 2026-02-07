// vite.config.ts
import { defineConfig } from "file:///C:/wamp64/www/oddx/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/wamp64/www/oddx/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { fileURLToPath, URL } from "url";
var __vite_injected_original_import_meta_url = "file:///C:/wamp64/www/oddx/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  // Environment variables
  // In production, these should be set via .env.production or build-time environment variables
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      process.env.VITE_API_BASE_URL || (process.env.NODE_ENV === "production" ? "https://ebetstream.com/apii/api" : "http://localhost:8001/api")
    ),
    "import.meta.env.VITE_STORAGE_BASE_URL": JSON.stringify(
      process.env.VITE_STORAGE_BASE_URL || (process.env.NODE_ENV === "production" ? "https://ebetstream.com/apii" : "http://localhost:8001")
    )
  },
  // Development server configuration
  server: {
    // Force port 5173 to match CORS configuration on server
    // If port 5173 is busy, you'll need to update CORS on the server
    port: 5173,
    strictPort: false
    // Allow fallback to next available port if 5173 is busy
    // Proxy API requests to avoid CORS issues in development
    // Uncomment if you have CORS issues with the remote API
    // proxy: {
    //   '/api': {
    //     target: 'https://api.ebetstream.com',
    //     changeOrigin: true,
    //     secure: true, // Set to false if you have SSL certificate issues
    //     rewrite: (path) => path.replace(/^\/api/, '/api'),
    //   }
    // }
  },
  // Build configuration for production
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          "vue-vendor": ["vue", "vue-router"],
          "ui-vendor": ["@headlessui/vue", "@tabler/icons-vue"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx3YW1wNjRcXFxcd3d3XFxcXG9kZHhcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHdhbXA2NFxcXFx3d3dcXFxcb2RkeFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovd2FtcDY0L3d3dy9vZGR4L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcInVybFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3Z1ZSgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgfSxcbiAgLy8gRW52aXJvbm1lbnQgdmFyaWFibGVzXG4gIC8vIEluIHByb2R1Y3Rpb24sIHRoZXNlIHNob3VsZCBiZSBzZXQgdmlhIC5lbnYucHJvZHVjdGlvbiBvciBidWlsZC10aW1lIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICBkZWZpbmU6IHtcbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX0JBU0VfVVJMJzogSlNPTi5zdHJpbmdpZnkoXG4gICAgICBwcm9jZXNzLmVudi5WSVRFX0FQSV9CQVNFX1VSTCB8fCBcbiAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gJ2h0dHBzOi8vZWJldHN0cmVhbS5jb20vYXBpaS9hcGknIDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMS9hcGknKVxuICAgICksXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX1NUT1JBR0VfQkFTRV9VUkwnOiBKU09OLnN0cmluZ2lmeShcbiAgICAgIHByb2Nlc3MuZW52LlZJVEVfU1RPUkFHRV9CQVNFX1VSTCB8fCBcbiAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gJ2h0dHBzOi8vZWJldHN0cmVhbS5jb20vYXBpaScgOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAxJylcbiAgICApLFxuICB9LFxuICAvLyBEZXZlbG9wbWVudCBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICBzZXJ2ZXI6IHtcbiAgICAvLyBGb3JjZSBwb3J0IDUxNzMgdG8gbWF0Y2ggQ09SUyBjb25maWd1cmF0aW9uIG9uIHNlcnZlclxuICAgIC8vIElmIHBvcnQgNTE3MyBpcyBidXN5LCB5b3UnbGwgbmVlZCB0byB1cGRhdGUgQ09SUyBvbiB0aGUgc2VydmVyXG4gICAgcG9ydDogNTE3MyxcbiAgICBzdHJpY3RQb3J0OiBmYWxzZSwgLy8gQWxsb3cgZmFsbGJhY2sgdG8gbmV4dCBhdmFpbGFibGUgcG9ydCBpZiA1MTczIGlzIGJ1c3lcbiAgICAvLyBQcm94eSBBUEkgcmVxdWVzdHMgdG8gYXZvaWQgQ09SUyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnRcbiAgICAvLyBVbmNvbW1lbnQgaWYgeW91IGhhdmUgQ09SUyBpc3N1ZXMgd2l0aCB0aGUgcmVtb3RlIEFQSVxuICAgIC8vIHByb3h5OiB7XG4gICAgLy8gICAnL2FwaSc6IHtcbiAgICAvLyAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9hcGkuZWJldHN0cmVhbS5jb20nLFxuICAgIC8vICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgLy8gICAgIHNlY3VyZTogdHJ1ZSwgLy8gU2V0IHRvIGZhbHNlIGlmIHlvdSBoYXZlIFNTTCBjZXJ0aWZpY2F0ZSBpc3N1ZXNcbiAgICAvLyAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcvYXBpJyksXG4gICAgLy8gICB9XG4gICAgLy8gfVxuICB9LFxuICAvLyBCdWlsZCBjb25maWd1cmF0aW9uIGZvciBwcm9kdWN0aW9uXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICd2dWUtdmVuZG9yJzogWyd2dWUnLCAndnVlLXJvdXRlciddLFxuICAgICAgICAgICd1aS12ZW5kb3InOiBbJ0BoZWFkbGVzc3VpL3Z1ZScsICdAdGFibGVyL2ljb25zLXZ1ZSddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdQLFNBQVMsb0JBQW9CO0FBQzdRLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWUsV0FBVztBQUZnSCxJQUFNLDJDQUEyQztBQUtwTSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDZixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQSxFQUdBLFFBQVE7QUFBQSxJQUNOLHFDQUFxQyxLQUFLO0FBQUEsTUFDeEMsUUFBUSxJQUFJLHNCQUNYLFFBQVEsSUFBSSxhQUFhLGVBQWUsb0NBQW9DO0FBQUEsSUFDL0U7QUFBQSxJQUNBLHlDQUF5QyxLQUFLO0FBQUEsTUFDNUMsUUFBUSxJQUFJLDBCQUNYLFFBQVEsSUFBSSxhQUFhLGVBQWUsZ0NBQWdDO0FBQUEsSUFDM0U7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLFFBQVE7QUFBQTtBQUFBO0FBQUEsSUFHTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBV2Q7QUFBQTtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osY0FBYyxDQUFDLE9BQU8sWUFBWTtBQUFBLFVBQ2xDLGFBQWEsQ0FBQyxtQkFBbUIsbUJBQW1CO0FBQUEsUUFDdEQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
