import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  { // Your existing main configuration
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020, // or 'latest'
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      // react-hooks plugin will be specified in its own config object below
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules, // Keep existing JS rules
      // Remove ...reactHooks.configs.recommended.rules from here
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // Keep existing
      'react-refresh/only-export-components': [ // Keep existing
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Add the recommended-latest config object from eslint-plugin-react-hooks
  reactHooks.configs['recommended-latest']
];
