# Pharma Management System - Frontend

Mobile-first responsive web application for Pharma Management System

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styles with CSS variables
- **Bootstrap 5** - Responsive framework
- **JavaScript (ES6+)** - Client-side logic
- **Axios** - HTTP client
- **Font Awesome** - Icons

## Project Structure

```
frontend/
├── admin/              # Admin dashboard pages
│   ├── dashboard.html
│   ├── sections.html
│   ├── products.html
│   ├── workers.html
│   ├── users.html
│   ├── orders.html
│   └── settings.html
├── worker/             # Worker dashboard pages
│   ├── dashboard.html
│   ├── create-order.html
│   └── orders.html
├── user/               # User dashboard pages
│   ├── dashboard.html
│   ├── shop.html
│   ├── cart.html
│   └── orders.html
├── css/                # Stylesheets
│   └── style.css
├── js/                 # JavaScript files
│   ├── config.js       # API config & utilities
│   ├── login.js        # Login logic
│   ├── cart.js         # Cart management
│   └── admin-products.js
├── index.html          # Landing page
├── login.html          # Login page
├── forgot-password.html
└── invoice.html        # Invoice template
```

## Features

### Responsive Design
- Mobile-first approach
- Touch-friendly UI with big buttons (min 48px height)
- Hamburger menu for mobile navigation
- Optimized for screens from 320px to 1920px

### Admin Dashboard
- Dashboard analytics with cards
- Section management (CRUD)
- Product management with stock alerts
- Worker management
- User management
- Order management with filters
- GST settings
- Profile management

### Worker Dashboard
- Searchable medical store dropdown
- Product browsing by sections
- Cart system
- Order creation for stores
- Order history

### User Dashboard
- Product catalog with sections
- Shopping cart with localStorage
- Real-time GST calculation
- Order placement
- Order history
- Invoice printing

### Cart System
- LocalStorage-based cart
- Quantity controls
- Stock validation
- Real-time total calculation
- GST breakdown (SGST + CGST)

### Invoice System
- Professional invoice layout
- Medical store and pharma details
- Product details with batch info
- GST breakdown
- Print-optimized CSS

## Setup

1. Update API URL in `js/config.js`:
```javascript
const API_URL = 'http://localhost:3000/api';
```

2. Serve the frontend:
   - The backend automatically serves these files from `http://localhost:3000`
   - Or use any static file server

## Configuration

### API Configuration (`js/config.js`)

```javascript
const API_URL = 'http://localhost:3000/api';

// Axios is configured with:
// - Base URL
// - Auto token injection
// - 401 redirect to login
```

### Utility Functions

- `showAlert(message, type)` - Display Bootstrap alerts
- `formatDate(dateString)` - Format dates to Indian locale
- `formatCurrency(amount)` - Format currency to INR
- `logout()` - Clear session and redirect
- `checkAuth(role)` - Verify authentication and role

## Pages

### Public Pages
- `/index.html` - Landing page (redirects to login)
- `/login.html` - Multi-role login (Admin/Worker/User)
- `/forgot-password.html` - Password reset

### Admin Pages
- `/admin/dashboard.html` - Analytics dashboard
- `/admin/sections.html` - Manage product sections
- `/admin/products.html` - Manage products
- `/admin/workers.html` - Manage workers
- `/admin/users.html` - Manage medical stores
- `/admin/orders.html` - View all orders
- `/admin/settings.html` - Profile & GST settings

### Worker Pages
- `/worker/dashboard.html` - Worker home
- `/worker/create-order.html` - Create order for stores
- `/worker/orders.html` - Order history

### User Pages
- `/user/dashboard.html` - User home
- `/user/shop.html` - Browse products
- `/user/cart.html` - Shopping cart
- `/user/orders.html` - Order history

### Shared Pages
- `/invoice.html` - Printable invoice

## Styling

### Color Scheme
```css
--primary-color: #0d6efd (Blue)
--secondary-color: #6c757d (Gray)
--success-color: #198754 (Green)
--danger-color: #dc3545 (Red)
--warning-color: #ffc107 (Yellow)
```

### Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Authentication Flow

1. User selects role (Admin/Worker/User)
2. Enters phone and password
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Token sent with every API request
6. Auto-redirect to login on 401 errors

## Cart Management

Cart data structure in localStorage:
```javascript
[
  {
    productId: 1,
    productName: "Product Name",
    price: 100.00,
    quantity: 2,
    maxStock: 50
  }
]
```

## Print Styles

Invoice page includes print-specific CSS:
- Hides navigation and buttons
- Optimizes layout for A4 paper
- Ensures all content is visible

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## CDN Dependencies

- Bootstrap 5.3.0
- Font Awesome 6.4.0
- Axios (latest)

## Best Practices

- Mobile-first responsive design
- Semantic HTML5
- Accessible forms with labels
- Loading states for async operations
- Error handling with user feedback
- Client-side validation
- Secure token storage
- Auto-logout on token expiry

## License

ISC
