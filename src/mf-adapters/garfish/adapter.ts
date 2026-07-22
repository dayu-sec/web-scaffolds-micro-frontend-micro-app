import logger from '@seed-fe/logger';
import { bootstrapRuntime, cleanupRuntime, type RuntimeProps } from '@/runtime/bootstrapRuntime';
import { type AppInstance, renderApp } from '@/runtime/renderApp';
import type { GarfishDestroyParams, GarfishProvider, GarfishRenderParams } from './types';

let appInstance: AppInstance | null = null;

/**
 * 从 Garfish render/destroy 参数中收敛微应用运行时启动参数。
 */
function resolveRuntimeProps(params?: GarfishRenderParams | GarfishDestroyParams): RuntimeProps {
  return {
    basename: params && 'basename' in params ? params.basename : undefined,
    app: params?.app ?? {
      name: params?.appName,
      ...params?.props,
    },
  };
}

/**
 * 向 Garfish 暴露微应用标准生命周期。
 */
export function provider(): GarfishProvider {
  return {
    async render(params) {
      await bootstrapRuntime(resolveRuntimeProps(params));
      appInstance = renderApp({ container: params.dom, basename: params.basename });
    },
    destroy(params) {
      appInstance?.unmount();
      appInstance = null;
      cleanupRuntime();
      logger.info(`Template microapp runtime destroyed: ${params?.appName ?? __APP_NAME__}`);
    },
  };
}

/**
 * 在无宿主加载时独立启动微应用，便于本地开发和单应用预览。
 */
async function startStandaloneApp() {
  await bootstrapRuntime({ app: { name: __APP_NAME__, version: __APP_VERSION__ } });
  appInstance = renderApp({ container: document });
}

if (window.__GARFISH__ && typeof __GARFISH_EXPORTS__ !== 'undefined') {
  // 宿主加载时只注册 provider，实际渲染由 Garfish 生命周期触发。
  __GARFISH_EXPORTS__.provider = provider;
  logger.info(`Template microapp loaded by host: ${__APP_NAME__}@${__APP_VERSION__}`);
} else {
  void startStandaloneApp().catch((error: unknown) => {
    logger.error('Template microapp standalone startup failed:', error);
    throw error;
  });
}
