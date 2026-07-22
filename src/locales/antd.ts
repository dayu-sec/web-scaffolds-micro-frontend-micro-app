import { useSyncExternalStore } from 'react';
import type { Locale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import zhHK from 'antd/locale/zh_HK';
import { i18n } from './instance';
import { type LanguageType, normalizeLocale } from './languages';

const antdLocales: Record<LanguageType, Locale> = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
};

/**
 * 订阅 i18next 语言变化，供 useSyncExternalStore 驱动 Ant Design 语言同步。
 */
function subscribeToLanguageChange(onStoreChange: () => void): () => void {
  i18n.on('languageChanged', onStoreChange);

  return () => {
    i18n.off('languageChanged', onStoreChange);
  };
}

/**
 * 返回当前 Ant Design 可识别的语言快照。
 */
function getLanguageSnapshot(): LanguageType {
  return normalizeLocale(i18n.language) ?? 'en-US';
}

/**
 * 根据语言码获取 Ant Design 语言包，未知语言回退英语。
 */
export function getAntdLocale(language: string): Locale {
  return antdLocales[normalizeLocale(language) ?? 'en-US'];
}

/**
 * 将 Ant Design 语言包绑定到微应用 i18next 语言变化。
 */
export function useAntdLocaleSync(): Locale {
  const language = useSyncExternalStore(subscribeToLanguageChange, getLanguageSnapshot, getLanguageSnapshot);
  return antdLocales[language];
}
