import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'oxfmt.config': 'oxfmt.config.ts',
    'oxlint.config': 'oxlint.config.ts',
    'oxlint-plugin/index': 'oxlint-plugin/index.ts'
  },
  outDir: 'build',
  target: 'node20',
  platform: 'node',
  format: ['esm'],
  sourcemap: true,
  minify: false,
  dts: true
})
