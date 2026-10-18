import type { Context, ESTree, Visitor } from '@oxlint/plugins'

/**
 * Decides whether two adjacent siblings must be separated by a blank line.
 * `parent` is the node that owns the sibling list.
 */
export type PaddingPredicate = (
  parent: ESTree.Node,
  previous: ESTree.Node,
  next: ESTree.Node
) => boolean

/**
 * Requires a blank line between every pair of adjacent siblings matched by
 * `needsPadding`, in module scope, nested blocks, `declare module` bodies, and
 * class bodies.
 *
 * Pairs matched by any `higherPriorityRules` predicate are skipped because that
 * rule already reports the same gap with the same fix, so every missing blank
 * line produces exactly one diagnostic.
 */
export function createPaddingVisitor(
  context: Context,
  needsPadding: PaddingPredicate,
  higherPriorityRules: readonly PaddingPredicate[] = []
): Visitor {
  function checkSiblings(parent: ESTree.Node, nodes: readonly ESTree.Node[]) {
    for (const [index, next] of nodes.entries()) {
      const previous = nodes[index - 1]

      if (
        previous &&
        needsPadding(parent, previous, next) &&
        !higherPriorityRules.some((rule) => rule(parent, previous, next))
      ) {
        requireBlankLineBetween(context, previous, next)
      }
    }
  }

  return {
    Program: (node) => checkSiblings(node, node.body),
    BlockStatement: (node) => checkSiblings(node, node.body),
    StaticBlock: (node) => checkSiblings(node, node.body),
    SwitchCase: (node) => checkSiblings(node, node.consequent),
    TSModuleBlock: (node) => checkSiblings(node, node.body),
    ClassBody: (node) => checkSiblings(node, node.body)
  }
}

/**
 * Exported declarations are wrapped in an export node; padding decisions are
 * about the declaration itself.
 */
export function unwrapExport(node: ESTree.Node): ESTree.Node {
  if (
    (node.type === 'ExportNamedDeclaration' ||
      node.type === 'ExportDefaultDeclaration') &&
    node.declaration
  ) {
    return node.declaration
  }

  return node
}

export function getLineCount(node: ESTree.Node) {
  return node.loc.end.line - node.loc.start.line + 1
}

/**
 * Reports `next` unless a blank line already separates it from `previous`.
 *
 * Comments that start on their own line belong to `next` (usually its JSDoc),
 * so the blank line is inserted above them. A trailing comment on the last line
 * of `previous` stays with `previous`. Larger gaps are never normalized.
 */
function requireBlankLineBetween(
  context: Context,
  previous: ESTree.Node,
  next: ESTree.Node
) {
  const { sourceCode } = context
  const text = sourceCode.text
  const gap = text.slice(previous.range[1], next.range[0])

  if (!gap.includes('\n') || /\n[ \t]*\r?\n/u.test(gap)) {
    return
  }

  const previousEndLine = previous.loc.end.line
  const comments = sourceCode.getCommentsBefore(next)

  // A block comment that starts after `previous` and wraps onto the next line
  // has no obvious owner, so leave that gap alone.
  if (
    comments.some(
      (comment) =>
        comment.loc.start.line === previousEndLine &&
        comment.loc.end.line > previousEndLine
    )
  ) {
    return
  }

  const anchor =
    comments.find((comment) => comment.loc.start.line > previousEndLine) ?? next

  const anchorLineStart = text.lastIndexOf('\n', anchor.range[0] - 1) + 1
  const newline = gap.includes('\r\n') ? '\r\n' : '\n'

  context.report({
    loc: next.loc,
    messageId: 'missingBlankLine',
    fix: (fixer) =>
      fixer.insertTextBeforeRange([anchorLineStart, anchorLineStart], newline)
  })
}
