import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        host: '0.0.0.0',
        port: 51915,
    },
    build: {
        chunkSizeWarningLimit: 1000
    }
})