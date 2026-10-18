import { definePlugin } from '@oxlint/plugins'

import paddingAroundMultilineStatements from './rules/padding-around-multiline-statements.ts'
import paddingAroundTypeDefinitions from './rules/padding-around-type-definitions.ts'
import paddingBetweenDeclarationGroups from './rules/padding-between-declaration-groups.ts'
import paddingBetweenFunctions from './rules/padding-between-functions.ts'

export default definePlugin({
  meta: { name: 'padding' },
  rules: {
    'around-multiline-statements': paddingAroundMultilineStatements,
    'around-type-definitions': paddingAroundTypeDefinitions,
    'between-declaration-groups': paddingBetweenDeclarationGroups,
    'between-functions': paddingBetweenFunctions
  }
})
