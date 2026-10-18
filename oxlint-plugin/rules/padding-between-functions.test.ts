import { ruleTester } from '../rule-tester.ts'
import rule from './padding-between-functions.ts'

ruleTester.run('padding-between-functions', rule, {
  valid: [
    {
      name: 'single-line functions may stay grouped',
      code: `
export const noop = () => {}
export const identity = <T>(value: T) => value
`
    },
    {
      name: 'overload signatures stay grouped with their implementation',
      code: `
export function parse(input: string): Config
export function parse(input: Buffer): Config
export function parse(input: string | Buffer): Config {
  return JSON.parse(input.toString())
}

class Parser {
  parse(input: string): Config
  parse(input: Buffer): Config
  parse(input: string | Buffer): Config {
    return JSON.parse(input.toString())
  }
}
`
    },
    {
      name: 'non-exported multiline functions are left to padding-around-multiline-statements',
      code: `
function one() {
  return 1
}
function two() {
  return 2
}
`
    },
    {
      name: 'existing blank lines are left alone',
      code: `
function one() {
  return 1
}

function two() {
  return 2
}
`
    }
  ],

  invalid: [
    {
      name: 'exported functions and arrow-function bindings',
      code: `
export function formatName(user: User) {
  return \`\${user.firstName} \${user.lastName}\`
}
export const formatEmail = (user: User) =>
  \`\${formatName(user)} <\${user.email}>\`
export default async function main() {
  await run()
}
`,
      output: `
export function formatName(user: User) {
  return \`\${user.firstName} \${user.lastName}\`
}

export const formatEmail = (user: User) =>
  \`\${formatName(user)} <\${user.email}>\`

export default async function main() {
  await run()
}
`,
      errors: 2
    },
    {
      name: 'the blank line goes above a JSDoc comment',
      code: `
export function one() {
  return 1
} // trailing comments stay with the previous function
/**
 * Returns two.
 */
export function two() {
  return 2
}
`,
      output: `
export function one() {
  return 1
} // trailing comments stay with the previous function

/**
 * Returns two.
 */
export function two() {
  return 2
}
`,
      errors: 1
    },
    {
      name: 'class methods and arrow-function properties',
      code: `
class UserService {
  constructor(private readonly db: Db) {}
  async findById(id: string) {
    return this.db.users.findUnique({ where: { id } })
  }
  handleChange = (event: ChangeEvent) => {
    this.save(event.user)
  }
  get count() { return this.db.users.count() }
}
`,
      output: `
class UserService {
  constructor(private readonly db: Db) {}

  async findById(id: string) {
    return this.db.users.findUnique({ where: { id } })
  }

  handleChange = (event: ChangeEvent) => {
    this.save(event.user)
  }

  get count() { return this.db.users.count() }
}
`,
      errors: 3
    }
  ]
})
