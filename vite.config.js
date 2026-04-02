import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',          // ← Electron 로컬 파일 경로 대응 필수
  build: {
    outDir: 'dist',
  },
})