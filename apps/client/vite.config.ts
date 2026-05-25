import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig(({ mode }) => ({
  resolve: { tsconfigPaths: true },
  legacy: {
    inconsistentCjsInterop: true,
  },
  server: {
    port: Number(loadEnv(mode, process.cwd(), '').PORT) || 3001,
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
  ],
}))

export default config
