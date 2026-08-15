import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['oxfmt.config.ts', 'oxlint.config.ts'],
  outDir: 'build',
  target: 'node20',
  platform: 'node',
  format: ['esm'],
  sourcemap: true,
  minify: false,
  dts: true
})
