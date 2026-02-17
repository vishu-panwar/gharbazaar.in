'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '@/lib/i18n';

type Language = 'en' | 'hi' | 'mr' | 'ta';
type Currency = 'INR' | 'USD' | 'GBP' | 'EUR' | 'AED' | 'CAD' | 'AUD';

interface LocaleContextType {
    language: Language;
    currency: Currency;
    setLanguage: (lang: Language) => void;
    setCurrency: (curr: Currency) => void;
    t: (key: string) => string;
    formatPrice: (amount: number) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Simple translations (can be expanded)
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Common
        'home': 'Home',
        'dashboard': 'Dashboard',
        'settings': 'Settings',
        'logout': 'Logout',
        'profile': 'Profile',
        'messages': 'Messages',

        // Buyer Navigation
        'kyc_verification': 'KYC Verification',
        'browse_properties': 'Browse Properties',
        'my_proposals': 'My Proposals',
        'favorites': 'Favorites',
        'services': 'Services',
        'pricing_plans': 'Pricing Plans',

        // Seller Navigation
        'my_listings': 'My Listings',
        'offer_letters': 'Offer Letters',
        'analytics': 'Analytics',
        'inquiries': 'Inquiries',
        'contracts': 'Contracts',
        'earnings': 'Earnings',

        // Modes
        'buyer': 'Buyer',
        'seller': 'Seller',
    },
    hi: {
        // Common
        'home': 'होम',
        'dashboard': 'डैशबोर्ड',
        'settings': 'सेटिंग्स',
        'logout': 'लॉग आउट',
        'profile': 'प्रोफ़ाइल',
        'messages': 'संदेश',

        // Buyer Navigation
        'kyc_verification': 'केवाईसी सत्यापन',
        'browse_properties': 'संपत्ति ब्राउज़ करें',
        'my_proposals': 'मेरे प्रस्ताव',
        'favorites': 'पसंदीदा',
        'services': 'सेवाएं',
        'pricing_plans': 'मूल्य योजनाएं',

        // Seller Navigation
        'my_listings': 'मेरी लिस्टिंग',
        'offer_letters': 'ऑफर पत्र',
        'analytics': 'विश्लेषण',
        'inquiries': 'पूछताछ',
        'contracts': 'अनुबंध',
        'earnings': 'कमाई',

        // Modes
        'buyer': 'खरीदार',
        'seller': 'विक्रेता',
    },
    mr: {
        // Common
        'home': 'मुख्यपृष्ठ',
        'dashboard': 'डॅशबोर्ड',
        'settings': 'सेटिंग्ज',
        'logout': 'बाहेर पडा',
        'profile': 'प्रोफाइल',
        'messages': 'संदेश',

        // Buyer Navigation
        'kyc_verification': 'केवायसी सत्यापन',
        'browse_properties': 'मालमत्ता ब्राउझ करा',
        'my_proposals': 'माझे प्रस्ताव',
        'favorites': 'आवडते',
        'services': 'सेवा',
        'pricing_plans': 'किंमत योजना',

        // Seller Navigation
        'my_listings': 'माझी लिस्टिंग',
        'offer_letters': 'ऑफर पत्रे',
        'analytics': 'विश्लेषण',
        'inquiries': 'चौकशी',
        'contracts': 'करार',
        'earnings': 'कमाई',

        // Modes
        'buyer': 'खरेदीदार',
        'seller': 'विक्रेता',
    },
    ta: {
        'home': 'முகப்பு',
        'dashboard': 'டாஷ்போர்டு',
        'settings': 'அமைப்புகள்',
        'logout': 'வெளியேறு',
    }
};

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [currency, setCurrencyState] = useState<Currency>('INR');

    // Load from localStorage on mount (prioritize user_settings from SettingsContext)
    useEffect(() => {
        // Try to load from SettingsContext's localStorage first
        const userSettings = localStorage.getItem('user_settings');
        if (userSettings) {
            try {
                const settings = JSON.parse(userSettings);
                if (settings.language) {
                    setLanguageState(settings.language);
                    i18n.changeLanguage(settings.language); // Sync with i18next
                }
                if (settings.currency) {
                    setCurrencyState(settings.currency);
                }
                return; // Use settings from database
            } catch (e) {
                console.error('Failed to parse user_settings:', e);
            }
        }

        // Fallback to legacy localStorage keys
        const savedLang = localStorage.getItem('userLanguage') as Language;
        const savedCurr = localStorage.getItem('userCurrency') as Currency;

        if (savedLang) {
            setLanguageState(savedLang);
            i18n.changeLanguage(savedLang);
        }
        if (savedCurr) setCurrencyState(savedCurr);
    }, []);

    // Listen for language/currency changes from SettingsContext
    useEffect(() => {
        const handleLanguageChange = (e: CustomEvent) => {
            const newLang = e.detail as Language;
            setLanguageState(newLang);
            i18n.changeLanguage(newLang);
        };

        const handleCurrencyChange = (e: CustomEvent) => {
            const newCurr = e.detail as Currency;
            setCurrencyState(newCurr);
        };

        window.addEventListener('languageChange', handleLanguageChange as EventListener);
        window.addEventListener('currencyChange', handleCurrencyChange as EventListener);

        return () => {
            window.removeEventListener('languageChange', handleLanguageChange as EventListener);
            window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
        };
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('userLanguage', lang);
        i18n.changeLanguage(lang); // Sync with i18next
    };

    const setCurrency = (curr: Currency) => {
        setCurrencyState(curr);
        localStorage.setItem('userCurrency', curr);
    };

    // Translation function
    const t = (key: string): string => {
        return translations[language]?.[key] || key;
    };

    // Currency formatting with conversion
    const formatPrice = (amountInINR: number): string => {
        // Exchange rates (approximate, from 1 INR)
        const rates = {
            INR: 1,
            USD: 0.012,   // 1 INR ≈ $0.012
            GBP: 0.0095,  // 1 INR ≈ £0.0095
            EUR: 0.011,   // 1 INR ≈ €0.011
            AED: 0.044,   // 1 INR ≈ AED 0.044
            CAD: 0.017,   // 1 INR ≈ C$0.017
            AUD: 0.019    // 1 INR ≈ A$0.019
        };

        const convertedAmount = amountInINR * rates[currency];

        // Format based on currency
        if (currency === 'INR') {
            // Indian numbering: Lakhs and Crores
            if (amountInINR >= 10000000) {
                const crores = amountInINR / 10000000;
                return `₹${crores.toFixed(2)} Cr`;
            } else if (amountInINR >= 100000) {
                const lakhs = amountInINR / 100000;
                return `₹${lakhs.toFixed(2)} L`;
            } else {
                return `₹${amountInINR.toLocaleString('en-IN')}`;
            }
        } else if (currency === 'USD') {
            // US format: Millions
            if (convertedAmount >= 1000000) {
                const millions = convertedAmount / 1000000;
                return `$${millions.toFixed(2)}M`;
            } else if (convertedAmount >= 1000) {
                const thousands = convertedAmount / 1000;
                return `$${thousands.toFixed(2)}K`;
            } else {
                return `$${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            }
        } else if (currency === 'GBP') {
            // UK format: Millions
            if (convertedAmount >= 1000000) {
                const millions = convertedAmount / 1000000;
                return `£${millions.toFixed(2)}M`;
            } else if (convertedAmount >= 1000) {
                const thousands = convertedAmount / 1000;
                return `£${thousands.toFixed(2)}K`;
            } else {
                return `£${convertedAmount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            }
        } else if (currency === 'EUR') {
            // Euro format
            if (convertedAmount >= 1000000) {
                const millions = convertedAmount / 1000000;
                return `€${millions.toFixed(2)}M`;
            } else if (convertedAmount >= 1000) {
                const thousands = convertedAmount / 1000;
                return `€${thousands.toFixed(2)}K`;
            } else {
                return `€${convertedAmount.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            }
        } else if (currency === 'AED') {
            // AED format
            if (convertedAmount >= 1000000) {
                const millions = convertedAmount / 1000000;
                return `AED ${millions.toFixed(2)}M`;
            } else if (convertedAmount >= 1000) {
                const thousands = convertedAmount / 1000;
                return `AED ${thousands.toFixed(2)}K`;
            } else {
                return `AED ${convertedAmount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            }
        } else if (currency === 'CAD') {
            // Canadian Dollar format
            if (convertedAmount >= 1000000) {
                const millions = convertedAmount / 1000000;
                return `C$${millions.toFixed(2)}M`;
            } else if (convertedAmount >= 1000) {
                const thousands = convertedAmount / 1000;
                return `C$${thousands.toFixed(2)}K`;
            } else {
                return `C$${convertedAmount.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            }
        } else if (currency === 'AUD') {
            // Australian Dollar format
            if (convertedAmount >= 1000000) {
                const millions = convertedAmount / 1000000;
                return `A$${millions.toFixed(2)}M`;
            } else if (convertedAmount >= 1000) {
                const thousands = convertedAmount / 1000;
                return `A$${thousands.toFixed(2)}K`;
            } else {
                return `A$${convertedAmount.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            }
        }

        return `₹${amountInINR.toLocaleString('en-IN')}`;
    };

    const value: LocaleContextType = {
        language,
        currency,
        setLanguage,
        setCurrency,
        t,
        formatPrice
    };

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within LocaleProvider');
    }
    return context;
}
