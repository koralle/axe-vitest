import { defineWorkspace } from "vitest/config"

export default defineWorkspace([
  {
    test: {
      name: 'unit',
      include: ['tests/**/*.test.ts'],
      globals: true,
      environment: 'node',
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
      },
    }
  }
])
