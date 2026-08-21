import { defineConfig } from 'oxlint'

export default defineConfig({
  $schema: './node_modules/oxlint/configuration_schema.json',
  plugins: ['typescript', 'unicorn', 'oxc', 'react', 'vitest'],
  jsPlugins: ['@fisch0920/oxlint-plugin-anti-slop'],
  env: {
    builtin: true
  },
  categories: {
    correctness: 'error'
  },
  options: {
    // TODO: enable this conditionally only if `oxlint-tsgolint` is found
    typeAware: true
  },
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
    '.windsurf/**',
    '**/node_modules/**',
    '**/build/**',
    '**/dist/**',
    '**/.next/**',
    '**/.cache/**',
    '**/.vercel/**',
    '**/.pnpm-store/**',
    '**/playwright-report/**',
    '**/server-build/**',
    '**/coverage/**'
  ],
  rules: {
    // general rules
    'no-array-constructor': 'error',
    'no-new-func': 'error',
    'no-template-curly-in-string': 'error',
    'import/export': 'error',
    'no-constant-condition': 'off',

    // typescript rules
    'typescript/ban-ts-comment': 'error',
    'typescript/no-duplicate-enum-values': 'error',
    'typescript/no-empty-object-type': 'error',
    // 'typescript/no-explicit-any': 'error',
    'typescript/no-extra-non-null-assertion': 'error',
    'typescript/no-misused-new': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-non-null-asserted-optional-chain': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-this-alias': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unsafe-declaration-merging': 'error',
    'typescript/no-unsafe-function-type': 'error',
    'typescript/no-wrapper-object-types': 'error',
    'typescript/prefer-as-const': 'error',
    'typescript/prefer-namespace-keyword': 'error',
    'typescript/triple-slash-reference': 'error',
    'typescript/adjacent-overload-signatures': 'error',
    'typescript/ban-tslint-comment': 'error',
    'typescript/class-literal-property-style': 'error',
    'typescript/consistent-generic-constructors': 'error',
    'typescript/consistent-indexed-object-style': 'off',
    'typescript/consistent-type-assertions': 'error',
    // 'typescript/consistent-type-definitions': 'error',
    'typescript/no-confusing-non-null-assertion': 'error',
    'typescript/no-inferrable-types': 'error',
    'typescript/prefer-for-of': 'error',
    'typescript/prefer-function-type': 'error',

    // vitest rules
    'vitest/no-focused-tests': 'error',
    'vitest/require-to-throw-message': 'off',

    // unicorn rules
    'unicorn/catch-error-name': [
      'error',
      {
        name: 'err'
      }
    ],
    'unicorn/switch-case-braces': ['error', 'avoid'],
    'unicorn/no-zero-fractions': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/no-negated-condition': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/no-lonely-if': 'off',
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/prefer-query-selector': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/prefer-string-raw': 'off',
    'unicorn/prefer-type-error': 'off',
    'unicorn/prefer-single-call': 'off',
    'unicorn/import-style': 'off',
    'unicorn/no-array-reduce': 'off',

    // anti-slop rules
    'anti-slop/no-chained-type-assertions': 'error',
    'anti-slop/no-conditional-empty-object-spread': 'error',
    'anti-slop/no-known-value-widening': 'error',
    'anti-slop/no-module-mocking': 'error',
    'anti-slop/no-object-parameters': 'error',
    'anti-slop/no-reflect-apply': 'error',
    'anti-slop/no-reflect-get': 'error',
    'anti-slop/no-runtime-typeof': 'error',
    'anti-slop/no-shape-in-symbol-names': 'error',
    'anti-slop/no-unknown-parameters': 'error',
    'anti-slop/no-unknown-returns': 'error',
    'anti-slop/no-unknown-type-aliases': 'error',
    'anti-slop/no-unsafe-dictionary-type': 'error',
    'anti-slop/no-widen-then-assert': 'error',
    'anti-slop/require-safety-comment-for-type-assertion': 'error'
  },
  overrides: [
    {
      // source files
      files: ['**/*.ts?(x)', '**/*.js?(x)'],
      plugins: ['react'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  '**/tests/**',
                  '**/__tests__/**/*',
                  '**/*.test.*',
                  '**/*.spec.*'
                ],
                message: 'Do not import test files in source files'
              }
            ]
          }
        ]
      }
    },
    {
      // test files
      files: ['**/tests/**', '**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      rules: {
        // relax rules for test files
        'typescript/no-explicit-any': 'off',
        'typescript/ban-ts-comment': 'off'
      }
    }
  ]
})
