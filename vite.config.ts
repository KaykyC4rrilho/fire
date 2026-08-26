import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { submissionsApiPlugin } from './server/vite-submissions-plugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [
      submissionsApiPlugin(),
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
  }
})
