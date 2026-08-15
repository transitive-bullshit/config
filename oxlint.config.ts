import { defineConfig } from 'oxlint'

export default defineConfig({
  $schema: './node_modules/oxlint/configuration_schema.json',
  plugins: ['typescript', 'unicorn', 'oxc', 'react', 'vitest'],
  env: {
    builtin: true
  },
  categories: {
    correctness: 'error'
  },
  ignorePatterns: [
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
    'array-callback-return': 'error',
    'no-array-constructor': 'error',
    'no-empty-function': 'error',
    'no-new-func': 'error',
    'no-template-curly-in-string': 'error',
    'import/export': 'error',

    // typescript rules
    'typescript/ban-ts-comment': 'error',
    'typescript/no-duplicate-enum-values': 'error',
    'typescript/no-empty-object-type': 'error',
    'typescript/no-explicit-any': 'error',
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
    'typescript/array-type': 'error',
    'typescript/ban-tslint-comment': 'error',
    'typescript/class-literal-property-style': 'error',
    'typescript/consistent-generic-constructors': 'error',
    'typescript/consistent-indexed-object-style': 'error',
    'typescript/consistent-type-assertions': 'error',
    'typescript/consistent-type-definitions': 'error',
    'typescript/no-confusing-non-null-assertion': 'error',
    'typescript/no-inferrable-types': 'error',
    'typescript/prefer-for-of': 'error',
    'typescript/prefer-function-type': 'error',

    // vitest rules
    'vitest/no-focused-tests': 'error',

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
    'unicorn/no-array-reduce': 'off'
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
