# GBD Assignment

- it's built with monorepo in mind, so backend and frontend projects are in packages
- it's managed by yarn workspaces with lerna
- using GraphQL and React

## Prerequisite

- Node.js 12
- Python 2
- yarn

## Running Server

```sh
yarn && yarn workspace server start
```

## Running Website

```sh
yarn && yarn workspace website start
```

## Test Accounts

- test1 / P@ssw0rd
- admin / admin

## Other commands

- `lerna run lint`
- `lerna run prettier`
- `lerna run build`
