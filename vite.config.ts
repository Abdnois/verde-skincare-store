import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this project under /verde-skincare-store/. Keep the
// default root base for Cloudflare/local builds so those deployments are
// unaffected.
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGitHubPages ? '/verde-skincare-store/' : '/',
  plugins: [react(), tailwindcss(), cloudflare()],
  server: { port: 5306, strictPort: true },
})
