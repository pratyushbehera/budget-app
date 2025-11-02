module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: [
    "dist",
    ".eslintrc.cjs",
    "node_modules/",
    "*.log",
    "build/",
    ".env*",
    "coverage/",
    ".nyc_output",
    "public/",
    ".vite/",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    // React specific rules
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off", // Disable prop-types since we're not using TypeScript
    "react/react-in-jsx-scope": "off", // Not needed with React 17+

    // General JavaScript rules
    "no-console": "warn",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-undef": "error",
    "prefer-const": "error",
    "no-var": "error",

    // Code style
    indent: ["error", 2],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "jsx-quotes": ["error", "prefer-double"],

    // Best practices
    eqeqeq: ["error", "always"],
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-return-assign": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-throw-literal": "error",
    "no-unmodified-loop-condition": "error",
    "no-useless-call": "error",
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "prefer-arrow-callback": "error",
    "prefer-template": "error",

    // React best practices
    "react/jsx-uses-react": "off", // Not needed with React 17+
    "react/jsx-uses-vars": "error",
    "react/no-array-index-key": "warn",
    "react/no-unused-state": "error",
    "react/prefer-stateless-function": "warn",
  },
};
