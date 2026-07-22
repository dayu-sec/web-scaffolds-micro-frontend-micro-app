import Backend from 'i18next-http-backend';
import { i18nInitOptions } from './config';
import { i18n } from './instance';
import { getRuntimeSupportedLngs, resolveInitialLocale, setupLanguageEffects } from './language-effects';
import type { LanguageType } from './languages';

let cleanupLanguageEffects: (() => void) | null = null;

/**
 * 初始化微应用 i18n，并安装语言同步副作用。
 */
export async function setupI18n(initialLng?: LanguageType): Promise<void> {
  const resolved = initialLng ?? resolveInitialLocale().lng;
  const supportedLngs = await getRuntimeSupportedLngs();

  if (!i18n.isInitialized) {
    await i18n.use(Backend).init({ ...i18nInitOptions, lng: resolved, supportedLngs });
  } else if (i18n.language !== resolved) {
    await i18n.changeLanguage(resolved);
  }

  cleanupLanguageEffects?.();
  cleanupLanguageEffects = setupLanguageEffects();
}

/**
 * 清理语言同步副作用，避免微应用卸载后继续监听宿主事件。
 */
export function cleanupI18nEffects(): void {
  cleanupLanguageEffects?.();
  cleanupLanguageEffects = null;
}

/**
 * 返回微应用当前语言。
 */
export function getCurrentLocale(): string {
  return i18n.language;
}
