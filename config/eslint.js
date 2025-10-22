import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginSecurity from 'eslint-plugin-security'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * Checks if a package is installed.
 *
 * @param {string} pkg
 * @returns {boolean}
 */
function has(pkg) {
  try {
    import.meta.resolve(pkg, import.meta.url)
    return true
  } catch {
    return false
  }
}

const hasTypeScript = has('typescript')
const hasReact = has('react')
const hasTestingLibrary = has('@testing-library/dom')
const hasJestDom = has('@testing-library/jest-dom')
const hasVitest = has('vitest')
const hasZod = has('zod')
const vitestFiles = ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*']
const testFiles = ['**/tests/**', '**/#tests/**', ...vitestFiles]
const playwrightFiles = ['**/e2e/**']
const jsSourceFiles = ['**/*.js?(x)']
const tsSourceFiles = ['**/*.ts?(x)']
const sourceFiles = [tsSourceFiles, jsSourceFiles]

/** @type {import("eslint").Linter.Config[]} */
export const config = [
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/.next/**',
      '**/.cache/**',
      '**/.vercel/**',
      '**/playwright-report/**',
      '**/server-build/**',
      '**/coverage/**'
    ]
  },

  {
    files: sourceFiles,
    ...eslint.configs.recommended
  },

  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // Security
  {
    files: sourceFiles,
    ...eslintPluginSecurity.configs.recommended
  },
  {
    files: sourceFiles,
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-object-injection': 'off'
    }
  },

  // Global rules that apply to all files
  {
    files: sourceFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
        sourceType: 'module'
      }
    },
    rules: {
      'array-callback-return': 'error',
      'getter-return': 'error',
      'new-parens': 'error',
      'no-array-constructor': 'error',
      'no-caller': 'error',
      'no-cond-assign': ['error', 'except-parens'],
      'no-console': 'off',
      'no-const-assign': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-label': 'error',
      'no-func-assign': 'error',
      'no-global-assign': 'error',
      'no-implied-eval': 'error',
      'no-invalid-regexp': 'error',
      'no-label-var': 'error',
      'no-labels': ['error', { allowLoop: true, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-mixed-operators': [
        'error',
        {
          groups: [
            ['&', '|', '^', '~', '<<', '>>', '>>>'],
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof']
          ],
          allowSamePrecedence: false
        }
      ],
      'no-new-func': 'error',
      'no-new-object': 'error',
      'no-new-wrappers': 'error',
      'no-octal': 'error',
      'no-process-env': 'error',
      'no-redeclare': 'error',
      'no-script-url': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'no-unsafe-negation': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true
        }
      ],
      'no-unused-labels': 'error',
      'no-use-before-define': [
        'error',
        { classes: false, functions: false, variables: false }
      ],
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-rename': [
        'error',
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false
        }
      ],
      'no-var': 'error',
      'no-warning-comments': [
        'error',
        { terms: ['FIXME'], location: 'anywhere' }
      ],
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'prefer-object-spread': 'error',
      'require-yield': 'error',
      'unicode-bom': ['error', 'never'],
      'use-isnan': 'error',
      'valid-typeof': 'error',
      curly: ['error', 'multi-line'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      'dot-notation': 'error',
      'no-unused-vars': [
        'error',
        {
          args: 'none',
          ignoreRestSiblings: true
        }
      ],
      'no-useless-escape': 'error',
      'no-return-await': 'error'
    }
  },

  // Import rules
  // https://github.com/import-js/eslint-plugin-import
  {
    files: sourceFiles,
    ...eslintPluginImport.flatConfigs.recommended
  },
  hasTypeScript
    ? {
        files: tsSourceFiles,
        ...eslintPluginImport.flatConfigs.typescript
      }
    : null,
  {
    files: sourceFiles,
    plugins: {
      // https://github.com/lydell/eslint-plugin-simple-import-sort
      'simple-import-sort': eslintPluginSimpleImportSort
    },
    rules: {
      'import/export': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-anonymous-default-export': 'off',
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/no-relative-packages': 'error',
      'import/no-unresolved': 'off',
      'import/order': 'off',
      'no-duplicate-imports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          // The default grouping, but with type imports first in each group.
          groups: [
            ['^\\u0000'],
            ['^node:.*\\u0000$', '^node:'],
            ['^@?\\w.*\\u0000$', '^@?\\w'],
            ['(?<=\\u0000)$', '^'],
            ['^\\..*\\u0000$', '^\\.']
          ]
        }
      ],
      'simple-import-sort/exports': 'error'
    }
  },

  // https://github.com/sindresorhus/eslint-plugin-unicorn
  {
    files: sourceFiles,
    ...eslintPluginUnicorn.configs.recommended
  },
  {
    files: sourceFiles,
    rules: {
      'unicorn/catch-error-name': [
        'error',
        {
          name: 'err'
        }
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/switch-case-braces': ['error', 'avoid'],
      'unicorn/no-zero-fractions': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prefer-switch': 'off',
      'unicorn/no-lonely-if': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/no-array-push-push': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-type-error': 'off',
      'unicorn/prefer-single-call': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-array-reduce': 'off'
    }
  },

  hasReact
    ? {
        settings: {
          react: {
            version: 'detect'
          }
        }
      }
    : null,

  // General rules for JSX/TSX files
  hasReact
    ? {
        files: ['**/*.tsx', '**/*.jsx'],
        plugins: {
          // https://github.com/jsx-eslint/eslint-plugin-react
          react: (await import('eslint-plugin-react')).default,
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
          'jsx-a11y': (await import('eslint-plugin-jsx-a11y')).default
        },
        languageOptions: {
          globals: { React: 'readonly' },
          parser: hasTypeScript ? tseslint.parser : undefined,
          parserOptions: {
            jsx: true
          }
        },
        rules: {
          'react/forbid-foreign-prop-types': [
            'error',
            { allowInPropTypes: true }
          ],
          'react/function-component-definition': [
            'error',
            {
              namedComponents: 'function-declaration',
              unnamedComponents: 'arrow-function'
            }
          ],
          'react/jsx-key': 'error',
          'react/jsx-no-comment-textnodes': 'error',
          'react/jsx-no-target-blank': 'error',
          'react/jsx-no-undef': 'error',
          'react/jsx-pascal-case': [
            'error',
            { allowAllCaps: true, ignore: [] }
          ],
          'react/jsx-uses-react': 'error',
          'react/jsx-uses-vars': 'error',
          'react/no-danger-with-children': 'error',
          'react/no-direct-mutation-state': 'error',
          'react/no-find-dom-node': 'error',
          'react/no-is-mounted': 'error',
          'react/no-render-return-value': 'error',
          'react/no-string-refs': 'error',
          'react/no-typos': 'error',
          'react/react-in-jsx-scope': 'off',
          'react/require-render-return': 'error',
          'react/style-prop-object': 'error',

          ...(await import('eslint-plugin-jsx-a11y')).default.configs
            .recommended.rules,
          'jsx-a11y/alt-text': 'off',
          'jsx-a11y/anchor-has-content': 'off',
          'jsx-a11y/anchor-is-valid': [
            'error',
            { aspects: ['noHref', 'invalidHref'] }
          ],
          'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
          'jsx-a11y/aria-props': 'error',
          'jsx-a11y/aria-proptypes': 'error',
          'jsx-a11y/aria-role': ['error', { ignoreNonDOM: true }],
          'jsx-a11y/aria-unsupported-elements': 'error',
          'jsx-a11y/iframe-has-title': 'error',
          'jsx-a11y/img-redundant-alt': 'error',
          'jsx-a11y/lang': 'error',
          'jsx-a11y/no-access-key': 'error',
          'jsx-a11y/no-autofocus': 'off',
          'jsx-a11y/no-redundant-roles': 'error',
          'jsx-a11y/role-has-required-aria-props': 'error',
          'jsx-a11y/role-supports-aria-props': 'error'
        }
      }
    : null,

  // Rules specific to React hooks
  hasReact
    ? {
        ...(await import('eslint-plugin-react-hooks')).default.configs.flat
          .recommended,
        files: sourceFiles
      }
    : null,

  // TS and TSX files
  hasTypeScript
    ? {
        files: tsSourceFiles,
        plugins: {
          // https://typescript-eslint.io
          '@typescript-eslint': tseslint.plugin
        },
        languageOptions: {
          parser: tseslint.parser,
          parserOptions: {
            projectService: true
          }
        },
        rules: {
          '@typescript-eslint/consistent-type-imports': [
            'error',
            {
              prefer: 'type-imports',
              disallowTypeAnnotations: true,
              fixStyle: 'separate-type-imports'
            }
          ],
          '@typescript-eslint/naming-convention': [
            'error',
            {
              selector: 'typeLike',
              format: ['PascalCase'],
              filter: {
                regex: '^(__String|[A-Za-z]+_[A-Za-z]+)$',
                match: false
              }
            },
            {
              selector: 'interface',
              format: ['PascalCase'],
              custom: { regex: '^I[A-Z]', match: false },
              filter: {
                regex: '^I(Arguments|TextWriter|O([A-Z][a-z]+[A-Za-z]*)?)$',
                match: false
              }
            },
            {
              selector: 'variable',
              format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
              leadingUnderscore: 'allow',
              filter: {
                regex:
                  '^(_{1,2}filename|_{1,2}dirname|_+|[A-Za-z]+_[A-Za-z]+)$',
                match: false
              }
            },
            {
              selector: 'function',
              format: ['camelCase', 'PascalCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^[A-Za-z]+_[A-Za-z]+$', match: false }
            },
            {
              selector: 'parameter',
              format: ['camelCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^(_+|[A-Za-z]+_[A-Z][a-z]+)$', match: false }
            },
            {
              selector: 'method',
              format: ['camelCase', 'PascalCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^([0-9]+|[A-Za-z]+_[A-Za-z]+)$', match: false }
            },
            {
              selector: 'memberLike',
              format: ['camelCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^([0-9]+|[A-Za-z]+_[A-Za-z]+)$', match: false }
            },
            {
              selector: 'enumMember',
              format: ['camelCase', 'PascalCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^[A-Za-z]+_[A-Za-z]+$', match: false }
            },
            { selector: 'property', format: null }
          ],
          '@typescript-eslint/no-floating-promises': [
            'error',
            { ignoreIIFE: true }
          ],
          '@typescript-eslint/no-misused-promises': [
            'error',
            { checksVoidReturn: false }
          ],
          '@typescript-eslint/no-unused-expressions': [
            'error',
            { allowTernary: true }
          ],
          '@typescript-eslint/unified-signatures': 'error',
          '@typescript-eslint/ban-ts-comment': [
            'error',
            {
              'ts-expect-error': 'allow-with-description',
              'ts-ignore': true,
              'ts-nocheck': true,
              'ts-check': false,
              // Require a description for @ts-expect-error to be 10 characters or more.
              minimumDescriptionLength: 10
            }
          ],
          'no-use-before-define': 'off',
          '@typescript-eslint/no-use-before-define': [
            'error',
            {
              classes: false,
              functions: false,
              variables: false,
              enums: false,
              typedefs: false,
              ignoreTypeReferences: true
            }
          ],

          // Disable rules from presets
          // 'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
          '@typescript-eslint/no-explicit-any': 'off',
          'import/consistent-type-specifier-style': 'off',
          '@typescript-eslint/consistent-type-definitions': 'off',
          '@typescript-eslint/no-namespace': 'off',
          '@typescript-eslint/array-type': 'off',
          '@typescript-eslint/consistent-indexed-object-style': 'off',
          'no-undef': 'off',
          'no-unused-vars': 'off',
          '@typescript-eslint/no-unused-vars': [
            'error',
            {
              // Ignore: (solely underscores | starting with exactly one underscore)
              argsIgnorePattern: '^(_+$|_[^_])',
              varsIgnorePattern: '^(_+$|_[^_])'
            }
          ],
          '@typescript-eslint/no-inferrable-types': [
            'error',
            {
              ignoreProperties: true
            }
          ],
          'no-redeclare': 'off',
          'no-empty-function': 'off',
          '@typescript-eslint/no-empty-function': 'off',
          '@typescript-eslint/class-literal-property-style': 'off',
          '@typescript-eslint/triple-slash-reference': 'off'
        }
      }
    : null,

  // This assumes test files are those which are in the test directory or have
  // *.test.* or *.spec.* in the filename. If a file doesn't match this assumption,
  // then it will not be allowed to import test files.
  {
    files: sourceFiles,
    ignores: testFiles,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: testFiles,
              message: 'Do not import test files in source files'
            }
          ]
        }
      ]
    }
  },

  {
    files: testFiles,
    rules: {
      // Disable `any` rules for tests
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  },

  hasTestingLibrary
    ? {
        files: testFiles,
        ignores: [...playwrightFiles],
        plugins: {
          'testing-library': (await import('eslint-plugin-testing-library'))
            .default
        },
        rules: {
          'testing-library/no-unnecessary-act': ['error', { isStrict: false }],
          'testing-library/no-wait-for-side-effects': 'error',
          'testing-library/prefer-find-by': 'error'
        }
      }
    : null,

  hasJestDom
    ? {
        files: testFiles,
        ignores: [...playwrightFiles],
        plugins: {
          'jest-dom': (await import('eslint-plugin-jest-dom')).default
        },
        rules: {
          'jest-dom/prefer-checked': 'error',
          'jest-dom/prefer-enabled-disabled': 'error',
          'jest-dom/prefer-focus': 'error',
          'jest-dom/prefer-required': 'error'
        }
      }
    : null,

  hasVitest
    ? {
        files: testFiles,
        ignores: [...playwrightFiles],
        plugins: {
          vitest: (await import('@vitest/eslint-plugin')).default
        },
        rules: {
          'vitest/no-focused-tests': ['error', { fixable: false }]
        }
      }
    : null,

  // Rules specific to Zod
  hasZod
    ? {
        files: sourceFiles,
        ...(await import('eslint-plugin-zod-x')).default.configs.recommended
      }
    : null,

  // Run prettier at the end
  eslintConfigPrettier
].filter(Boolean)

export default config
