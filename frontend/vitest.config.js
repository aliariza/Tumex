import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default defineConfig({
  ...viteConfig,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    environmentMatchGlobs: [['backend/**/*.test.js', 'node']]
  }
})
