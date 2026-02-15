import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

i18n
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass i18n instance to react-i18next
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            mr: { translation: mr }
        },
        fallbackLng: 'en', // Default language
        lng: 'en', // Initial language
        interpolation: {
            escapeValue: false // React already escapes values
        },
        detection: {
            // Order of language detection
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
