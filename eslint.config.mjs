import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import compat from 'eslint-plugin-compat';
import sortClassMembers from 'eslint-plugin-sort-class-members';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'public/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  compat.configs['flat/recommended'],
  prettierRecommended,
  {
    plugins: {
      'sort-class-members': sortClassMembers,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      polyfills: [
        'Array.from',
        'Array.prototype.find',
        'Array.prototype.includes',
        'Symbol',
        'Symbol.iterator',
        'DOMTokenList',
        'Object.assign',
        'CustomEvent',
        'Element.prototype.classList',
        'Element.prototype.closest',
        'Element.prototype.dataset',
        'Element.prototype.replaceChildren',
      ],
    },
    rules: {
      'no-param-reassign': ['error', { props: false }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      'import/no-named-as-default': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-plusplus': 'off',
      'no-unused-expressions': 'off',
      'no-underscore-dangle': 'off',
      'consistent-return': 'off',
      'import/no-useless-path-segments': 'warn',
      'prefer-destructuring': ['warn', { array: false, object: true }],
      curly: ['error', 'all'],
      'newline-before-return': 'error',
      'sort-class-members/sort-class-members': [
        2,
        {
          order: [
            '[static-properties]',
            '[static-methods]',
            '[properties]',
            '[conventional-private-properties]',
            'constructor',
            '[methods]',
            '[conventional-private-methods]',
          ],
          accessorPairPositioning: 'getThenSet',
        },
      ],
      'lines-between-class-members': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-namespace': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        { js: 'never', mjs: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'no-await-in-loop': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-restricted-syntax': 'off',
      'compat/compat': 'off',
      'no-new': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
      ],
    },
  },
);
