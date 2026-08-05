import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import path from 'path';
import { lpad, rpad } from '@seed-fe/slashify';
import { defineConfig, loadEnv } from 'vite';
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server';
import pages from 'vite-plugin-pages';
import { name as appName, version as appVersion } from './package.json';
import { getProxyConfig } from './proxy';
import { API_BASE_PATH } from './src/constants/api';

function resolveMicroAppBase(mode: string, env: Record<string, string>, appName: string): string {
  if (mode === 'production' && env.VITE_APP_BASE) {
    return lpad(rpad(env.VITE_APP_BASE, 'microapps', appName));
  }

  return lpad(rpad('microapps', appName));
}

// 配置 Vite
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  /**
   * NOTE: 单独启动微应用开发时，需要配置以下环境变量
   * 1. 请开发者在项目根目录创建 `.env.development.local` 文件
   * 2. 如需代理未命中 Mock 的请求，配置仅供 Vite 开发代理读取的 `DEV_API_URL` 变量
   * 3. 如需鉴权，再配置 `DEV_API_TOKEN` 变量
   * 4. 并在文件中添加 `DEV_SERVER_PORT=xxx` 变量
   */
  const defaultPort = 5173;
  const port = env.DEV_SERVER_PORT ? parseInt(env.DEV_SERVER_PORT, 10) : defaultPort;

  return {
    /**
     * 共享选项，适用于开发、构建和预览
     * https://cn.vite.dev/config/shared-options
     */

    // https://www.garfishjs.org/guide/demo/react.html
    // 子应用资源为绝对地址，避免由于子应用的相对资源导致资源变为主应用上的相对资源
    // 这是因为主、子应用处于同一个文档流中，相对路径是相对于主应用而言
    base: resolveMicroAppBase(mode, env, appName),

    // 定义全局常量替换方式，在开发环境下会被定义在全局，而在构建时被静态替换
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
      __APP_NAME__: JSON.stringify(appName),
    },

    // 替换 `import` 或 `require` 语句中值的别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'mock'),
      },
    },

    // 插件列表
    plugins: [
      /**
       * https://inspector.fe-dev.cn/guide/start.html
       * 必须位于 React 插件之前，才能在 JSX 转换前注入源码定位信息。
       * 按 Option/Alt + Shift + 鼠标点击 DOM 元素，即可在 IDE 中打开对应的源代码位置。
       */
      codeInspectorPlugin({
        bundler: 'vite',
        // hideConsole: true,
      }),

      // 提供 JSX/TSX 转换、Fast Refresh 热更新、自动 JSX runtime 注入这些基础能力
      react(),

      // 预置文件过滤规则 (React Compiler 依赖 Babel 插件生态，给 Rolldown 这个 Rust bundler 补上用 Babel 转换代码的能力)
      babel({ presets: [reactCompilerPreset()] }),

      /**
       * 基于文件系统自动生成路由配置
       * https://www.npmjs.com/package/vite-plugin-pages
       * + Basic Routing
       *   - `src/views/pages/users.tsx` -> `/users`
       *   - `src/views/pages/users/profile.tsx` -> `/users/profile`
       * + Index Routes
       *   - `src/views/pages/index.tsx` -> `/`
       *   - `src/views/pages/users/index.tsx` -> `/users`
       * + Dynamic Routes
       *   - `src/views/pages/users/[id].tsx` -> `/users/:id`，示例：`/users/123`
       *   - `src/views/pages/[user]/settings.tsx` -> `/:user/settings`，示例：`/123/settings`
       */
      pages({
        dirs: [{ dir: 'src/views/pages', baseRoute: '' }],
        // Garfish 集成 Vite dev 时，React.lazy 动态导入页面模块会触发运行时异常；生产构建保留异步拆包。
        importMode: mode === 'development' ? 'sync' : 'async',
      }),

      /**
       * https://www.npmjs.com/package/vite-plugin-mock-dev-server
       * 在开发环境里搭一个 mock API 服务器
       */
      mockDevServerPlugin({
        prefix: API_BASE_PATH,
      }),
    ],

    /**
     * 开发服务器选项，仅适用于开发环境
     * https://cn.vite.dev/config/server-options
     */
    server: {
      // NOTE: 仅单独启动微应用开发时有用
      proxy: getProxyConfig(env),

      port,

      // 主应用通过 fetch 加载子应用的静态资源，由于主应用与子应用的域名不一定相同，子应用需要支持跨域
      // 允许跨域
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  };
});
