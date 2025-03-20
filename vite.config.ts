import { defineConfig,loadEnv } from 'vite';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react'
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'
import fs from 'fs'


const envFiles = [
  /** default file */
  `.env`,
  /** mode file */
  `.env.${process.env.NODE_ENV}`,
];

for (const file of envFiles) {
  const envConfig = dotenv.parse(fs.readFileSync(file));
  for (const k in envConfig) {
      process.env[k] = envConfig[k];
  }
}




/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  server: {
    port: parseInt(process.env.VITE_PORT || '5173'),
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/socket.io': {
        target: process.env.VITE_WS_URL,
        ws: true
      }
    }
  }
});