# Currency Switching - Testing Guide 🧪

## 🚀 Development Server
The dev server should be running at: **http://localhost:5173**

If not running, start it with:
```bash
npm run dev
```

---

## 📋 Test Checklist

### Test 1: Homepage - Featured Tours Section ✓

**Steps:**
1. Open http://localhost:5173
2. Look for the "Featured Tours" or "Our tours and activities" section
3. Note the prices shown on tour cards (should show in THB by default)
4. Click the currency switcher in the header (top right, should show "THB")
5. Observe the prices change instantly to EUR

**Expected Results:**
- ✅ Prices initially show in THB (e.g., "1500 THB", "3000 THB")
- ✅ After clicking switcher, prices update to EUR (e.g., "40 €", "80 €")
- ✅ No page refresh required
- ✅ All visible tour cards update simultaneously
- ✅ Conversion formula: THB ÷ 37.6 = EUR (rounded up)

**Example:**
- 1500 THB → 40 € (1500/37.6 = 39.89 → rounds to 40)
- 3000 THB → 80 € (3000/37.6 = 79.78 → rounds to 80)

---

### Test 2: Tours Listing Page ✓

**Steps:**
1. Navigate to http://localhost:5173/en/tours (or /fr/tours)
2. Observe all tour cards with prices
3. Click the currency switcher in header
4. Watch all prices update

**Expected Results:**
- ✅ All tour cards show prices
- ✅ Currency switch updates ALL visible tours instantly
- ✅ Scroll down to see more tours - they should also have updated currency
- ✅ Filter tours - filtered results show correct currency

**Test Scenarios:**
- View with 8+ tours visible
- Scroll to load more tours
- Use search filter
- Use category filter
- All should maintain selected currency

---

### Test 3: Tour Detail Page - Booking Section ✓

**Steps:**
1. Click on any tour from the listing or homepage
2. Scroll down to the "Ready to Book?" section
3. Note the price mentioned in the booking details
4. Click currency switcher
5. Observe price update in booking section

**Expected Results:**
- ✅ Booking section shows adult price
- ✅ If child price exists, it also updates
- ✅ WhatsApp/Email booking messages include correct currency
- ✅ Price updates without page reload

**Check:**
- Adult price formatting
- Child price formatting (if available)
- Booking inquiry text (should show selected currency)

---

### Test 4: Favorites Section (Homepage) ✓

