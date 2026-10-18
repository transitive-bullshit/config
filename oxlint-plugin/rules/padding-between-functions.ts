import { defineRule, type ESTree } from '@oxlint/plugins'

import { createPaddingVisitor, getLineCount, unwrapExport } from '../utils.ts'
import { needsMultilineStatementPadding } from './padding-around-multiline-statements.ts'

function isFunctionExpression(node: ESTree.Node | null | undefined) {
  return (
    node?.type === 'ArrowFunctionExpression' ||
    node?.type === 'FunctionExpression'
  )
}

/**
 * Function definitions include declarations, overload signatures, `const fn =
 * () => {}` bindings, class methods, and arrow-function class properties.
 */
function isFunctionDefinition(node: ESTree.Node) {
  switch (node.type) {
    case 'FunctionDeclaration':
    case 'TSDeclareFunction':
    case 'MethodDefinition':
    case 'TSAbstractMethodDefinition':
      return true

    case 'VariableDeclaration':
      return (
        node.declarations.length === 1 &&
        isFunctionExpression(node.declarations[0]?.init)
      )

    case 'PropertyDefinition':
      return isFunctionExpression(node.value)

    default:
      return false
  }
}

/**
 * Overload signatures have no body and must stay grouped with the signatures
 * and implementation that follow them.
 */
function isOverloadSignature(node: ESTree.Node) {
  if (node.type === 'TSDeclareFunction') {
    return true
  }

  return (
    (node.type === 'MethodDefinition' ||
      node.type === 'TSAbstractMethodDefinition') &&
    node.value.type === 'TSEmptyBodyFunctionExpression'
  )
}

function getFunctionName(node: ESTree.Node) {
  switch (node.type) {
    case 'FunctionDeclaration':
    case 'TSDeclareFunction':
      return node.id?.name

    case 'MethodDefinition':
    case 'TSAbstractMethodDefinition': {
      const prefix = node.static ? 'static ' : ''

      if (node.key.type === 'Identifier') {
        return `${prefix}${node.key.name}`
      }

      if (node.key.type === 'PrivateIdentifier') {
        return `${prefix}#${node.key.name}`
      }

      return undefined
    }

    default:
      return undefined
  }
}

function isOverloadPair(previous: ESTree.Node, next: ESTree.Node) {
  const name = getFunctionName(previous)

  return (
    isOverloadSignature(previous) &&
    name !== undefined &&
    name === getFunctionName(next)
  )
}

export function needsFunctionPadding(
  _parent: ESTree.Node,
  previousNode: ESTree.Node,
  nextNode: ESTree.Node
) {
  const previous = unwrapExport(previousNode)
  const next = unwrapExport(nextNode)

  return (
    isFunctionDefinition(previous) &&
    isFunctionDefinition(next) &&
    (getLineCount(previous) > 1 || getLineCount(next) > 1) &&
    !isOverloadPair(previous, next)
  )
}

export default defineRule({
  meta: {
    type: 'layout',
    docs: {
      description:
        'Require a blank line between adjacent function definitions when either one spans multiple lines'
    },
    fixable: 'whitespace',
    messages: {
      missingBlankLine: 'Add a blank line between function definitions.'
    },
    schema: []
  },

  create(context) {
    return createPaddingVisitor(context, needsFunctionPadding, [
      needsMultilineStatementPadding
    ])
  }
})
