'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr' | 'ta';
type Currency = 'INR' | 'USD' | 'GBP';

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
        // Add more as needed
    },
    hi: {
        'home': 'होम',
        'dashboard': 'डैशबोर्ड',
        'settings': 'सेटिंग्स',
        'logout': 'लॉग आउट',
    },
    mr: {
        'home': 'मुख्यपृष्ठ',
        'dashboard': 'डॅशबोर्ड',
        'settings': 'सेटिंग्ज',
        'logout': 'बाहेर पडा',
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

    // Load from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('userLanguage') as Language;
        const savedCurr = localStorage.getItem('userCurrency') as Currency;

        if (savedLang) setLanguageState(savedLang);
        if (savedCurr) setCurrencyState(savedCurr);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('userLanguage', lang);
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
        // Exchange rates (approximate)
        const rates = {
            INR: 1,
            USD: 0.012, // 1 INR = 0.012 USD
            GBP: 0.0095 // 1 INR = 0.0095 GBP
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
