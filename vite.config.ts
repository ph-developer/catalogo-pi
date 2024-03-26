import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import {visualizer} from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        visualizer()
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'firebase': [
                        'firebase/app',
                        'firebase/auth',
                        'firebase/storage'
                    ],
                    'firebase-data': [
                        'firebase/firestore',
                        'firebase/database',
                    ]
                }
            },
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        watch: {
            usePolling: true,
        }
    }
})
