import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logger from '@seed-fe/logger';
import { Card, DatePicker, Flex, message, Select, Space, Typography } from 'antd';
import { i18n, normalizeLocale, publishLocaleChange, SUPPORTED_LANGUAGES } from '@/locales';

const { Text } = Typography;

/**
 * 渲染微应用语言设置页，并负责将语言变化发布给宿主。
 */
function LanguageSettingHome(): React.ReactElement {
  const { t } = useTranslation('language');
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => normalizeLocale(i18n.language) ?? 'en-US');

  useEffect(() => {
    /**
     * 语言变化后同步选择器选中值。
     */
    const handler = (language: string) => {
      setCurrentLanguage(normalizeLocale(language) ?? 'en-US');
    };

    i18n.on('languageChanged', handler);

    return () => {
      i18n.off('languageChanged', handler);
    };
  }, []);

  /**
   * 切换微应用语言，并通过统一事件通知宿主和其他应用。
   */
  const handleLanguageChange = useCallback(
    async (value: string) => {
      const targetLanguage = normalizeLocale(value) ?? 'en-US';

      if (targetLanguage === i18n.language) return;

      const oldLocale = i18n.language;
      setLoading(true);

      try {
        await i18n.changeLanguage(targetLanguage);
        // 微应用语言切换成功后再发布，避免宿主拿到未完成的状态。
        publishLocaleChange(oldLocale, targetLanguage);
        messageApi.success(i18n.t('switchSuccess', { lng: targetLanguage, ns: 'language' }));
      } catch (error) {
        logger.error('[Template I18n] Language switch failed:', error);
        messageApi.error(t('switchFailed'));
      } finally {
        setLoading(false);
      }
    },
    [messageApi, t]
  );

  return (
    <Flex vertical gap={16}>
      {contextHolder}
      <Card title={t('settings')}>
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Select
            loading={loading}
            style={{ width: '100%' }}
            value={currentLanguage}
            onChange={(value) => {
              void handleLanguageChange(value);
            }}
            options={SUPPORTED_LANGUAGES.map((lang) => ({
              value: lang.code,
              label: lang.label,
            }))}
          />
          <Text type="secondary">{t('previewDate')}</Text>
          <DatePicker style={{ width: 280, maxWidth: '100%' }} />
        </Space>
      </Card>
    </Flex>
  );
}

export default LanguageSettingHome;
