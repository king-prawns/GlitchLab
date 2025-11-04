import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import typescriptEslint from 'typescript-eslint';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default typescriptEslint.config([
  {
    ignores: ['**/*.js']
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    }
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.resolve(__dirname, '../../config/typescript')
      }
    }
  },

  js.configs.recommended,
  {
    plugins: {
      import: importPlugin
    },
    extends: [...typescriptEslint.configs.recommended],
    rules: {
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'signature',
            'field',
            'public-static-method',
            'protected-static-method',
            'private-static-field',
            'private-decorated-field',
            'private-instance-field',
            'constructor',
            'public-method',
            'private-static-method',
            'method',
            'private-method',
            'protected-method'
          ]
        }
      ],
      'comma-dangle': 'error',
      'newline-before-return': 'error',
      'object-curly-spacing': ['error', 'never'],
      'quote-props': ['error', 'as-needed'],
      'require-await': 'error',
      'no-console': ['error'],
      'no-return-await': ['error'],
      'no-await-in-loop': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', ignoreRestSiblings: true, caughtErrors: 'none'}
      ],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/typedef': [
        'error',
        {
          arrowParameter: true,
          variableDeclarationIgnoreFunction: true,
          variableDeclaration: true
        }
      ],
      '@typescript-eslint/no-var-requires': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
          pathGroups: [
            {
              pattern: '@shared/**',
              group: 'external',
              position: 'after'
            }
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
          pathGroupsExcludedImportTypes: []
        }
      ]
    }
  }
]);
