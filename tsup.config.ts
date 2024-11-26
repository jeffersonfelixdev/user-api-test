import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/shared/server/index.ts'],
  minify: true,
})
