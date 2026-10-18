import { ruleTester } from '../rule-tester.ts'
import rule from './padding-around-multiline-statements.ts'

ruleTester.run('padding-around-multiline-statements', rule, {
  valid: [
    {
      name: 'single-line statements may stay grouped',
      code: `
const id = getId()
const user = await loadUser(id)
log(user)
`
    },
    {
      name: 'existing blank lines are left alone',
      code: `
const user = await db.users.findUnique({
  where: { id }
})

if (!user) {
  throw new Error('not found')
}
`
    },
    {
      name: 'imports and exports are left to oxfmt',
      code: `
import { db } from './db'
export const config = {
  retries: 3
}
export const timeout = 1000
`
    },
    {
      name: 'class members are left to padding-between-functions',
      code: `
class UserService {
  constructor(private readonly db: Db) {}
  async findById(id: string) {
    return this.db.users.findUnique({ where: { id } })
  }
}
`
    }
  ],

  invalid: [
    {
      name: 'statements inside a function body',
      code: `
async function syncUser(userId: string) {
  const user = await db.users.findUnique({
    where: { id: userId }
  })
  if (!user) {
    throw new Error(\`User \${userId} not found\`)
  }
  const profile = await fetchProfile(user.email)
  await db.users.update({
    where: { id: userId },
    data: { profile }
  })
  return profile
}
`,
      output: `
async function syncUser(userId: string) {
  const user = await db.users.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error(\`User \${userId} not found\`)
  }

  const profile = await fetchProfile(user.email)

  await db.users.update({
    where: { id: userId },
    data: { profile }
  })

  return profile
}
`,
      errors: 4
    },
    {
      name: 'statements inside a switch case',
      code: `
switch (event.type) {
  case 'created':
    log('created')
    await notify({
      channel: 'users',
      user: event.user
    })
    break
}
`,
      output: `
switch (event.type) {
  case 'created':
    log('created')

    await notify({
      channel: 'users',
      user: event.user
    })

    break
}
`,
      errors: 2
    },
    {
      name: 'the blank line goes above a comment that starts on its own line',
      code: `
const user = await loadUser({
  id: '123'
})
// users without a profile are created lazily
if (!user.profile) {
  await createProfile(user)
}
`,
      output: `
const user = await loadUser({
  id: '123'
})

// users without a profile are created lazily
if (!user.profile) {
  await createProfile(user)
}
`,
      errors: 1
    }
  ]
})
