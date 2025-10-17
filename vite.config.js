import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/",

  // ✅ Vitest Configuration
  test: {
    globals: true, // so you can use describe/it/expect without imports
    environment: "jsdom", // simulate browser environment
    include: ["**/__tests__/**/*.test.{js,jsx,ts,tsx}"], // test file pattern

    // ✅ Add this line to automatically run setup file before all tests
    setupFiles: "./src/setupTests.js",
  },
});
