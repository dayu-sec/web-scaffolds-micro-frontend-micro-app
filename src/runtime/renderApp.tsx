import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createCache, StyleProvider } from '@ant-design/cssinjs';
import logger from '@seed-fe/logger';
import { lpad, rtrim } from '@seed-fe/slashify';
import App from '@/App';

export interface RenderAppOptions {
  /**
   * 独立运行时为 document，宿主加载时为微应用容器。
   */
  container: Document | HTMLElement;
  /**
   * 微应用路由基准路径。
   */
  basename?: string;
}

export interface AppInstance {
  /**
   * 卸载 React 根节点并释放当前实例引用。
   */
  unmount: () => void;
}

let activeInstance: AppInstance | null = null;

/**
 * 解析微应用路由基准路径，保证路径带有开头斜杠且无结尾斜杠。
 */
function resolveRouterBasename(basename?: string): string {
  return lpad(rtrim(basename ?? import.meta.env.BASE_URL));
}

/**
 * 从独立文档或宿主容器中获取微应用根挂载节点。
 */
function getRootElement(container: Document | HTMLElement): HTMLElement {
  const rootElement = container.querySelector<HTMLElement>('#root');

  if (!rootElement) {
    logger.error('Template microapp root element was not found.');
    throw new Error('Template microapp root element was not found.');
  }

  return rootElement;
}

/**
 * 渲染微应用 React 根节点，并返回可重复安全调用的卸载句柄。
 */
export function renderApp({ container, basename }: RenderAppOptions): AppInstance {
  activeInstance?.unmount();

  const rootElement = getRootElement(container);
  const root: Root = createRoot(rootElement);
  const cache = createCache();
  const appBasename = resolveRouterBasename(basename);

  let mounted = true;

  const instance: AppInstance = {
    unmount() {
      if (!mounted) return;
      root.unmount();
      mounted = false;

      if (activeInstance === instance) {
        // 只清理当前实例，避免旧实例卸载误清新实例引用。
        activeInstance = null;
      }
    },
  };

  root.render(
    <StrictMode>
      <StyleProvider cache={cache} container={rootElement} hashPriority="high">
        <App basename={appBasename} />
      </StyleProvider>
    </StrictMode>
  );

  activeInstance = instance;
  return instance;
}

/**
 * 卸载当前活跃的微应用实例。
 */
export function unmountApp(): void {
  activeInstance?.unmount();
}
