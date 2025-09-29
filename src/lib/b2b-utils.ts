// B2B utility functions for calculations and formatting

export interface B2BRate {
  retailPrice: number;
  b2bPrice: number;
  commission: number;
  savingsAmount: number;
  savingsPercentage: number;
  usesStoredPrice: boolean;
}

/**
 * Calculate B2B rates based on retail price and commission rate, with stored B2B price support
 */
export function calculateB2BRate(
  retailPrice: number, 
  commissionRate: number, 
  storedB2BPrice?: number | null
): B2BRate {
  // Use stored B2B price if available, otherwise calculate from commission
  const usesStoredPrice = storedB2BPrice !== null && storedB2BPrice !== undefined;
  const b2bPrice = usesStoredPrice ? storedB2BPrice! : retailPrice - (retailPrice * commissionRate) / 100;
  const commission = retailPrice - b2bPrice;
  const savingsAmount = commission;
  const savingsPercentage = (commission / retailPrice) * 100;
  
  return {
    retailPrice,
    b2bPrice,
    commission,
    savingsAmount,
    savingsPercentage,
    usesStoredPrice,
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
    'Adult Price',
    'Child Price',
    'B2B Price',
    'B2B Pricing Method',
    'Commission Amount',
    'Savings %',
    'Currency'
  ];
  
  const rows = tours.map(tour => {
    const b2bRate = calculateB2BRate(tour.price || 0, commissionRate, tour.b2b_price);
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
      tour.child_price || 'N/A',
      Math.round(b2bRate.b2bPrice),
      b2bRate.usesStoredPrice ? 'Fixed Price' : 'Commission Based',
      Math.round(b2bRate.commission),
      Math.round(b2bRate.savingsPercentage),
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