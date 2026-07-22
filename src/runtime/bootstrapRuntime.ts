import logger from '@seed-fe/logger';
import {
  clearPermissionCache,
  configurePermission,
  type PermissionConfig,
  type PermissionResult,
} from '@seed-fe/react-permission';
import { cleanupRequest, setupRequest } from '@/services/request';
import { cleanupI18nEffects, setupI18n } from '@/locales';

export interface RuntimeApp {
  /**
   * 宿主传入的微应用名称。
   */
  name?: string;
  /**
   * 宿主注册的微应用路径前缀。
   */
  pathname?: string;
  /**
   * 当前微应用制品版本。
   */
  version?: string;
  /**
   * 宿主可扩展传入的只读运行时信息。
   */
  [key: string]: unknown;
}

export interface RuntimeProps {
  /**
   * 微应用路由基准路径。
   */
  basename?: string;
  /**
   * 宿主传入的微应用注册信息。
   */
  app?: RuntimeApp;
}

let bootstrapPromise: Promise<void> | null = null;
let currentRuntimeProps: RuntimeProps = {};

/**
 * 在开发环境打开微应用调试日志。
 */
function setupLogger() {
  if (import.meta.env.DEV) {
    logger.setLevel('TRACE', true);
  }
}

/**
 * 根据模板约定判断权限码是否允许访问。
 */
function isTemplatePermissionAllowed(code: string): boolean {
  return !code.endsWith('.denied');
}

/**
 * 按权限组件的 all/any 语义计算模板权限结果。
 */
function resolveTemplatePermission(config: PermissionConfig): PermissionResult {
  const codes = Array.isArray(config.code) ? config.code : [config.code];
  const mode = config.mode ?? 'all';

  if (mode === 'any') {
    return codes.some(isTemplatePermissionAllowed);
  }

  return codes.every(isTemplatePermissionAllowed);
}

/**
 * 注册微应用权限服务，保持模板侧权限能力可直接用于业务页。
 */
function setupPermission() {
  configurePermission({
    permissionService: (configs) => Promise.resolve(configs.map(resolveTemplatePermission)),
    permissionServiceOptions: {
      batch: { delay: 50, maxSize: 100 },
      cache: { enable: true, ttl: 300000 },
    },
  });
}

/**
 * 初始化微应用运行时能力，包括日志、权限、请求前置依赖和国际化。
 */
export async function bootstrapRuntime(props: RuntimeProps = {}): Promise<void> {
  currentRuntimeProps = props;
  setupLogger();

  bootstrapPromise ??= (async () => {
    setupPermission();
    await setupI18n();
    setupRequest();

    logger.info(`Template microapp runtime ready: ${__APP_NAME__}@${__APP_VERSION__}`);
  })();

  return bootstrapPromise;
}

/**
 * 清理微应用运行时副作用，供宿主卸载或独立运行重置时调用。
 */
export function cleanupRuntime(): void {
  cleanupRequest();
  clearPermissionCache();
  cleanupI18nEffects();
  bootstrapPromise = null;
  currentRuntimeProps = {};
}

/**
 * 返回最近一次启动时宿主传入的运行时参数。
 */
export function getRuntimeProps(): RuntimeProps {
  return currentRuntimeProps;
}
