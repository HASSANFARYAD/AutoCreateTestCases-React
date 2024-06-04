import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    port:3000
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.REACT_APP_API_URL),
    'process.env.MY_ENV': JSON.stringify(process.env.REACT_APP_NOTIFICATION_URL)
  }
});
