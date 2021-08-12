const fs = require("fs");

const schemaString = fs.readFileSync(__dirname + "/schema.gql").toString();

module.exports = {
  extends: [
    "react-app",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "graphql"],
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
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "useRecoilCallback",
      },
    ],
    "graphql/template-strings": [
      "error",
      {
        env: "apollo",
        schemaString,
      },
    ],
  },
};
