module.exports = {
  root: true,
  overrides: [
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      extends: [
        "react-app",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
      parser: "@typescript-eslint/parser",
      plugins: [
        "@typescript-eslint",
        "import",
      ],
      processor: "@graphql-eslint/graphql",
      rules: {
        "no-console": ["warn"],
        "spaced-comment": [
          "error",
          "always",
          {
            markers: ["/"],
          },
        ],
        "comma-dangle": ["error", "always-multiline"],
        "no-shadow": ["warn"],
        "sort-imports": [
          "error",
          {
            ignoreDeclarationSort: true,
          },
        ],
        "import/order": [
          "error",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              "unknown",
              "parent",
              "sibling",
              "index",
              "object",
            ],
            alphabetize: {
              order: "asc",
            },
          },
        ],
        "@typescript-eslint/explicit-module-boundary-types": ["off"],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { args: "all", argsIgnorePattern: "^_" },
        ],
        "no-shadow": ["off"],
        "@typescript-eslint/no-shadow": ["warn"],
        "react-hooks/exhaustive-deps": [
          "warn",
          {
            additionalHooks: "useRecoilCallback",
          },
        ],
      },
    },
    {
      files: ["*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      plugins: ["@graphql-eslint"],
      parserOptions: {
        schema: 'schema.gql',
      },
      rules: {
        '@graphql-eslint/fields-on-correct-type': 'error',
      },
    }
  ],
};
