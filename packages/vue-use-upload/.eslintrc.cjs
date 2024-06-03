module.exports = {
  root: true,
  extends: ['@mengjx/eslint-config-vue', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        printWidth: 100,
        proseWrap: 'never',
        tabWidth: 2,
        useTabs: false,
        endOfLine: 'auto',
        bracketSpacing: true,
      },
    ],
    'no-undef': 'off',
    'import/no-unresolved': 'off',
    curly: 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
}
