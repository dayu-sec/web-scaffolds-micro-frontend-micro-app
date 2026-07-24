/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />
/// <reference types="@dayu-sec/bizlib-shared-types/global" />

// https://cn.vite.dev/guide/env-and-mode.html#intellisense
interface ImportMetaEnv {
  readonly VITE_MOCK_ENABLED: string;
  /**
   * 应用部署前缀（可选）
   *
   * 示例：
   * - '/'      -> 部署在根路径
   * - '/app/'  -> 部署在 /app/ 子路径
   */
  readonly VITE_APP_BASE?: string;
}

declare const __APP_VERSION__: string;
declare const __APP_NAME__: string;
