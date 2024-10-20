import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts']
    },
    watch: false,
    onConsoleLog: (_log, type) => type !== 'stderr'
  }
})
