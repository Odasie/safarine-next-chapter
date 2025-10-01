# Currency Switching Fix - Action Plan

## 🔍 Problem Analysis

### Current State
The currency switcher in the header changes the currency state, but the price display doesn't update because:

1. **TourCard component** (line 147-150) receives `price` as a **string** prop, not a number
2. **Price is formatted once** at data fetch time in `transformTour()` (line 75 of use-tours.ts)
3. **Query cache** stores the formatted string, so switching currency doesn't re-format prices
4. **Tour detail page** passes raw price number to `EnhancedBookingSection`, but that component needs investigation

### Root Cause
The `useTours()` and `useFeaturedTours()` hooks use `formatPrice` function at transform time, creating a **static formatted string**. When currency changes, the query doesn't re-fetch because `formatPrice` function is not in the query key dependency.

## ✅ Solution Strategy

### Option 1: Dynamic Price Formatting (RECOMMENDED)
Format prices in components at render time instead of at fetch time.

**Pros:**
- Prices update immediately when currency changes
- No need to refetch data
- Clean separation of data and presentation

**Cons:**
- Need to pass price as number + currency to all components
- Requires updating multiple components

### Option 2: Invalidate Query on Currency Change
Invalidate and refetch tour queries when currency changes.

**Pros:**
- Minimal component changes

**Cons:**
- Unnecessary data refetching
- Slower user experience
- Network overhead

## 📋 Implementation Plan (Option 1 - Recommended)

### Phase 1: Update Data Layer ✅
**File:** `src/hooks/use-tours.ts`

1. Remove `formatPrice` from `transformTour()` function
2. Change price to return raw number instead of formatted string
3. Remove `formatPrice` dependency from hooks
4. Keep `currency` field in the tour data

**Changes:**
```typescript
// BEFORE (line 75)
const price = tour.price && formatPrice ? formatPrice(tour.price) : 
  (tour.price ? `${tour.price} ${tour.currency || 'THB'}` : undefined);

// AFTER
const price = tour.price; // Keep as number
const currency = tour.currency || 'THB';
```

### Phase 2: Update TourCard Component ✅
**File:** `src/components/tours/TourCard.tsx`

1. Import `useCurrency` hook
2. Change `price` prop type from `string?` to `number?`
3. Add `currency` prop
4. Format price at render time

**Changes:**
```typescript
// Add to imports
import { useCurrency } from '@/contexts/CurrencyContext';

// Update interface (line 19)
price?: number;  // Change from string? to number?
currency?: string; // Add currency prop

// In component body (line 35-36)
const { formatPrice } = useCurrency();

// Update price display (line 147-150)
{price && (
  <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1 text-xs">
    <CircleDollarSign className="h-3.5 w-3.5" /> {formatPrice(price)}
  </span>
)}
```

### Phase 3: Update All TourCard Usage Sites ✅
Update components that use TourCard to pass number instead of string:

**Files to update:**
1. `src/pages/Index.tsx` (line 82-93)
2. `src/pages/ToursList.tsx` (line 150-162)
3. `src/components/sections/Favorites.tsx` (line 34-46)
4. `src/components/tours/TourSuggestionsSection.tsx` (line 60-74)

**Changes:** Add `currency` prop to each TourCard usage

### Phase 4: Update Tour Detail Page ✅
**File:** `src/pages/TourDetail.tsx`

The pricing object is already using raw numbers (line 187-197), so we just need to ensure `EnhancedBookingSection` formats them properly.

### Phase 5: Update EnhancedBookingSection ✅
**File:** `src/components/tours/EnhancedBookingSection.tsx`

1. Import `useCurrency` hook
2. Format prices at render time
3. Remove hardcoded currency display

### Phase 6: Update TransformedTour Interface ✅
**File:** `src/hooks/use-tours.ts`

Update the interface to reflect new types:
```typescript
export interface TransformedTour {
  // ... other fields
  price?: number;  // Change from string? to number?
  currency?: string; // Add currency field
  // ... other fields
}
```

## 🧪 Testing Checklist

### Test Scenarios
- [ ] Homepage: Featured tours show prices, currency switch updates them
- [ ] Tours List: All tours show prices, currency switch updates them
- [ ] Tour Detail: Price in booking section updates on currency switch
- [ ] Tour Suggestions: Suggested tours show correct prices
- [ ] Favorites Section: Tours show correct prices
- [ ] Test with tours that have no price (should handle gracefully)
- [ ] Test with different locales (EN/FR)
- [ ] Verify EUR conversion is accurate (1 EUR = 37.6 THB)

### Currency Scenarios
- [ ] Switch from THB to EUR
- [ ] Switch from EUR to THB
- [ ] Refresh page maintains currency selection (localStorage)
- [ ] Change locale updates default currency preference

## 📊 Database Considerations

### Current Schema
The `tours` table stores:
- `price` (number): Single price field
- `currency` (string): Currency for the price
- `child_price` (number|null): Child price
- `b2b_price` (number|null): B2B price

### Future Enhancement (Optional)
Consider adding separate EUR price fields to avoid conversion rounding:
- `price_thb` (number)
- `price_eur` (number|null)
- `child_price_thb` (number|null)
- `child_price_eur` (number|null)

This would allow setting exact EUR prices instead of relying on conversion.

## 🎯 Success Criteria

1. ✅ Currency switcher changes displayed currency
2. ✅ All price displays update immediately (no page refresh)
3. ✅ Conversion rate applied correctly (THB → EUR)
4. ✅ No console errors
5. ✅ TypeScript compilation succeeds
6. ✅ Selected currency persists in localStorage
7. ✅ Works on: Homepage, Tour List, Tour Detail

## 📝 Files to Modify

### Core Files (Must Change)
1. ✅ `src/hooks/use-tours.ts` - Remove formatPrice from transform
2. ✅ `src/components/tours/TourCard.tsx` - Add dynamic formatting
3. ✅ `src/components/tours/EnhancedBookingSection.tsx` - Add dynamic formatting

### Usage Sites (Update props)
4. ✅ `src/pages/Index.tsx`
5. ✅ `src/pages/ToursList.tsx`
6. ✅ `src/components/sections/Favorites.tsx`
7. ✅ `src/components/tours/TourSuggestionsSection.tsx`

### Context (Already Working)
- ✅ `src/contexts/CurrencyContext.tsx` - No changes needed
- ✅ `src/components/ui/currency-switcher.tsx` - No changes needed

## ⏱️ Estimated Time
- Phase 1-2: 15 minutes
- Phase 3-5: 20 minutes
- Phase 6: 5 minutes
- Testing: 15 minutes
- **Total: ~1 hour**

## 🚀 Implementation Order
1. Update `use-tours.ts` (data layer)
2. Update `TourCard.tsx` (presentation)
3. Update all TourCard usage sites
4. Update `EnhancedBookingSection.tsx`
5. Test thoroughly
6. Create PR with screenshots

## 💡 Additional Notes

### Exchange Rate Management
Current rate: 1 EUR = 37.6 THB (hardcoded in CurrencyContext.tsx, line 16)

Consider future enhancement to:
- Store exchange rate in database
- Update via admin panel
- Fetch from external API
- Historical rate tracking

### Price Display Format
- **THB**: No decimals, rounded (e.g., "1500 THB")
- **EUR**: No decimals, rounded up (e.g., "40 €")

This is handled in `CurrencyContext.formatPrice()` (lines 45-53).
