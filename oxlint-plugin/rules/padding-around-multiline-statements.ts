// Adapted from https://github.com/zoonk/zoonk/blob/main/packages/oxlint-plugin/rules/padding-around-multiline-statements.js
// Unlike the original, commented gaps are fixed too (see `createPaddingVisitor`).
import { defineRule, type ESTree } from '@oxlint/plugins'

import { createPaddingVisitor, getLineCount } from '../utils.ts'

const MODULE_BOUNDARY_STATEMENTS = new Set([
  'ExportAllDeclaration',
  'ExportDefaultDeclaration',
  'ExportNamedDeclaration',
  'ImportDeclaration',
  'TSExportAssignment',
  'TSImportEqualsDeclaration',
  'TSNamespaceExportDeclaration'
])

/**
 * Module imports and exports already have dedicated formatting in oxfmt, so this
 * rule should stay focused on local statement flow inside executable code.
 */
function isModuleBoundaryStatement(statement: ESTree.Node) {
  return MODULE_BOUNDARY_STATEMENTS.has(statement.type)
}

/**
 * Multiline statements carry enough visual weight that adjacent statements need
 * a blank line to make each step in the block scannable. Class members are not
 * statements and are left to `padding-between-functions`.
 */
export function needsMultilineStatementPadding(
  parent: ESTree.Node,
  previous: ESTree.Node,
  next: ESTree.Node
) {
  return (
    parent.type !== 'ClassBody' &&
    !isModuleBoundaryStatement(previous) &&
    !isModuleBoundaryStatement(next) &&
    (getLineCount(previous) > 1 || getLineCount(next) > 1)
  )
}

export default defineRule({
  meta: {
    type: 'layout',
    docs: {
      description:
        'Require blank lines around multiline statements while leaving imports and exports untouched'
    },
    fixable: 'whitespace',
    messages: {
      missingBlankLine: 'Add a blank line around this multiline statement.'
    },
    schema: []
  },

  create(context) {
    return createPaddingVisitor(context, needsMultilineStatementPadding)
  }
})
