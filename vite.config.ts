import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The build-time prerender (scripts/prerender.mjs) bundles GSAP's ES modules into the server build.
  ssr: { noExternal: ['gsap', '@gsap/react'] },
})
