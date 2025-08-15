import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocale } from './LocaleContext';

export type Currency = 'THB' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountTHB: number, amountEUR?: number | null) => string;
  fxRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'safarine-currency';
const FX_RATE_THB_TO_EUR = 0.0257; // Base rate, could be fetched from API

const currencyDefaults = {
  fr: 'EUR' as Currency,
  en: 'THB' as Currency,
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale } = useLocale();
  
  // Initialize currency from localStorage or locale default
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency;
    return stored || currencyDefaults[locale];
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  };

  // Update currency default when locale changes (if not explicitly set)
  useEffect(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (!stored) {
      setCurrencyState(currencyDefaults[locale]);
    }
  }, [locale]);

  const formatPrice = (amountTHB: number, amountEUR?: number | null): string => {
    if (currency === 'THB') {
      return `${amountTHB.toLocaleString()} THB`;
    }
    
    // Use provided EUR amount or convert from THB
    const eurAmount = amountEUR ?? Math.round(amountTHB * FX_RATE_THB_TO_EUR / 5) * 5; // Round to nearest 5€
    return `${eurAmount.toLocaleString()} €`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatPrice, 
      fxRate: FX_RATE_THB_TO_EUR 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};