import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // These two come from the React Compiler's checks. The site does not
      // use the compiler, and the patterns they flag (setting state in an
      // effect that loads data, reading a ref that mirrors the latest props)
      // are ordinary React without it. Revisit if the compiler is adopted.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      // `const { node, ...rest } = props` drops `node` on purpose.
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)
