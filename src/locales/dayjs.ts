import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-hk';
import dayjs from 'dayjs';

/**
 * 将微应用语言码同步为 Day.js 可识别的 locale。
 */
export function syncDayjsLocale(language: string): void {
  switch (language) {
    case 'zh-CN':
      dayjs.locale('zh-cn');
      break;
    case 'zh-HK':
      dayjs.locale('zh-hk');
      break;
    case 'en-US':
    default:
      dayjs.locale('en');
      break;
  }
}
