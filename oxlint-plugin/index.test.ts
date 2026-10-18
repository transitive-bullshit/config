// End-to-end examples: runs `oxlint --fix` with every padding rule enabled, so
// each case shows the final output users get from the shared config.
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

const oxlintBin = join(import.meta.dirname, '../node_modules/oxlint/bin/oxlint')
const tempDir = mkdtempSync(join(tmpdir(), 'oxlint-padding-'))
const configPath = join(tempDir, '.oxlintrc.json')

writeFileSync(
  configPath,
  JSON.stringify({
    jsPlugins: [
      { name: 'padding', specifier: join(import.meta.dirname, 'index.ts') }
    ],
    rules: {
      'padding/around-multiline-statements': 'error',
      'padding/around-type-definitions': 'error',
      'padding/between-declaration-groups': 'error',
      'padding/between-functions': 'error'
    }
  })
)

function byName(a: string, b: string) {
  return a.localeCompare(b)
}

function lintAndFix(code: string) {
  const filePath = join(tempDir, 'example.ts')
  writeFileSync(filePath, code)

  const lint = (args: string[]) => {
    try {
      return execFileSync(
        process.execPath,
        [oxlintBin, '-c', configPath, '--format', 'unix', ...args, filePath],
        { encoding: 'utf8' }
      )
    } catch (err) {
      return (err as { stdout: string }).stdout
    }
  }

  const ruleIds = [...lint([]).matchAll(/padding\((.+?)\)/gu)].flatMap(
    (match) => match[1] ?? []
  )

  lint(['--fix'])

  return { output: readFileSync(filePath, 'utf8'), ruleIds }
}

const examples: {
  name: string
  code: string
  output: string
  ruleIds: string[]
}[] = [
  {
    name: 'function declarations (oxc-project/oxc#19821)',
    code: `
function one() {
  return 1
}
function two() {
  return 2
}
`,
    output: `
function one() {
  return 1
}

function two() {
  return 2
}
`,
    // Reported once, by the highest-priority rule that matches.
    ruleIds: ['around-multiline-statements']
  },
  {
    name: 'classes, methods, and functions with JSDoc',
    code: `
class UserService {
  constructor(private readonly db: Db) {}
  async findById(id: string) {
    return this.db.users.findUnique({ where: { id } })
  }
}
export function one() {
  return 1
} // trailing comment stays with one()
/**
 * Returns two.
 */
export function two() {
  return 2
}
`,
    output: `
class UserService {
  constructor(private readonly db: Db) {}

  async findById(id: string) {
    return this.db.users.findUnique({ where: { id } })
  }
}

export function one() {
  return 1
} // trailing comment stays with one()

/**
 * Returns two.
 */
export function two() {
  return 2
}
`,
    ruleIds: [
      'between-declaration-groups',
      'between-functions',
      'between-functions'
    ]
  },
  {
    name: 'declaration groups: imports, variables, types, and overloads',
    code: `
import type { Config } from './config'
export const noop = () => {}
export const identity = <T>(value: T) => value
export type UserId = string
export type Email = string
export function parse(input: string): Config
export function parse(input: Buffer): Config
export function parse(input: string | Buffer): Config {
  return JSON.parse(input.toString())
}
`,
    output: `
import type { Config } from './config'

export const noop = () => {}
export const identity = <T>(value: T) => value

export type UserId = string
export type Email = string

export function parse(input: string): Config
export function parse(input: Buffer): Config
export function parse(input: string | Buffer): Config {
  return JSON.parse(input.toString())
}
`,
    ruleIds: [
      'between-declaration-groups',
      'between-declaration-groups',
      'between-declaration-groups'
    ]
  },
  {
    name: 'statements with a comment in the gap',
    code: `
async function main() {
  const user = await loadUser({
    id: '123'
  })
  // users without a profile are created lazily
  if (!user.profile) {
    await createProfile(user)
  }
}
`,
    output: `
async function main() {
  const user = await loadUser({
    id: '123'
  })

  // users without a profile are created lazily
  if (!user.profile) {
    await createProfile(user)
  }
}
`,
    ruleIds: ['around-multiline-statements']
  },
  {
    name: 'adjacent multiline type definitions',
    code: `
export interface User {
  id: string
}
export type UserEvent =
  | { type: 'created'; user: User }
  | { type: 'deleted'; userId: string }
export type UserId = string
`,
    output: `
export interface User {
  id: string
}

export type UserEvent =
  | { type: 'created'; user: User }
  | { type: 'deleted'; userId: string }

export type UserId = string
`,
    ruleIds: ['around-type-definitions', 'around-type-definitions']
  },
  {
    name: 'exported variables stay grouped',
    code: `
export const config = {
  retries: 3,
  timeout: 1000
}
export const defaults = {
  verbose: false
}
export const name = 'app'
`,
    output: `
export const config = {
  retries: 3,
  timeout: 1000
}
export const defaults = {
  verbose: false
}
export const name = 'app'
`,
    ruleIds: []
  }
]

try {
  for (const example of examples) {
    await test(example.name, () => {
      const { output, ruleIds } = lintAndFix(example.code)

      assert.equal(output, example.output)

      assert.deepEqual(
        ruleIds.toSorted(byName),
        example.ruleIds.toSorted(byName)
      )
    })
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}
