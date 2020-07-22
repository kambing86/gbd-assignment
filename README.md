# GBD Assignment

- it's built with monorepo in mind, so backend and frontend projects are in packages
- it's managed by yarn workspaces with lerna

## Running Website

```sh
yarn workspace website start
```

## Running Server

```sh
yarn workspace server start
```

## Other commands

- `lerna run lint`
- `lerna run prettier`
- `lerna run build`