**Steps:**
1. Go back to homepage (http://localhost:5173)
2. Scroll to "Nos activités préférées" or "Our favorite activities"
3. Note the prices
4. Switch currency
5. Verify prices update

**Expected Results:**
- ✅ 3 favorite tours display with prices
- ✅ Currency switch updates all 3 immediately
- ✅ Consistent with featured tours section above

---

### Test 5: Tour Suggestions (on Tour Detail) ✓

**Steps:**
1. On any tour detail page
2. Scroll to bottom for "Our suggestions" or similar section
3. Note prices on suggested tours
4. Switch currency
5. Verify updates

**Expected Results:**
- ✅ Suggested tour cards show prices
- ✅ Prices update on currency switch
- ✅ Clicking suggested tour maintains currency selection

---

### Test 6: Currency Persistence ✓

**Steps:**
1. Start with default currency (THB)
2. Switch to EUR
3. Navigate to different pages (homepage → tours list → tour detail)
4. Refresh browser (F5 or Cmd+R)
5. Check currency is still EUR

**Expected Results:**
- ✅ Currency selection persists across page navigation
- ✅ Currency selection persists after browser refresh
- ✅ Uses localStorage to remember preference
- ✅ Each user's preference is independent

**Technical:**
- Check browser console: `localStorage.getItem('safarine-currency')`
- Should show "EUR" or "THB"

---

### Test 7: Multiple Currency Switches ✓

**Steps:**
1. On homepage, switch: THB → EUR → THB → EUR → THB
2. Do this rapidly
3. Check for any flickering or errors

**Expected Results:**
- ✅ Smooth transitions
- ✅ No console errors
- ✅ Prices always accurate for selected currency
- ✅ No memory leaks or performance issues

---

### Test 8: Edge Cases ✓

**Test 8a: Tours Without Prices**
- Navigate to a tour that might not have pricing
- Should display gracefully (no price badge shown)
- No errors in console

**Test 8b: Tours with Child Prices**
- Find a tour with child pricing
- Switch currency
- Both adult and child prices should update

**Test 8c: Language + Currency Combination**
- Switch to French (/fr/tours)
- Switch currency to EUR
- Verify prices show "40 €" format (not "€40")
- Switch to English (/en/tours)  
- Should still maintain EUR
- Verify format consistency

---

## 🔍 What to Check in Browser Console

Open browser DevTools (F12 or Cmd+Option+I), check Console tab:

**Should NOT see:**
- ❌ TypeScript errors
- ❌ "Cannot read property of undefined"
- ❌ React re-render warnings
- ❌ Currency formatting errors

**Should see (optional debug logs):**
- ✓ "Fetching tours..." messages
- ✓ Query cache updates
- ✓ No errors or warnings

**Check in React DevTools:**
1. Install React DevTools extension
2. Open Components tab
3. Find TourCard component
4. Check props: `price` should be number, `currency` should be "THB" or "EUR"
5. Change currency → props update → component re-renders

---

## 🎯 Conversion Verification

### Manual Calculation Check:

**Exchange Rate:** 1 EUR = 37.6 THB

**Sample Conversions:**
| THB Price | Calculation | EUR Price | Display |
|-----------|-------------|-----------|---------|
| 1500 THB  | 1500/37.6   | 39.89     | 40 €    |
| 3000 THB  | 3000/37.6   | 79.78     | 80 €    |
| 4500 THB  | 4500/37.6   | 119.68    | 120 €   |
| 7500 THB  | 7500/37.6   | 199.47    | 200 €   |

**Note:** EUR prices are rounded UP using `Math.ceil()`

---

## 🐛 Common Issues & Solutions

### Issue: Prices Don't Update
**Symptoms:** Click currency switcher, nothing happens
**Debug:**
1. Open DevTools → Console
2. Type: `localStorage.getItem('safarine-currency')`
3. Should toggle between "THB" and "EUR"
4. Check if TourCard is receiving `price` as number (not string)

### Issue: Wrong Conversion
**Symptoms:** 1500 THB shows as 45 € instead of 40 €
**Debug:**
1. Check `CurrencyContext.tsx` line 16
2. Verify: `FX_RATE_THB_TO_EUR = 1 / 37.6`
3. Should be approximately 0.0266

### Issue: Format Inconsistent
**Symptoms:** Sometimes shows "THB 1500", sometimes "1500 THB"
**Debug:**
1. All formatting should use `formatPrice()` from CurrencyContext
2. THB format: `${Math.round(amountTHB)} THB`
3. EUR format: `${eurAmount} €`

---

## ✅ Success Criteria

All tests pass when:
- [ ] Currency switcher button toggles between "THB" and "EUR"
- [ ] All prices update immediately on switch
- [ ] No page refresh needed
- [ ] No console errors
- [ ] Currency persists across navigation
- [ ] Currency persists after page refresh
- [ ] Conversion calculations are accurate
- [ ] All 8 test scenarios pass

---

## 📊 Test Results Template

```
Test Date: ___________
Tester: ___________

✓ Test 1: Homepage Featured Tours - PASS / FAIL
✓ Test 2: Tours Listing Page - PASS / FAIL
✓ Test 3: Tour Detail Booking - PASS / FAIL
✓ Test 4: Favorites Section - PASS / FAIL
✓ Test 5: Tour Suggestions - PASS / FAIL
✓ Test 6: Currency Persistence - PASS / FAIL
✓ Test 7: Multiple Switches - PASS / FAIL
✓ Test 8: Edge Cases - PASS / FAIL

Overall: PASS / FAIL

Notes:
_________________________________
_________________________________
```

---

## 🚀 Ready to Ship?

Once all tests pass:
1. [ ] All 8 test scenarios completed
2. [ ] No console errors
3. [ ] Tested in Chrome, Firefox, Safari
4. [ ] Tested on mobile viewport
5. [ ] Documentation updated
6. [ ] Ready to commit changes

**Next Steps:**
```bash
git add .
git commit -m "feat: implement dynamic currency switching (THB/EUR)"
git push
```

---

**Happy Testing! 🎉**
