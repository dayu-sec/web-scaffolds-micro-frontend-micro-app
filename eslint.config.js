import eslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // 指定 ESLint 应该完全忽略哪些文件，不进行任何检查 (全局忽略)
  globalIgnores([
    // 构建产物
    'dist',
    'build',
    'compiler',

    // 依赖目录
    'node_modules',

    // 临时文件
    'temp',
    'tmp',
    '.cache',

    // 测试覆盖率
    'coverage',
    'fixtures',

    // Mock 数据（非业务逻辑代码）
    'mock',

    // 文档（纯 Markdown，不包含需要 lint 的代码）
    'docs',

    // Lock 文件
    'pnpm-lock.yaml',
    'package-lock.json',
    'yarn.lock',

    // 配置文件（只关注业务代码，不检查配置文件）
    '*.config.*', // vite.config.ts, eslint.config.js 等
    'tsconfig*.json', // 所有 tsconfig 文件
    'proxy.ts', // 代理配置
    'scripts/**', // 构建脚本
    '.*', // 所有点文件（.prettierrc, .editorconfig 等）

    // 系统文件
    '.DS_Store',
    '*.log',
    '*.min.js',
  ]),

  {
    files: ['**/*.{ts,tsx}'],

    // 注册 ESLint 插件，注册后才能在 `rules` 中使用插件规则
    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    // 继承配置
    extends: [
      // 1. ESLint 规则
      // ESLint 官方“推荐”核心规则集，仅捕获常见的 JavaScript 代码错误和逻辑问题
      // @see https://eslint.org/docs/latest/rules
      eslint.configs.recommended,

      // 2. TypeScript 规则
      // @see https://typescript-eslint.io/users/configs#recommended-configurations
      tseslint.configs.strictTypeChecked,

      // 3. TypeScript 代码风格规则
      // @see https://typescript-eslint.io/users/configs#stylistic
      tseslint.configs.stylisticTypeChecked,

      // 4. React Hooks 规则
      // React Hooks 官方“推荐”核心规则集，捕获常见的 React Hooks 代码错误和逻辑问题
      // @see https://react.dev/warnings/invalid-hook-call-warning
      reactHooks.configs.flat.recommended,

      // 5. React 刷新规则（适用于 Vite 开发环境）
      // 确保 React 组件的结构符合 Fast Refresh (快速刷新/热重载) 的要求
      // @see https://www.npmjs.com/package/eslint-plugin-react-refresh
      reactRefresh.configs.vite,
    ],

    // 配置 JavaScript/TypeScript 语言特性和解析方式
    languageOptions: {
      // 指定支持的 JavaScript 语法版本，决定哪些语法是合法的
      ecmaVersion: 2020,
      // 声明代码中可用的全局变量，避免 no-undef 错误
      globals: {
        // 浏览器
        ...globals.browser,
      },
      // 为解析器提供额外配置
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },

    // 自定义规则，键名是插件注册的命名空间 (用于规则前缀)
    rules: {
      // 允许在需要时进行类型转换
      '@typescript-eslint/no-unnecessary-type-conversion': 'warn',

      // 允许使用 type
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],

      // https://github.com/lydell/eslint-plugin-simple-import-sort
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            [
              // 1. Side effect imports (副作用导入，如 polyfills、plugins)
              '^\\u0000',

              // 2. Node.js builtins (Node.js 内置模块，可选)
              '^node:',

              // 3. React core (React 核心库)
              '^react',

              // 4. External packages (第三方依赖库)
              '^@?\\w',

              // 5. Internal packages (项目内部模块 - 别名路径)
              // 工具函数 (utils)
              '^@/utils',
              // Hooks
              '^@/hooks',
              // 配置 (configs)
              '^@/configs',
              // 常量 (constants)
              '^@/constants',
              // 服务 (services)
              '^@/services',
              // 组件 (components)
              '^@/views/components',

              // 6. Other internal (其他内部别名路径)
              '^@/',

              // 未匹配项
              '^',

              // 7. Relative imports (相对路径导入)
              '^\\./utils',
              '^\\./hooks',
              '^\\./configs',
              '^\\./constants',
              '^\\./services',
              '^\\./components',
              // 其他相对路径
              '^\\.\\./', // 父目录
              '^\\.', // 当前目录

              // 8. Style imports (样式文件)
              '^.+\\.s?css$',
              '^@/styles',
              '^\\./styles',
            ],
          ],
        },
      ],
    },
  },
]);
