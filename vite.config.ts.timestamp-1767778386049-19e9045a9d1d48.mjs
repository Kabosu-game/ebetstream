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
      process.env.VITE_API_BASE_URL || (process.env.NODE_ENV === "production" ? "https://acmpt.online/api" : "http://localhost:8001/api")
    ),
    "import.meta.env.VITE_STORAGE_BASE_URL": JSON.stringify(
      process.env.VITE_STORAGE_BASE_URL || (process.env.NODE_ENV === "production" ? "https://acmpt.online" : "http://localhost:8001")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx3YW1wNjRcXFxcd3d3XFxcXG9kZHhcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHdhbXA2NFxcXFx3d3dcXFxcb2RkeFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovd2FtcDY0L3d3dy9vZGR4L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcInVybFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3Z1ZSgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgfSxcbiAgLy8gRW52aXJvbm1lbnQgdmFyaWFibGVzXG4gIC8vIEluIHByb2R1Y3Rpb24sIHRoZXNlIHNob3VsZCBiZSBzZXQgdmlhIC5lbnYucHJvZHVjdGlvbiBvciBidWlsZC10aW1lIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICBkZWZpbmU6IHtcbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX0JBU0VfVVJMJzogSlNPTi5zdHJpbmdpZnkoXG4gICAgICBwcm9jZXNzLmVudi5WSVRFX0FQSV9CQVNFX1VSTCB8fCBcbiAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gJ2h0dHBzOi8vYWNtcHQub25saW5lL2FwaScgOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAxL2FwaScpXG4gICAgKSxcbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfU1RPUkFHRV9CQVNFX1VSTCc6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgcHJvY2Vzcy5lbnYuVklURV9TVE9SQUdFX0JBU0VfVVJMIHx8IFxuICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyAnaHR0cHM6Ly9hY21wdC5vbmxpbmUnIDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMScpXG4gICAgKSxcbiAgfSxcbiAgLy8gRGV2ZWxvcG1lbnQgc2VydmVyIGNvbmZpZ3VyYXRpb25cbiAgc2VydmVyOiB7XG4gICAgLy8gRm9yY2UgcG9ydCA1MTczIHRvIG1hdGNoIENPUlMgY29uZmlndXJhdGlvbiBvbiBzZXJ2ZXJcbiAgICAvLyBJZiBwb3J0IDUxNzMgaXMgYnVzeSwgeW91J2xsIG5lZWQgdG8gdXBkYXRlIENPUlMgb24gdGhlIHNlcnZlclxuICAgIHBvcnQ6IDUxNzMsXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsIC8vIEFsbG93IGZhbGxiYWNrIHRvIG5leHQgYXZhaWxhYmxlIHBvcnQgaWYgNTE3MyBpcyBidXN5XG4gICAgLy8gUHJveHkgQVBJIHJlcXVlc3RzIHRvIGF2b2lkIENPUlMgaXNzdWVzIGluIGRldmVsb3BtZW50XG4gICAgLy8gVW5jb21tZW50IGlmIHlvdSBoYXZlIENPUlMgaXNzdWVzIHdpdGggdGhlIHJlbW90ZSBBUElcbiAgICAvLyBwcm94eToge1xuICAgIC8vICAgJy9hcGknOiB7XG4gICAgLy8gICAgIHRhcmdldDogJ2h0dHBzOi8vYXBpLmViZXRzdHJlYW0uY29tJyxcbiAgICAvLyAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgIC8vICAgICBzZWN1cmU6IHRydWUsIC8vIFNldCB0byBmYWxzZSBpZiB5b3UgaGF2ZSBTU0wgY2VydGlmaWNhdGUgaXNzdWVzXG4gICAgLy8gICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnL2FwaScpLFxuICAgIC8vICAgfVxuICAgIC8vIH1cbiAgfSxcbiAgLy8gQnVpbGQgY29uZmlndXJhdGlvbiBmb3IgcHJvZHVjdGlvblxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAndnVlLXZlbmRvcic6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInXSxcbiAgICAgICAgICAndWktdmVuZG9yJzogWydAaGVhZGxlc3N1aS92dWUnLCAnQHRhYmxlci9pY29ucy12dWUnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUCxTQUFTLG9CQUFvQjtBQUM3USxPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlLFdBQVc7QUFGZ0gsSUFBTSwyQ0FBMkM7QUFLcE0sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQ2YsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUEsRUFHQSxRQUFRO0FBQUEsSUFDTixxQ0FBcUMsS0FBSztBQUFBLE1BQ3hDLFFBQVEsSUFBSSxzQkFDWCxRQUFRLElBQUksYUFBYSxlQUFlLDZCQUE2QjtBQUFBLElBQ3hFO0FBQUEsSUFDQSx5Q0FBeUMsS0FBSztBQUFBLE1BQzVDLFFBQVEsSUFBSSwwQkFDWCxRQUFRLElBQUksYUFBYSxlQUFlLHlCQUF5QjtBQUFBLElBQ3BFO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUE7QUFBQTtBQUFBLElBR04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVdkO0FBQUE7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLGNBQWMsQ0FBQyxPQUFPLFlBQVk7QUFBQSxVQUNsQyxhQUFhLENBQUMsbUJBQW1CLG1CQUFtQjtBQUFBLFFBQ3REO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
