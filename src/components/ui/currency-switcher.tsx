import React from 'react';
import { Button } from '@/components/ui/button';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';

export const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();

  const toggleCurrency = () => {
    setCurrency(currency === 'THB' ? 'EUR' : 'THB');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleCurrency}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-medium">
        {currency}
      </span>
    </Button>
  );
};