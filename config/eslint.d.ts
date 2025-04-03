declare module './eslint.js' {
  import { type Linter } from 'eslint'

  // Named export
  export const config: Linter.Config[]

  // Default export
  export default config
}
