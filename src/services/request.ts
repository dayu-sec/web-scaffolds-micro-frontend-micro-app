import { getRequestInstance, type HttpRequest, initializeRequest, resetRequest } from '@dayu-sec/bizlib-request';
import { API_REQUEST_INSTANCE_NAME, requestConfig } from '@/configs/request';
import { getCurrentLocale } from '@/locales';

/** 当前微应用生命周期持有的共享 API 请求实例。 */
export let apiRequest: HttpRequest;

/** 在微应用运行时启动后注册并缓存共享 API 请求实例。 */
export function setupRequest(): void {
  initializeRequest({
    instances: [requestConfig],
    getLocale: getCurrentLocale,
  });
  apiRequest = getRequestInstance(API_REQUEST_INSTANCE_NAME);
}

export { apiRequest as default };

/**
 * 清理当前微应用持有的请求实例，避免卸载后保留旧请求配置。
 */
export function cleanupRequest(): void {
  resetRequest();
}
