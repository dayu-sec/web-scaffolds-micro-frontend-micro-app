import type { RuntimeApp } from '@/runtime/bootstrapRuntime';

export interface GarfishAppRenderInfo {
  /**
   * Garfish 标识当前生命周期是否处于挂载阶段。
   */
  isMount?: boolean;
  /**
   * Garfish 标识当前生命周期是否处于卸载阶段。
   */
  isUnmount?: boolean;
}

export interface GarfishRenderParams {
  /**
   * 宿主注册的微应用名称。
   */
  appName: string;
  /**
   * 宿主提供的微应用 DOM 容器。
   */
  dom: Document | HTMLElement;
  /**
   * 宿主为微应用分配的路由基准路径。
   */
  basename?: string;
  /**
   * Garfish 生命周期状态信息。
   */
  appRenderInfo?: GarfishAppRenderInfo;
  /**
   * 宿主透传的自定义参数。
   */
  props?: Record<string, unknown>;
  /**
   * 宿主透传的微应用注册信息。
   */
  app?: RuntimeApp;
}

export interface GarfishDestroyParams {
  /**
   * 宿主注册的微应用名称。
   */
  appName: string;
  /**
   * 宿主提供的微应用 DOM 容器。
   */
  dom: Document | HTMLElement;
  /**
   * Garfish 生命周期状态信息。
   */
  appRenderInfo?: GarfishAppRenderInfo;
  /**
   * 宿主透传的自定义参数。
   */
  props?: Record<string, unknown>;
  /**
   * 宿主透传的微应用注册信息。
   */
  app?: RuntimeApp;
}

export interface GarfishProvider {
  /**
   * Garfish 调用的微应用挂载生命周期。
   */
  render: (params: GarfishRenderParams) => Promise<void>;
  /**
   * Garfish 调用的微应用卸载生命周期。
   */
  destroy: (params?: GarfishDestroyParams) => void;
}

declare global {
  interface Window {
    /**
     * Garfish 注入的运行时标记。
     */
    __GARFISH__?: boolean;
  }

  interface GarfishExports {
    /**
     * 微应用暴露给 Garfish 的生命周期提供器。
     */
    provider: () => GarfishProvider;
  }

  /**
   * Garfish 用于收集微应用导出的全局对象。
   */
  var __GARFISH_EXPORTS__: GarfishExports | undefined;
}
