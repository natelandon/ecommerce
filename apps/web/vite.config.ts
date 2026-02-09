import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'stripe-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          'ui-vendor': ['tailwind-merge', 'clsx', 'class-variance-authority'],
          // Lazy load these non-critical modules
          growthbook: ['@growthbook/growthbook-react'],
          'next-themes': ['next-themes'],
        },
      },
    },
    // Use esbuild for minification (faster than terser)
    minify: 'esbuild',
    // Generate source maps for debugging but don't inline
    sourcemap: true,
    // Target modern browsers for smaller bundle
    target: 'es2020',
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
});
