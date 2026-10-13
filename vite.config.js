import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'firebase-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'animation-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'ui-vendor';
          }
        },
      },
    },
  },
})
