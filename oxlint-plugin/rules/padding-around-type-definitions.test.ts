import { ruleTester } from '../rule-tester.ts'
import rule from './padding-around-type-definitions.ts'

ruleTester.run('padding-around-type-definitions', rule, {
  valid: [
    {
      name: 'single-line type definitions may stay grouped',
      code: `
export type UserId = string
export type Email = string
export interface Empty {}
`
    },
    {
      name: 'definitions shorter than minLines may stay grouped',
      options: [{ minLines: 5 }],
      code: `
type UserId = string
interface User {
  id: UserId
}
const users: User[] = []
`
    },
    {
      name: 'existing blank lines are left alone',
      code: `
export type UserId = string

export interface User {
  id: UserId
}
`
    },
    {
      name: 'different kinds of declarations are left to padding-between-declaration-groups',
      code: `
import type { User } from './user'
export interface UserRepository {
  findById(id: string): Promise<User | undefined>
}
export const repository = createRepository()
`
    }
  ],

  invalid: [
    {
      name: 'adjacent exported interfaces, type aliases, classes, and enums',
      code: `
export interface UserRepository {
  findById(id: string): Promise<User | undefined>
  save(user: User): Promise<void>
}
export type UserEvent =
  | { type: 'created'; user: User }
  | { type: 'deleted'; userId: string }
export type UserId = string
export class InMemoryUserRepository implements UserRepository {
  readonly users = new Map<UserId, User>()
}
export enum Role {
  Admin = 'admin',
  Member = 'member'
}
`,
      output: `
export interface UserRepository {
  findById(id: string): Promise<User | undefined>
  save(user: User): Promise<void>
}

export type UserEvent =
  | { type: 'created'; user: User }
  | { type: 'deleted'; userId: string }

export type UserId = string

export class InMemoryUserRepository implements UserRepository {
  readonly users = new Map<UserId, User>()
}

export enum Role {
  Admin = 'admin',
  Member = 'member'
}
`,
      errors: 4
    },
    {
      name: 'the blank line goes above a JSDoc comment',
      code: `
export type UserId = string
/**
 * A user as stored in the database.
 */
export interface User {
  id: UserId
  email: string
}
`,
      output: `
export type UserId = string

/**
 * A user as stored in the database.
 */
export interface User {
  id: UserId
  email: string
}
`,
      errors: 1
    },
    {
      name: 'declarations inside declare module blocks',
      code: `
declare module 'express' {
  export interface Request {
    user?: User
  }
  export interface Response {
    locals: Locals
  }
}
`,
      output: `
declare module 'express' {
  export interface Request {
    user?: User
  }

  export interface Response {
    locals: Locals
  }
}
`,
      errors: 1
    }
  ]
})
