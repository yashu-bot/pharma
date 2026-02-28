# Scheme Feature - Buy X Get 1 Free

## Overview

The scheme feature allows admins to set up "Buy X Get 1 Free" offers on products. When customers order products with schemes, they automatically receive free items, and the system deducts the correct quantity from stock.

## How It Works

### Admin Side

1. **Adding/Editing Products:**
   - Go to Admin → Products → Add/Edit Product
   - In the "Scheme" field, enter a number (e.g., 4)
   - This means: "Buy 4 sheets, get 1 free"
   - Leave empty if no offer

2. **Examples:**
   - Scheme = 4: Buy 4 get 1 free
   - Scheme = 5: Buy 5 get 1 free
   - Scheme = 10: Buy 10 get 1 free
   - Scheme = NULL/Empty: No offer

### Customer/Worker Side

1. **Product Display:**
   - Products with schemes show: "Buy 4 Get 1 FREE!" badge
   - Price shown is for paid items only

2. **Ordering:**
   - Customer orders 4 sheets → Gets 5 sheets (4 paid + 1 free)
   - Customer orders 8 sheets → Gets 10 sheets (8 paid + 2 free)
   - Customer orders 12 sheets → Gets 15 sheets (12 paid + 3 free)

### Calculation Logic

```javascript
// Example: Scheme = 4 (Buy 4 Get 1 Free)
orderedQuantity = 8
freeQuantity = Math.floor(8 / 4) = 2
totalQuantity = 8 + 2 = 10
stockDeducted = 10

// Price calculation (only for paid items)
price = sellingPrice × orderedQuantity
price = ₹50 × 8 = ₹400 (free items don't add to price)
```

## Database Changes

### Products Table
```sql
scheme INT DEFAULT NULL COMMENT 'Buy X sheets get 1 free (NULL = no offer)'
```

### Order Items Table
```sql
quantity INT NOT NULL COMMENT 'Quantity ordered by customer'
free_quantity INT DEFAULT 0 COMMENT 'Free items based on scheme'
total_quantity INT NOT NULL COMMENT 'Total quantity including free items'
stock_deducted INT NOT NULL COMMENT 'Actual stock deducted'
```

## Stock Management

### Stock Validation
- System checks if enough stock exists for TOTAL quantity (paid + free)
- Example: Order 8 sheets with scheme 4
  - Free items: 2
  - Total needed: 10
  - Stock must have at least 10 items

### Stock Deduction
- Stock is reduced by TOTAL quantity (including free items)
- Example: Stock = 100, Order = 8 (with 2 free)
  - New stock = 100 - 10 = 90

## Invoice Display

Invoice shows:
- **Quantity column:** "8 + 2 free" (clear breakdown)
- **Scheme column:** "Buy 4 Get 1 Free"
- **Price:** Only for paid quantity (₹400 for 8 sheets, not 10)

## Migration

If you already have data in your database:

```bash
mysql -u root -p pharma_db < backend/database/migrate-scheme.sql
```

This will:
1. Convert scheme from VARCHAR to INT
2. Add new columns to order_items
3. Update existing records with default values

## Examples

### Example 1: Simple Offer
- Product: Paracetamol
- Scheme: 5
- Customer orders: 10 sheets
- Result:
  - Paid: 10 sheets
  - Free: 2 sheets (10/5 = 2)
  - Total: 12 sheets
  - Price: 10 × ₹20 = ₹200
  - Stock deducted: 12

### Example 2: No Offer
- Product: Aspirin
- Scheme: NULL (empty)
- Customer orders: 10 sheets
- Result:
  - Paid: 10 sheets
  - Free: 0 sheets
  - Total: 10 sheets
  - Price: 10 × ₹30 = ₹300
  - Stock deducted: 10

### Example 3: Partial Offer
- Product: Vitamin C
- Scheme: 4
- Customer orders: 7 sheets
- Result:
  - Paid: 7 sheets
  - Free: 1 sheet (7/4 = 1.75, floor = 1)
  - Total: 8 sheets
  - Price: 7 × ₹15 = ₹105
  - Stock deducted: 8

## Benefits

1. **Automatic Calculation:** No manual calculation needed
2. **Accurate Stock:** Stock is correctly deducted including free items
3. **Clear Display:** Customers see exactly what they get
4. **Flexible:** Each product can have different schemes
5. **Optional:** Not all products need schemes

## Testing

1. **Create a product with scheme = 4**
2. **Order 8 sheets**
3. **Verify:**
   - Cart shows 8 sheets
   - Price is for 8 sheets only
   - Invoice shows "8 + 2 free"
   - Stock reduced by 10

## Notes

- Scheme is optional (can be NULL/empty)
- Free quantity is always rounded down (floor function)
- Price is ONLY for paid quantity
- Stock must have enough for total (paid + free)
- Invoice clearly shows breakdown

## Support

For questions or issues, check:
- Admin dashboard for product management
- Order details for scheme calculations
- Invoice for customer-facing display
