import { type CustomRequestConfig, normalizeError } from '@dayu-sec/bizlib-request';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const DEFAULT_REQUEST_INSTANCE_NAME = 'default-api';

export const defaultRequestConfig: CustomRequestConfig = {
  instanceName: DEFAULT_REQUEST_INSTANCE_NAME,
  baseURL: '/api/v1',
  timeout: 10000,
  interceptors: {
    request: {
      /**
       * 默认请求实例保留请求配置透传，方便业务后续按约定扩展。
       */
      onConfig: (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => config,
      /**
       * 请求阶段错误统一标准化后继续抛出。
       */
      onError: (error: unknown): Promise<never> => normalizeError(error),
    },
    response: {
      /**
       * 默认响应不做拆包，保持 SDK 和手写请求的返回一致。
       */
      onConfig: (response: AxiosResponse): AxiosResponse => response,
      /**
       * 响应阶段错误统一标准化后继续抛出。
       */
      onError: (error: unknown): Promise<never> => normalizeError(error),
    },
  },
};
