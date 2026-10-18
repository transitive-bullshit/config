import { defineRule, type ESTree } from '@oxlint/plugins'

import { createPaddingVisitor, unwrapExport } from '../utils.ts'
import { needsMultilineStatementPadding } from './padding-around-multiline-statements.ts'
import { needsFunctionPadding } from './padding-between-functions.ts'

export type DeclarationGroup = 'import' | 'variable' | 'type' | 'function'

/**
 * Groups declarations by what they declare, whether or not they are exported.
 * `const fn = () => {}` is a variable here; overload signatures are functions,
 * so they stay grouped with their implementation. Other statements have no
 * group and are never padded by this rule.
 */
export function getDeclarationGroup(
  node: ESTree.Node
): DeclarationGroup | undefined {
  switch (unwrapExport(node).type) {
    case 'ImportDeclaration':
    case 'TSImportEqualsDeclaration':
      return 'import'

    case 'VariableDeclaration':
      return 'variable'

    case 'ClassDeclaration':
    case 'TSEnumDeclaration':
    case 'TSInterfaceDeclaration':
    case 'TSTypeAliasDeclaration':
      return 'type'

    case 'FunctionDeclaration':
    case 'TSDeclareFunction':
      return 'function'

    default:
      return undefined
  }
}

export function needsDeclarationGroupPadding(
  _parent: ESTree.Node,
  previous: ESTree.Node,
  next: ESTree.Node
) {
  const previousGroup = getDeclarationGroup(previous)
  const nextGroup = getDeclarationGroup(next)

  return (
    previousGroup !== undefined &&
    nextGroup !== undefined &&
    previousGroup !== nextGroup
  )
}

export default defineRule({
  meta: {
    type: 'layout',
    docs: {
      description:
        'Require a blank line between groups of imports, variables, types, and functions'
    },
    fixable: 'whitespace',
    messages: {
      missingBlankLine:
        'Add a blank line between different kinds of declarations.'
    },
    schema: []
  },

  create(context) {
    return createPaddingVisitor(context, needsDeclarationGroupPadding, [
      needsMultilineStatementPadding,
      needsFunctionPadding
    ])
  }
})
