import logger from '@seed-fe/logger';
import type { InitOptions } from 'i18next';
import { LANGUAGE_CODES } from './languages';

export const I18N_NAMESPACES = ['home', 'language'] as const;

export const i18nInitOptions: InitOptions = {
  fallbackLng: 'en-US',
  saveMissing: import.meta.env.DEV,
  ns: [...I18N_NAMESPACES],
  defaultNS: 'home',
  supportedLngs: LANGUAGE_CODES,
  load: 'currentOnly',
  backend: {
    loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
  },
  /**
   * 开发环境提示缺失翻译键，避免生产环境产生噪声日志。
   */
  missingKeyHandler: (_languages, _namespace, translationKey) => {
    if (!import.meta.env.DEV || translationKey === '404') return;
    logger.warn(`[Template I18n] Missing translation key '${translationKey}'.`);
  },
};
