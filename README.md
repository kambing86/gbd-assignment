# GBD Assignment

- it's built with monorepo in mind, so backend and frontend projects are in packages
- it's managed by pnpm workspace
- using GraphQL and React

## Prerequisite

- Node.js 16.15.0
- Python 2
- pnpm

## Installing packages

```sh
pnpm install
```

## Running Server only

```sh
pnpm -r --filter=server start
```

## Running Website only

```sh
pnpm -r --filter=website start
```

## Test Accounts

- test1 / P@ssw0rd
- admin / admin

## Other commands

- `pnpm run start:dev`
- `pnpm run lint`
- `pnpm run prettier`
- `pnpm run build`
