// B2B utility functions for calculations and formatting

export interface B2BRate {
  retailPrice: number;
  b2bPrice: number;
  commission: number;
  savingsAmount: number;
  savingsPercentage: number;
}

/**
 * Calculate B2B rates based on retail price and commission rate
 */
export function calculateB2BRate(retailPrice: number, commissionRate: number): B2BRate {
  const commission = (retailPrice * commissionRate) / 100;
  const b2bPrice = retailPrice - commission;
  const savingsAmount = commission;
  const savingsPercentage = commissionRate;
  
  return {
    retailPrice,
    b2bPrice,
    commission,
    savingsAmount,
    savingsPercentage,
  };
}

/**
 * Format price with currency
 */
export function formatB2BPrice(price: number, currency: string = 'THB'): string {
  return `${price.toLocaleString()} ${currency}`;
}

/**
 * Generate CSV content for tours export
 */
export function generateToursCSV(tours: any[], commissionRate: number): string {
  const headers = [
    'Tour Name (EN)',
    'Tour Name (FR)', 
    'Destination',
    'Duration (Days)',
    'Duration (Nights)',
    'Group Size Min',
    'Group Size Max',
    'Difficulty',
    'Retail Price',
    'B2B Price',
    'Commission Amount',
    'Savings %',
    'Currency'
  ];
  
  const rows = tours.map(tour => {
    const b2bRate = calculateB2BRate(tour.price || 0, commissionRate);
    return [
      `"${tour.title_en || ''}"`,
      `"${tour.title_fr || ''}"`,
      `"${tour.destination || ''}"`,
      tour.duration_days || 0,
      tour.duration_nights || 0,
      tour.group_size_min || 2,
      tour.group_size_max || 8,
      `"${tour.difficulty_level || 'moderate'}"`,
      tour.price || 0,
      Math.round(b2bRate.b2bPrice),
      Math.round(b2bRate.commission),
      b2bRate.savingsPercentage,
      tour.currency || 'THB'
    ];
  });
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Calculate tour statistics from tours array
 */
export function calculateTourStats(tours: any[]) {
  const total = tours.length;
  const averageDuration = tours.length > 0 
    ? (tours.reduce((sum, tour) => sum + (tour.duration_days || 0), 0) / tours.length).toFixed(1)
    : '0';
    
  // Mock new tours this month (would be calculated based on created_at in real implementation)
  const newThisMonth = Math.floor(total * 0.15); // Assume 15% are new
  
  return {
    total,
    newThisMonth,
    averageDuration,
  };
}