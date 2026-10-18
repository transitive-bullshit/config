import { ruleTester } from '../rule-tester.ts'
import rule from './padding-between-declaration-groups.ts'

ruleTester.run('padding-between-declaration-groups', rule, {
  valid: [
    {
      name: 'declarations of the same kind may stay grouped',
      code: `
import { a } from './a'
import { b } from './b'

export const config = { retries: 3 }
export const name = 'app'

export type UserId = string
export type Email = string
`
    },
    {
      name: 'statements that are not declarations have no group',
      code: `
const user = loadUser()
log(user)
export { user }
`
    }
  ],

  invalid: [
    {
      name: 'variables, types, and overloaded functions form separate groups',
      code: `
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
      errors: 2
    },
    {
      name: 'imports are a group too',
      code: `
import { readFile } from 'node:fs/promises'
const encoding = 'utf8'
`,
      output: `
import { readFile } from 'node:fs/promises'

const encoding = 'utf8'
`,
      errors: 1
    }
  ]
})
