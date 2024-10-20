import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: 'jsdom',
      include: ['tests/**/*.test.ts'],
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./scripts/setup-test.ts']
    }
  },
  {
    test: {
      name: 'browser',
      include: ['tests/**/*.browser.test.ts'],
      globals: true,
      browser: {
        enabled: true,
        provider: 'playwright',
        name: 'chromium',
        headless: true
      }
    }
  }
])
