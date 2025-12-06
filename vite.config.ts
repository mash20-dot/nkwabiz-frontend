import { defineConfig, loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl =
    env.VITE_API_BASE_URL || "https://nkwabiz-backend-testing.onrender.com";

  // Extract hostname for caching pattern
  const apiHostname = new URL(apiBaseUrl).hostname.replace(/\./g, "\\.");

  return {
    plugins: [
      tailwindcss(),
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["pwa/favicon.ico", "pwa/apple-touch-icon.png"],
        manifest: {
          name: "Nkwabiz - Business Management",
          short_name: "Nkwabiz",
          description: "Complete business management solution for SMEs",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#1e40af", // Blue-800 to match your app theme
          orientation: "portrait",
          icons: [
            {
              src: "/pwa/web-app-manifest-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/pwa/web-app-manifest-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
          categories: ["business", "finance", "productivity"],
          screenshots: [], // Optional: Add screenshots for app stores
        },
        workbox: {
          // Cache strategy
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          runtimeCaching: [
            {
              // Cache API calls dynamically based on env variable
              urlPattern: new RegExp(`^https:\\/\\/${apiHostname}\\/.*`, "i"),
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60, // 1 hour
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
                networkTimeoutSeconds: 10, // Fallback to cache after 10s
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
          ],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
        },
        devOptions: {
          enabled: true, // Enable in development for testing
          type: "module",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    preview: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5173,
      host: "0.0.0.0",
      allowedHosts: ["nkwabiz-frontend-1.onrender.com", "nkwabiz.com", "www.nkwabiz.com"],
    },
  };
});
