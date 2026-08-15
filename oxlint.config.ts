import { defineConfig } from 'oxlint'

export default defineConfig({
  $schema: './node_modules/oxlint/configuration_schema.json',
  plugins: ['typescript', 'unicorn', 'react', 'vitest'],
  env: {
    builtin: true
  },
  categories: {
    correctness: 'warn'
  },
  ignorePatterns: [
    '**/node_modules/**',
    '**/build/**',
    '**/dist/**',
    '**/.next/**',
    '**/.cache/**',
    '**/.vercel/**',
    '**/playwright-report/**',
    '**/server-build/**',
    '**/coverage/**'
  ],
  rules: {
    'no-array-constructor': 'error',
    'no-unused-expressions': 'error',
    'no-unused-vars': 'error',
    'no-empty-function': 'error',
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
    'vitest/no-focused-tests': 'error'
  },
  overrides: [
    {
      files: ['**/*.ts?(x)', '**/*.js?(x)'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  '**/tests/**',
                  '**/#tests/**',
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
      files: [
        '**/tests/**',
        '**/#tests/**',
        '**/__tests__/**/*',
        '**/*.test.*',
        '**/*.spec.*'
      ],
      rules: {
        'typescript/no-explicit-any': 'off',
        'typescript/ban-ts-comment': 'off'
      }
    }
  ]
})
