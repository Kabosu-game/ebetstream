import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import fr from './locales/fr.json';

const savedLocale = localStorage.getItem('app_language');
const locale = (savedLocale && savedLocale !== 'en') ? savedLocale : 'fr';

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
  },
});

export default i18n;

