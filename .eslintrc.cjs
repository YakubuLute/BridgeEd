module.exports = {
  root: true,
  env: {
    es2023: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  ignorePatterns: ["**/dist/**", "**/node_modules/**"],
  overrides: [
    {
      files: ["apps/web/**/*.{ts,tsx}"],
      env: {
        browser: true
      },
      plugins: ["react-hooks", "react-refresh"],
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-refresh/only-export-components": [
          "warn",
          {
            allowConstantExport: true
          }
        ]
      }
    }
  ]
};
