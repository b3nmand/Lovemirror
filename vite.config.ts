import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import path from 'path'

=======
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
<<<<<<< HEAD
      "@": path.resolve(__dirname, "./src"),
    },
  },
=======
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: {
      // Customize HMR to be more resilient
      timeout: 5000,
      overlay: true,
      clientPort: 5173,
    },
    watch: {
      usePolling: true, // Enable polling for more reliable file watching
      interval: 1000, // Check for changes every second
    }
  },
  // Enable detailed build and runtime logs
  logLevel: 'info',
  // Clear console on restart
  clearScreen: false,
  build: {
    // Improve build performance
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Minify output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for now
        drop_debugger: true
      }
    }
  },
  // Define environment variables for production
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
})