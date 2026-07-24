import type { LanguageConfig as SharedLanguageConfig } from '@dayu-sec/bizlib-shared-types';

type SupportedLanguage = 'zh-CN' | 'en-US' | 'zh-HK';

type LanguageConfig = Omit<SharedLanguageConfig, 'code' | 'isDefault'> & {
  /**
   * 微应用支持的稳定语言码。
   */
  code: SupportedLanguage;
  /**
   * 语言在切换控件中的展示文案。
   */
  label: string;
  /**
   * 是否作为微应用默认语言。
   */
  isDefault: boolean;
};

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'zh-CN',
    label: '简体中文',
    isDefault: false,
  },
  {
    code: 'en-US',
    label: 'English',
    isDefault: true,
  },
  {
    code: 'zh-HK',
    label: '繁體中文',
    isDefault: false,
  },
];

/**
 * 获取默认语言
 */
export const getDefaultLanguage = (): LanguageConfig =>
  SUPPORTED_LANGUAGES.find((lang) => lang.isDefault) ?? SUPPORTED_LANGUAGES[0];

/**
 * 获取语言代码列表
 */
export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((lang) => lang.code);

/**
 * 语言类型
 */
export type LanguageType = SupportedLanguage;

/**
 * 规范化并收敛到受支持的语言码。
 * - 处理大小写、下划线/连字符
 * - 常见别名/前缀到就近受支持语言
 * - 无法识别返回 null，由调用方兜底到默认语言
 */
export function normalizeLocale(input: unknown): LanguageType | null {
  if (typeof input !== 'string') return null;
  const raw = input.trim();
  if (!raw) return null;

  const key = raw.replace(/_/g, '-').toLowerCase();

  // 明确映射表（左侧统一为小写连字符）
  const map: Partial<Record<string, LanguageType>> = {
    en: 'en-US',
    'en-us': 'en-US',
    'en-gb': 'en-US',
    'en-au': 'en-US',
    'en-ca': 'en-US',

    zh: 'zh-CN',
    'zh-cn': 'zh-CN',
    'zh-hans': 'zh-CN',

    'zh-hk': 'zh-HK',
    'zh-tw': 'zh-HK',
    'zh-hant': 'zh-HK',
    'zh-hant-hk': 'zh-HK',
  };

  if (map[key]) return map[key];

  // 前缀兜底
  if (key.startsWith('en')) return 'en-US';
  if (key === 'zh-hk' || key.startsWith('zh-hk')) return 'zh-HK';
  if (key.startsWith('zh')) return 'zh-CN';

  // 若本身已是受支持语言（大小写不一致的情况）
  const asIs = raw.replace(/_/g, '-') as LanguageType;
  if ((LANGUAGE_CODES as string[]).includes(asIs)) return asIs;

  return null;
}

/** 判断是否为受支持语言码 */
export function isSupportedLocale(code: unknown): code is LanguageType {
  if (typeof code !== 'string') return false;
  const normalized = code.replace(/_/g, '-');
  return (LANGUAGE_CODES as string[]).includes(normalized);
}

/**
 * 根据浏览器语言获取支持的语言代码
 * @returns 支持的语言代码
 */
export function getBrowserLanguage(): string {
  const browserLang = navigator.language;

  // 浏览器区域码只用于选择微应用内置语言，不写入宿主状态。
  let targetLang = 'en-US'; // 浏览器语言无法识别时回退到英语。

  if (browserLang.startsWith('zh')) {
    if (browserLang.includes('TW') || browserLang.includes('HK')) {
      targetLang = 'zh-HK';
    } else {
      targetLang = 'zh-CN';
    }
  } else if (browserLang.startsWith('en')) {
    targetLang = 'en-US';
  }

  return targetLang;
}
