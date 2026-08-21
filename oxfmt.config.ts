import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: [
    '.agent/**',
    '.agents/**',
    '.claude/**',
    '.codex/**',
    '.continue/**',
    '.cursor/**',
    '.gemini/**',
    '.opencode/**',
    '.pi/**',
    '.roo/**',
    '.windsurf/**'
  ],
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  useTabs: false,
  tabWidth: 2,
  bracketSpacing: true,
  bracketSameLine: false,
  trailingComma: 'none',
  proseWrap: 'never',
  sortPackageJson: true,
  printWidth: 80
})
