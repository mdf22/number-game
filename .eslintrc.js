module.exports = {
  ignorePatterns: ['.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json'
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],

  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/await-thenable': 'warn',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-types': 'off',
    'brace-style': 'off',
    '@typescript-eslint/brace-style': ['warn', '1tbs'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off', // should probably be on
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'indent': 'off',
    '@typescript-eslint/indent': ['warn', 'tab', {'SwitchCase': 1}],
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-extra-parens': 'off',
    '@typescript-eslint/no-extra-parens': 'off',
    '@typescript-eslint/no-extraneous-class': 'warn',
    '@typescript-eslint/no-for-in-array': 'warn',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unnecessary-qualifier': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/no-useless-constructor': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-this-alias': [
      'warn',
      {
        allowDestructuring: true,
        allowedNames: ['that']
      }
    ],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': 'off',
    '@typescript-eslint/prefer-readonly': 'warn',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/require-array-sort-compare': 'warn',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/unbound-method': 'warn',
    "quotes": [2, "single", { "avoidEscape": true }],
    "@typescript-eslint/quotes": ["error", "single", { "avoidEscape": true }]
  }
};
