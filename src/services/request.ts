import { getRequestInstance, type HttpRequest, initializeRequest, resetRequest } from '@lrd/dy-sec-bizlib-request';
import { DEFAULT_REQUEST_INSTANCE_NAME, defaultRequestConfig } from '@/configs/request';
import { getCurrentLocale } from '@/locales';

/** 当前微应用生命周期持有的默认请求实例。 */
export let request: HttpRequest;

/** 在微应用运行时启动后注册并缓存默认请求实例。 */
export function setupRequest(): void {
  initializeRequest({
    instances: [defaultRequestConfig],
    getLocale: getCurrentLocale,
  });
  request = getRequestInstance(DEFAULT_REQUEST_INSTANCE_NAME);
}

export { request as default };

/**
 * 清理默认请求实例，避免微应用卸载后保留旧请求配置。
 */
export function cleanupRequest(): void {
  resetRequest();
}
