import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/backend': {
        target: 'http://13.236.6.37:5001/',
        secure: false,
      },
    },
  },
  plugins: [react()],
});

//http://13.236.6.37:5001/