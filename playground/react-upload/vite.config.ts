import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
export default defineConfig(({ mode, command }) => {
  const root = process.cwd()
  return {
    resolve: {
      alias: [
        {
          find: '@',
          replacement: `${pathResolve('src')}/`,
        },
      ],
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [react()],
  }
})
