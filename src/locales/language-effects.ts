import logger from '@seed-fe/logger';
import type { LocaleChangeEventData } from '@/types/events';
import { syncDayjsLocale } from './dayjs';
import { i18n } from './instance';
import {
  getBrowserLanguage,
  getDefaultLanguage,
  LANGUAGE_CODES,
  type LanguageType,
  normalizeLocale,
} from './languages';

type Cleanup = () => void;

/**
 * 从宿主全局 i18n API 中读取当前语言。
 */
function getHostLanguage(): string | null {
  return window.dy?.i18n?.getCurrentLocale() ?? null;
}

/**
 * 解析微应用初始语言，开发态优先支持 URL 参数覆盖。
 */
export function resolveInitialLocale(): { lng: LanguageType; source: 'query' | 'host' | 'default'; raw?: string } {
  if (import.meta.env.DEV) {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get('locale') ?? url.searchParams.get('lang');
    const fromQuery = normalizeLocale(raw);

    if (fromQuery) {
      return { lng: fromQuery, source: 'query', raw: raw ?? undefined };
    }
  }

  const rawHost = getHostLanguage();
  const fromHost = normalizeLocale(rawHost);

  if (fromHost) {
    return { lng: fromHost, source: 'host', raw: rawHost ?? undefined };
  }

  return { lng: getDefaultLanguage().code, source: 'default' };
}

/**
 * 获取运行时支持的语言列表，宿主未提供时使用微应用内置语言。
 */
export async function getRuntimeSupportedLngs(): Promise<string[]> {
  const list = (await window.dy?.i18n?.getSupportedLanguages?.()) ?? [];
  const runtimeCodes = list
    .filter((item) => item.isAuto !== true)
    .map((item) => normalizeLocale(item.code))
    .filter((code): code is LanguageType => Boolean(code));

  return runtimeCodes.length > 0 ? runtimeCodes : [...LANGUAGE_CODES];
}

/**
 * 独立运行时同步 document 语言，宿主存在时不越权改宿主文档。
 */
function syncStandaloneDocumentLanguage(language: string): void {
  if (!window.dy) {
    document.documentElement.lang = language;
  }
}

/**
 * 响应微应用自身语言变化，同步文档语言和日期库语言。
 */
function handleLanguageChanged(language: string): void {
  syncStandaloneDocumentLanguage(language);
  syncDayjsLocale(language);
}

/**
 * 响应宿主语言变化事件，并同步到微应用 i18next。
 */
function handleHostLocaleChange(event: LocaleChangeEventData): void {
  const normalized = normalizeLocale(event.newLocale);

  if (normalized && normalized !== i18n.language) {
    void i18n.changeLanguage(normalized).catch((error: unknown) => {
      logger.error('[Template I18n] Failed to sync host locale:', error);
    });
  }
}

/**
 * 安装微应用语言副作用，并返回统一清理函数。
 */
export function setupLanguageEffects(): Cleanup {
  const cleanups: Cleanup[] = [];

  handleLanguageChanged(i18n.language);
  i18n.on('languageChanged', handleLanguageChanged);
  cleanups.push(() => {
    i18n.off('languageChanged', handleLanguageChanged);
  });

  const unsubscribeHostLocale = window.dy?.i18n?.onLocaleChanged?.((newLocale) => {
    handleHostLocaleChange({ newLocale, source: 'main-app' });
  });

  if (unsubscribeHostLocale) {
    cleanups.push(unsubscribeHostLocale);
  }

  // 兼容宿主只提供事件通道的场景，保持语言同步来源单一。
  window.dy?.eventChannel?.on('locale-changed', handleHostLocaleChange);
  cleanups.push(() => {
    window.dy?.eventChannel?.off('locale-changed', handleHostLocaleChange);
  });

  return () => {
    cleanups.forEach((cleanup) => {
      cleanup();
    });
  };
}

/**
 * 发布微应用语言变化到宿主全局 i18n API 和事件通道。
 */
export function publishLocaleChange(oldLocale: string, newLocale: string): void {
  window.dy?.i18n?.setCurrentLocale(newLocale);
  window.dy?.eventChannel?.emit('locale-changed', {
    oldLocale,
    newLocale,
    source: 'micro-app',
  } satisfies LocaleChangeEventData);
}

export { getBrowserLanguage };
