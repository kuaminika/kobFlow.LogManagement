import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const BASE_URL = process.env.BASE_URL || '';

// https://vite.dev/config/
export default defineConfig({
  base:BASE_URL,
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server:{host:true, port:5173,
    watch:{usePolling:true,interval:100}
  }
})
