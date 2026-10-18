import { defineRule, type ESTree } from '@oxlint/plugins'

import { createPaddingVisitor, getLineCount } from '../utils.ts'
import { needsMultilineStatementPadding } from './padding-around-multiline-statements.ts'
import {
  getDeclarationGroup,
  needsDeclarationGroupPadding
} from './padding-between-declaration-groups.ts'
import { needsFunctionPadding } from './padding-between-functions.ts'

const DEFAULT_MIN_LINES = 2

export default defineRule({
  meta: {
    type: 'layout',
    docs: {
      description:
        'Require blank lines around interface, type alias, class, and enum definitions that span at least `minLines` lines'
    },
    fixable: 'whitespace',
    messages: {
      missingBlankLine: 'Add a blank line around this type definition.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          minLines: { type: 'integer', minimum: 1 }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const options = context.options[0] as { minLines?: number } | undefined
    const minLines = options?.minLines ?? DEFAULT_MIN_LINES

    function isLargeTypeDefinition(node: ESTree.Node) {
      return (
        getDeclarationGroup(node) === 'type' && getLineCount(node) >= minLines
      )
    }

    return createPaddingVisitor(
      context,
      (_parent, previous, next) =>
        isLargeTypeDefinition(previous) || isLargeTypeDefinition(next),
      [
        needsMultilineStatementPadding,
        needsFunctionPadding,
        needsDeclarationGroupPadding
      ]
    )
  }
})
