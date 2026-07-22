import { useEffect, useMemo, useState } from 'react';
import { RouterProvider } from 'react-router';
import { type DySecThemeMode, getDySecAntdTheme, useDySecCssVariableScope } from '@lrd/dy-sec-bizcom-theme';
import { ConfigProvider, theme } from 'antd';
import { useAntdLocaleSync } from '@/locales';
import createRouter from './routes';
import '@/styles/operational-style-tokens.css';
import '@/styles/operational-workspace.css';

const LAYOUT_SETTINGS_CHANGE_EVENT = 'layout-settings-change';

interface AppProps {
  /**
   * 微应用在独立运行或宿主加载时使用的子路由基准路径。
   */
  basename: string;
}

/**
 * 读取宿主布局调试面板持久化的主题偏好，缺省时按 Light 渲染探索页面。
 */
function getInitialColorMode(): DySecThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const savedSettings = window.localStorage.getItem('layout-settings');
    if (!savedSettings) {
      return 'light';
    }

    const parsedSettings = JSON.parse(savedSettings) as { theme?: unknown };
    return parsedSettings.theme === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * 创建微应用路由实例，并注入全局组件主题。
 */
function App({ basename }: AppProps) {
  const router = useMemo(() => createRouter({ basename }), [basename]);
  const locale = useAntdLocaleSync();
  const { darkAlgorithm, defaultAlgorithm } = theme;
  const [colorMode, setColorMode] = useState<DySecThemeMode>(getInitialColorMode);
  const isDarkMode = colorMode === 'dark';
  const dySecAntdTheme = useMemo(() => getDySecAntdTheme(colorMode), [colorMode]);
  useDySecCssVariableScope({
    selector: '.dy-sec-microapp-theme-scope',
    theme: colorMode,
  });

  useEffect(() => {
    /**
     * 宿主调试面板切换主题时，同步刷新微应用的 Ant Design 算法和页面变量。
     */
    const syncColorMode = () => {
      setColorMode(getInitialColorMode());
    };

    window.addEventListener(LAYOUT_SETTINGS_CHANGE_EVENT, syncColorMode);
    window.addEventListener('storage', syncColorMode);
    return () => {
      window.removeEventListener(LAYOUT_SETTINGS_CHANGE_EVENT, syncColorMode);
      window.removeEventListener('storage', syncColorMode);
    };
  }, []);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        ...dySecAntdTheme,
        components: {
          ...dySecAntdTheme.components,
          Card: {
            bodyPadding: 12,
            colorBgContainer: dySecAntdTheme.token.colorBgContainer,
            colorBorderSecondary: dySecAntdTheme.token.colorBorder,
            headerPadding: 12,
          },
          Drawer: {
            colorBgElevated: dySecAntdTheme.token.colorBgElevated,
          },
          Table: {
            borderColor: dySecAntdTheme.token.colorBorder,
            cellPaddingBlockSM: 4,
            colorBgContainer: dySecAntdTheme.token.colorBgContainer,
          },
          Collapse: {
            headerBg: dySecAntdTheme.token.colorBgContainer,
          },
        },
      }}
    >
      <div className="dy-sec-microapp-theme-scope" data-theme={colorMode}>
        <RouterProvider router={router} />
      </div>
    </ConfigProvider>
  );
}

export default App;
