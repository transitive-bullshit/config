# @fisch0920/config

> Shared TypeScript, ESLint, and Prettier configs for my TS projects.

<p align="center">
  <a href="https://github.com/transitive-bullshit/config/actions/workflows/main.yml"><img alt="Build Status" src="https://github.com/transitive-bullshit/config/actions/workflows/main.yml/badge.svg" /></a>
  <a href="https://www.npmjs.com/package/@fisch0920/config"><img alt="NPM" src="https://img.shields.io/npm/v/@fisch0920/config.svg" /></a>
  <a href="https://github.com/transitive-bullshit/config/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

## Usage

### 1. Add Dependency

Install `@fisch0920/config` as a dev dependency.

### 2. Configure Prettier

Add the following line to your `package.json`:

```json
  "prettier": "@fisch0920/config/prettier",
```

### 3. Configure ESLint

Create a `eslint.config.ts` file in the root of the project:

```js
import { config } from '@fisch0920/config/eslint'

export default [...config]
```

### 4. Configure TypeScript

Create a `tsconfig.json` file in the root that extends `@fisch0920/config/tsconfig-node` or `@fisch0920/config/tsconfig-react`. You will still need to specify `includes` and any `compilerOptions` you may want to add or override.

```jsonc
{
  "extends": "@fisch0920/config/tsconfig-node",
  "include": ["src"],
  "exclude": ["**/node_modules"],
  "compilerOptions": {
    // Add or override compiler options here
  }
}
```

### 5. Add TypeScript Reset

This is just a convenient export of [`@total-typescript/ts-reset`](https://www.totaltypescript.com/ts-reset).

## License

MIT © [Travis Fischer](https://x.com/transitive_bs)
