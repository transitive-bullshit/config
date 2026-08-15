# @fisch0920/config

> Shared TypeScript, Oxlint, and Oxfmt configs for my projects.

<p>
  <a href="https://github.com/transitive-bullshit/config/actions/workflows/test.yml"><img alt="Build Status" src="https://github.com/transitive-bullshit/config/actions/workflows/test.yml/badge.svg" /></a>
  <a href="https://www.npmjs.com/package/@fisch0920/config"><img alt="NPM" src="https://img.shields.io/npm/v/@fisch0920/config.svg" /></a>
  <a href="https://github.com/transitive-bullshit/config/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://oxc.rs"><img alt="Project uses oxfmt and oxlint" src="https://img.shields.io/badge/code_style-oxc-brightgreen.svg" /></a>
</p>

## Usage

### 1. Add Dependency

Install `@fisch0920/config` and the peer tools you use as dev dependencies (`oxfmt`, `oxlint`, `typescript`).

### 2. Configure Oxfmt for code formatting

Create an `oxfmt.config.ts` file in the root of the project:

```ts
export default from '@fisch0920/config/oxfmt'
```

### 3. Configure Oxlint for code linting

Create an `oxlint.config.ts` file in the root of the project:

```ts
export default from '@fisch0920/config/oxlint'
```

### 4. Configure TypeScript

Create a `tsconfig.json` file in the root that extends `@fisch0920/config/tsconfig-node` or `@fisch0920/config/tsconfig-react`. You will still need to specify `includes` and any `compilerOptions` you may want to add or override.

```jsonc
{
  "extends": "@fisch0920/config/tsconfig-node",
  "include": ["*.config.ts", "src"],
  "exclude": ["node_modules"]
}
```

### 5. Add TypeScript Reset

This is just a convenient export of [`@total-typescript/ts-reset`](https://www.totaltypescript.com/ts-reset).

```ts
// reset.d.ts
import '@fisch0920/config/ts-reset'
```

## License

MIT © [Travis Fischer](https://x.com/transitive_bs)
