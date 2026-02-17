/**
 * Currency Exchange System
 * 
 * Provides real-time currency conversion with caching and fallback rates.
 * Uses exchangerate-api.com (free tier: 1,500 requests/month)
 */

// Supported currencies
export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
] as const;

export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number]['code'];

// Cache key and expiry
const CACHE_KEY = 'currency_exchange_rates';
const CACHE_EXPIRY_KEY = 'currency_exchange_rates_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Fallback rates (approximate, updated periodically)
const FALLBACK_RATES: Record<string, Record<string, number>> = {
  INR: {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    AED: 0.044,
    CAD: 0.016,
    AUD: 0.018,
  },
  USD: {
    INR: 83.0,
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67,
    CAD: 1.35,
    AUD: 1.52,
  },
};

interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  lastUpdated: number;
}

/**
 * Fetch exchange rates from API
 */
async function fetchExchangeRates(baseCurrency: string = 'INR'): Promise<ExchangeRates | null> {
  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
  
  // If no API key, return null to use fallback
  if (!API_KEY) {
    console.warn('No exchange rate API key found. Using fallback rates.');
    return null;
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`,
      { next: { revalidate: 86400 } } // Revalidate every 24 hours
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error('Exchange rate API returned error');
    }

    return {
      base: baseCurrency,
      rates: data.conversion_rates,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
}

/**
 * Get cached exchange rates or fetch new ones
 */
export async function getExchangeRates(baseCurrency: string = 'INR'): Promise<ExchangeRates> {
  if (typeof window === 'undefined') {
    // Server-side: use fallback
    return {
      base: baseCurrency,
      rates: FALLBACK_RATES[baseCurrency] || FALLBACK_RATES.INR,
      lastUpdated: Date.now(),
    };
  }

  try {
    // Check cache
    const cached = localStorage.getItem(CACHE_KEY);
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (cached && cacheExpiry) {
      const expiryTime = parseInt(cacheExpiry, 10);
      if (Date.now() < expiryTime) {
        const data = JSON.parse(cached);
        if (data.base === baseCurrency) {
          return data;
        }
      }
    }

    // Fetch fresh rates
    const freshRates = await fetchExchangeRates(baseCurrency);

    if (freshRates) {
      // Cache the rates
      localStorage.setItem(CACHE_KEY, JSON.stringify(freshRates));
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
      return freshRates;
    }

    // Fallback to static rates
    return {
      base: baseCurrency,
      rates: FALLBACK_RATES[baseCurrency] || FALLBACK_RATES.INR,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error('Error getting exchange rates:', error);
    
    // Return fallback rates
    return {
      base: baseCurrency,
      rates: FALLBACK_RATES[baseCurrency] || FALLBACK_RATES.INR,
      lastUpdated: Date.now(),
    };
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): Promise<number> {
  if (from === to) return amount;

  const rates = await getExchangeRates(from);
  const rate = rates.rates[to];

  if (!rate) {
    console.warn(`No exchange rate found for ${from} to ${to}`);
    return amount;
  }

  return amount * rate;
}

/**
 * Format currency amount with proper symbol and locale
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'INR',
  options?: {
    showSymbol?: boolean;
    decimals?: number;
    locale?: string;
  }
): string {
  const {
    showSymbol = true,
    decimals = 2,
    locale = 'en-IN',
  } = options || {};

  const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === currency);
  const symbol = currencyInfo?.symbol || currency;

  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);

    return formatted;
  } catch (error) {
    console.error('Error formatting currency:', error);
    
    // Fallback formatting
    const formattedAmount = amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return showSymbol ? `${symbol}${formattedAmount}` : formattedAmount;
  }
}

/**
 * Format currency with conversion
 * Shows: "₹1,00,000 (≈$1,204)"
 */
export async function formatWithConversion(
  amount: number,
  originalCurrency: CurrencyCode,
  targetCurrency: CurrencyCode,
  options?: {
    showOriginal?: boolean;
    decimals?: number;
  }
): Promise<string> {
  const { showOriginal = true, decimals = 2 } = options || {};

  if (originalCurrency === targetCurrency) {
    return formatCurrency(amount, originalCurrency, { decimals });
  }

  const convertedAmount = await convertCurrency(amount, originalCurrency, targetCurrency);
  const formattedOriginal = formatCurrency(amount, originalCurrency, { decimals });
  const formattedConverted = formatCurrency(convertedAmount, targetCurrency, { decimals });

  if (showOriginal) {
    return `${formattedOriginal} (≈${formattedConverted})`;
  }

  return formattedConverted;
}

/**
 * Get currency symbol by code
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === currency);
  return currencyInfo?.symbol || currency;
}

/**
 * Clear exchange rate cache (useful for testing or force refresh)
 */
export function clearExchangeRateCache(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
  }
}

/**
 * Prefetch exchange rates (call on app init)
 */
export async function prefetchExchangeRates(): Promise<void> {
  await getExchangeRates('INR');
  await getExchangeRates('USD');
}
