import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Static mock exchange rates (relative to USD = 1). For demo purposes only.
// Real production app would fetch from an FX API like exchangerate.host or openexchangerates.org.
export const CURRENCIES = [
  { code: 'USD', symbol: '$',     name: 'US Dollar',           rate: 1,        flag: '🇺🇸' },
  { code: 'EUR', symbol: '€',     name: 'Euro',                rate: 0.92,     flag: '🇪🇺' },
  { code: 'GBP', symbol: '£',     name: 'British Pound',       rate: 0.79,     flag: '🇬🇧' },
  { code: 'INR', symbol: '₹',     name: 'Indian Rupee',        rate: 83.2,     flag: '🇮🇳' },
  { code: 'JPY', symbol: '¥',     name: 'Japanese Yen',        rate: 149.5,    flag: '🇯🇵' },
  { code: 'AUD', symbol: 'A$',    name: 'Australian Dollar',   rate: 1.52,     flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$',    name: 'Canadian Dollar',     rate: 1.36,     flag: '🇨🇦' },
  { code: 'CHF', symbol: 'CHF ',  name: 'Swiss Franc',         rate: 0.88,     flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥',     name: 'Chinese Yuan',        rate: 7.24,     flag: '🇨🇳' },
  { code: 'AED', symbol: 'AED ',  name: 'UAE Dirham',          rate: 3.67,     flag: '🇦🇪' },
  { code: 'SGD', symbol: 'S$',    name: 'Singapore Dollar',    rate: 1.34,     flag: '🇸🇬' },
  { code: 'HKD', symbol: 'HK$',   name: 'Hong Kong Dollar',    rate: 7.82,     flag: '🇭🇰' },
  { code: 'SAR', symbol: 'SR ',   name: 'Saudi Riyal',         rate: 3.75,     flag: '🇸🇦' },
  { code: 'NZD', symbol: 'NZ$',   name: 'New Zealand Dollar',  rate: 1.65,     flag: '🇳🇿' },
  { code: 'KRW', symbol: '₩',     name: 'South Korean Won',    rate: 1340,     flag: '🇰🇷' },
  { code: 'THB', symbol: '฿',     name: 'Thai Baht',           rate: 35.8,     flag: '🇹🇭' },
  { code: 'MYR', symbol: 'RM ',   name: 'Malaysian Ringgit',   rate: 4.72,     flag: '🇲🇾' },
  { code: 'IDR', symbol: 'Rp ',   name: 'Indonesian Rupiah',   rate: 15700,    flag: '🇮🇩' },
  { code: 'PHP', symbol: '₱',     name: 'Philippine Peso',     rate: 56.3,     flag: '🇵🇭' },
  { code: 'VND', symbol: '₫',     name: 'Vietnamese Dong',     rate: 24500,    flag: '🇻🇳' },
  { code: 'BRL', symbol: 'R$',    name: 'Brazilian Real',      rate: 5.05,     flag: '🇧🇷' },
  { code: 'MXN', symbol: 'MX$',   name: 'Mexican Peso',        rate: 17.2,     flag: '🇲🇽' },
  { code: 'ARS', symbol: 'AR$',   name: 'Argentine Peso',      rate: 990,      flag: '🇦🇷' },
  { code: 'CLP', symbol: 'CL$',   name: 'Chilean Peso',        rate: 945,      flag: '🇨🇱' },
  { code: 'ZAR', symbol: 'R ',    name: 'South African Rand',  rate: 18.7,     flag: '🇿🇦' },
  { code: 'EGP', symbol: 'E£ ',   name: 'Egyptian Pound',      rate: 47.8,     flag: '🇪🇬' },
  { code: 'NGN', symbol: '₦',     name: 'Nigerian Naira',      rate: 1530,     flag: '🇳🇬' },
  { code: 'TRY', symbol: '₺',     name: 'Turkish Lira',        rate: 32.4,     flag: '🇹🇷' },
  { code: 'RUB', symbol: '₽',     name: 'Russian Ruble',       rate: 92.5,     flag: '🇷🇺' },
  { code: 'ILS', symbol: '₪',     name: 'Israeli Shekel',      rate: 3.72,     flag: '🇮🇱' },
  { code: 'PLN', symbol: 'zł ',   name: 'Polish Zloty',        rate: 4.02,     flag: '🇵🇱' },
  { code: 'SEK', symbol: 'kr ',   name: 'Swedish Krona',       rate: 10.6,     flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr ',   name: 'Norwegian Krone',     rate: 10.8,     flag: '🇳🇴' },
  { code: 'DKK', symbol: 'kr ',   name: 'Danish Krone',        rate: 6.88,     flag: '🇩🇰' },
  { code: 'CZK', symbol: 'Kč ',   name: 'Czech Koruna',        rate: 23.1,     flag: '🇨🇿' },
  { code: 'HUF', symbol: 'Ft ',   name: 'Hungarian Forint',    rate: 360,      flag: '🇭🇺' },
  { code: 'RON', symbol: 'lei ',  name: 'Romanian Leu',        rate: 4.56,     flag: '🇷🇴' },
  { code: 'NPR', symbol: 'Rs ',   name: 'Nepalese Rupee',      rate: 132.8,    flag: '🇳🇵' },
  { code: 'LKR', symbol: 'Rs ',   name: 'Sri Lankan Rupee',    rate: 305,      flag: '🇱🇰' },
  { code: 'PKR', symbol: 'Rs ',   name: 'Pakistani Rupee',     rate: 278,      flag: '🇵🇰' },
  { code: 'BDT', symbol: '৳ ',    name: 'Bangladeshi Taka',    rate: 110,      flag: '🇧🇩' },
  { code: 'QAR', symbol: 'QR ',   name: 'Qatari Riyal',        rate: 3.64,     flag: '🇶🇦' },
  { code: 'KWD', symbol: 'KD ',   name: 'Kuwaiti Dinar',       rate: 0.31,     flag: '🇰🇼' },
  { code: 'BHD', symbol: 'BD ',   name: 'Bahraini Dinar',      rate: 0.38,     flag: '🇧🇭' },
  { code: 'OMR', symbol: 'OMR ',  name: 'Omani Rial',          rate: 0.38,     flag: '🇴🇲' },
];

const CurrencyContext = createContext(null);
const STORAGE_KEY = 'flyyaro_currency';

export function CurrencyProvider({ children }) {
  const [code, setCode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'USD';
    } catch {
      return 'USD';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, [code]);

  const currency = CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];

  // Convert from USD base to selected currency, formatted with locale-aware grouping.
  const formatPrice = useCallback(
    (usdAmount, opts = {}) => {
      if (usdAmount == null || isNaN(usdAmount)) return '—';
      const converted = Number(usdAmount) * currency.rate;
      // No decimals for currencies where it doesn't make sense
      const noDecimals = ['JPY', 'KRW', 'IDR', 'VND', 'CLP', 'HUF', 'NGN', 'ARS'].includes(
        currency.code
      );
      const fractionDigits = opts.decimals ?? (noDecimals ? 0 : 0); // flight prices look cleaner without decimals
      const rounded = noDecimals ? Math.round(converted) : Math.round(converted);
      const formatted = rounded.toLocaleString('en-US', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      });
      return `${currency.symbol}${formatted}`;
    },
    [currency]
  );

  const value = {
    code: currency.code,
    currency,
    setCurrency: setCode,
    formatPrice,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
