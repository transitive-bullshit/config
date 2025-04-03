import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginSecurity from 'eslint-plugin-security'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const ERROR = 'error'
const OFF = 'off'

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
const vitestFiles = ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*']
const testFiles = ['**/tests/**', '**/#tests/**', ...vitestFiles]
const playwrightFiles = ['**/e2e/**']

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

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // Global rules that apply to all files
  {
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
      'array-callback-return': ERROR,
      'getter-return': ERROR,
      'new-parens': ERROR,
      'no-array-constructor': ERROR,
      'no-caller': ERROR,
      'no-cond-assign': [ERROR, 'except-parens'],
      'no-console': ERROR,
      'no-const-assign': ERROR,
      'no-constant-condition': [ERROR, { checkLoops: false }],
      'no-control-regex': ERROR,
      'no-debugger': ERROR,
      'no-dupe-args': ERROR,
      'no-dupe-class-members': ERROR,
      'no-dupe-keys': ERROR,
      'no-duplicate-case': ERROR,
      'no-empty': [ERROR, { allowEmptyCatch: true }],
      'no-empty-character-class': ERROR,
      'no-empty-pattern': ERROR,
      'no-eval': ERROR,
      'no-ex-assign': ERROR,
      'no-extend-native': ERROR,
      'no-extra-bind': ERROR,
      'no-extra-boolean-cast': ERROR,
      'no-extra-label': ERROR,
      'no-func-assign': ERROR,
      'no-global-assign': ERROR,
      'no-implied-eval': ERROR,
      'no-invalid-regexp': ERROR,
      'no-label-var': ERROR,
      'no-labels': [ERROR, { allowLoop: true, allowSwitch: false }],
      'no-lone-blocks': ERROR,
      'no-loop-func': ERROR,
      'no-mixed-operators': [
        ERROR,
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
      'no-new-func': ERROR,
      'no-new-object': ERROR,
      'no-new-wrappers': ERROR,
      'no-octal': ERROR,
      'no-process-env': ERROR,
      'no-redeclare': ERROR,
      'no-script-url': ERROR,
      'no-self-assign': ERROR,
      'no-self-compare': ERROR,
      'no-sequences': ERROR,
      'no-shadow-restricted-names': ERROR,
      'no-sparse-arrays': ERROR,
      'no-template-curly-in-string': ERROR,
      'no-this-before-super': ERROR,
      'no-throw-literal': ERROR,
      'no-undef': ERROR,
      'no-undef-init': ERROR,
      'no-unexpected-multiline': ERROR,
      'no-unreachable': ERROR,
      'no-unsafe-negation': ERROR,
      'no-unused-expressions': [
        ERROR,
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true
        }
      ],
      'no-unused-labels': ERROR,
      'no-use-before-define': [
        ERROR,
        { classes: false, functions: false, variables: false }
      ],
      'no-useless-computed-key': ERROR,
      'no-useless-concat': ERROR,
      'no-useless-rename': [
        ERROR,
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false
        }
      ],
      'no-var': ERROR,
      'no-warning-comments': [
        ERROR,
        { terms: ['FIXME'], location: 'anywhere' }
      ],
      'object-shorthand': ERROR,
      'prefer-const': ERROR,
      'prefer-object-spread': ERROR,
      'require-yield': ERROR,
      'unicode-bom': [ERROR, 'never'],
      'use-isnan': ERROR,
      'valid-typeof': ERROR,
      curly: [ERROR, 'multi-line'],
      eqeqeq: [ERROR, 'always', { null: 'ignore' }],

      'dot-notation': ERROR,
      'no-unused-vars': [
        ERROR,
        {
          args: 'none',
          ignoreRestSiblings: true
        }
      ],
      'no-useless-escape': ERROR,
      'no-return-await': ERROR
    }
  },

  // Import rules
  // https://github.com/import-js/eslint-plugin-import
  eslintPluginImport.flatConfigs.recommended,
  hasTypeScript
    ? {
        files: ['**/*.tsx', '**/*.jsx'],
        ...eslintPluginImport.flatConfigs.typescript
      }
    : null,
  {
    plugins: {
      // https://github.com/lydell/eslint-plugin-simple-import-sort
      'simple-import-sort': eslintPluginSimpleImportSort
    },
    rules: {
      'import/first': ERROR,
      'import/newline-after-import': ERROR,
      'import/no-anonymous-default-export': OFF,
      'import/no-duplicates': [ERROR, { 'prefer-inline': true }],
      'import/no-relative-packages': ERROR,
      'import/no-unresolved': OFF,
      'import/order': OFF,
      'no-duplicate-imports': ERROR,
      'simple-import-sort/imports': [
        ERROR,
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
      'simple-import-sort/exports': ERROR
    }
  },

  // https://github.com/sindresorhus/eslint-plugin-unicorn
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      'unicorn/catch-error-name': [
        ERROR,
        {
          name: 'err'
        }
      ],
      'unicorn/prevent-abbreviations': OFF,
      'unicorn/switch-case-braces': [ERROR, 'avoid'],
      'unicorn/no-zero-fractions': OFF,
      'unicorn/no-await-expression-member': OFF,
      'unicorn/no-negated-condition': OFF,
      'unicorn/prefer-spread': OFF,
      'unicorn/prefer-switch': OFF,
      'unicorn/no-lonely-if': OFF,
      'unicorn/explicit-length-check': OFF,
      'unicorn/no-null': OFF,
      'unicorn/no-useless-undefined': OFF,
      'unicorn/no-nested-ternary': OFF,
      'unicorn/prefer-query-selector': OFF,
      'unicorn/no-array-callback-reference': OFF,
      'unicorn/prefer-ternary': OFF,
      'unicorn/no-array-push-push': OFF,
      'unicorn/prefer-string-raw': OFF
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
            ERROR,
            { allowInPropTypes: true }
          ],
          'react/function-component-definition': [
            ERROR,
            {
              namedComponents: 'function-declaration',
              unnamedComponents: 'arrow-function'
            }
          ],
          'react/jsx-key': ERROR,
          'react/jsx-no-comment-textnodes': ERROR,
          'react/jsx-no-target-blank': ERROR,
          'react/jsx-no-undef': ERROR,
          'react/jsx-pascal-case': [ERROR, { allowAllCaps: true, ignore: [] }],
          'react/jsx-uses-react': ERROR,
          'react/jsx-uses-vars': ERROR,
          'react/no-danger-with-children': ERROR,
          'react/no-direct-mutation-state': ERROR,
          'react/no-find-dom-node': ERROR,
          'react/no-is-mounted': ERROR,
          'react/no-render-return-value': ERROR,
          'react/no-string-refs': ERROR,
          'react/no-typos': ERROR,
          'react/react-in-jsx-scope': OFF,
          'react/require-render-return': ERROR,
          'react/style-prop-object': ERROR,

          ...(await import('eslint-plugin-jsx-a11y')).default.configs
            .recommended,
          'jsx-a11y/alt-text': OFF,
          'jsx-a11y/anchor-has-content': OFF,
          'jsx-a11y/anchor-is-valid': [
            ERROR,
            { aspects: ['noHref', 'invalidHref'] }
          ],
          'jsx-a11y/aria-activedescendant-has-tabindex': ERROR,
          'jsx-a11y/aria-props': ERROR,
          'jsx-a11y/aria-proptypes': ERROR,
          'jsx-a11y/aria-role': [ERROR, { ignoreNonDOM: true }],
          'jsx-a11y/aria-unsupported-elements': ERROR,
          'jsx-a11y/iframe-has-title': ERROR,
          'jsx-a11y/img-redundant-alt': ERROR,
          'jsx-a11y/lang': ERROR,
          'jsx-a11y/no-access-key': ERROR,
          'jsx-a11y/no-autofocus': OFF,
          'jsx-a11y/no-redundant-roles': ERROR,
          'jsx-a11y/role-has-required-aria-props': ERROR,
          'jsx-a11y/role-supports-aria-props': ERROR
        }
      }
    : null,

  // Rules specific to React hooks
  hasReact
    ? {
        ...(await import('eslint-plugin-react-hooks')).configs[
          'recommended-latest'
        ],
        files: ['**/*.ts?(x)', '**/*.js?(x)']
      }
    : null,

  // TS and TSX files
  hasTypeScript
    ? {
        files: ['**/*.ts?(x)'],
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
            ERROR,
            {
              prefer: 'type-imports',
              disallowTypeAnnotations: true,
              fixStyle: 'inline-type-imports'
            }
          ],
          '@typescript-eslint/naming-convention': [
            ERROR,
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
            ERROR,
            { ignoreIIFE: true }
          ],
          '@typescript-eslint/no-misused-promises': [
            ERROR,
            { checksVoidReturn: false }
          ],
          '@typescript-eslint/no-unused-expressions': [
            ERROR,
            { allowTernary: true }
          ],
          '@typescript-eslint/unified-signatures': ERROR,
          '@typescript-eslint/ban-ts-comment': [
            ERROR,
            {
              'ts-expect-error': 'allow-with-description',
              'ts-ignore': true,
              'ts-nocheck': true,
              'ts-check': false,
              // Require a description for @ts-expect-error to be 10 characters or more.
              minimumDescriptionLength: 10
            }
          ],
          '@typescript-eslint/no-use-before-define': [
            ERROR,
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
          // 'import/consistent-type-specifier-style': [ERROR, 'prefer-inline'],
          'import/consistent-type-specifier-style': OFF,
          '@typescript-eslint/consistent-type-definitions': OFF,
          '@typescript-eslint/no-namespace': OFF,
          '@typescript-eslint/array-type': OFF,
          '@typescript-eslint/no-unused-vars': [
            ERROR,
            {
              // Ignore: (solely underscores | starting with exactly one underscore)
              argsIgnorePattern: '^(_+$|_[^_])',
              varsIgnorePattern: '^(_+$|_[^_])'
            }
          ],
          '@typescript-eslint/no-inferrable-types': [
            ERROR,
            {
              ignoreProperties: true
            }
          ]
        }
      }
    : null,

  // This assumes test files are those which are in the test directory or have
  // *.test.* or *.spec.* in the filename. If a file doesn't match this assumption,
  // then it will not be allowed to import test files.
  {
    files: ['**/*.ts?(x)', '**/*.js?(x)'],
    ignores: testFiles,
    rules: {
      'no-restricted-imports': [
        ERROR,
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
      '@typescript-eslint/no-explicit-any': OFF,
      '@typescript-eslint/ban-ts-comment': OFF
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
          'testing-library/no-unnecessary-act': [ERROR, { isStrict: false }],
          'testing-library/no-wait-for-side-effects': ERROR,
          'testing-library/prefer-find-by': ERROR
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
          'jest-dom/prefer-checked': ERROR,
          'jest-dom/prefer-enabled-disabled': ERROR,
          'jest-dom/prefer-focus': ERROR,
          'jest-dom/prefer-required': ERROR
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
          'vitest/no-focused-tests': [ERROR, { fixable: false }]
        }
      }
    : null,

  // Security
  eslintPluginSecurity.configs.recommended,
  {
    rules: {
      'security/detect-non-literal-fs-filename': OFF,
      'security/detect-object-injection': OFF
    }
  },

  // Run prettier at the end
  eslintConfigPrettier
].filter(Boolean)

export default config
