module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    'airbnb',
    'prettier',
    'eslint:recommended',
    'plugin:lodash/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  plugins: ['lodash', 'react', 'react-hooks', 'prettier', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      webpack: {
        config: './tools/webpack/config.babel.js',
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ['node_modules', 'src/'],
      }
    },
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'global-require': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'function-paren-newline': 'off',
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/jsx-one-expression-per-line': 0,
    'import/no-cycle': 'off',
    'react/require-default-props': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        specialLink: ['to'],
      },
    ],
    'lodash/prefer-lodash-method': 'off',
    'lodash/prefer-lodash-typecheck': 'off',
    'lodash/import-scope': 'off',
    'lodash/prefer-noop': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        parser: "typescript",
      },
    ],
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'react/jsx-wrap-multilines': 0,
    'import/prefer-default-export': 0,
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
  },
  globals: {
    __CLIENT__: true,
    __SERVER__: true,
    __DEV__: true,
  },
};
