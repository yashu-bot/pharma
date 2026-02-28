# Project Structure

Complete directory structure of the Pharma Management System

```
pharma-management-system/
│
├── backend/                          # Backend API (Node.js + Express)
│   │
│   ├── config/                       # Configuration files
│   │   └── database.js              # MySQL connection pool
│   │
│   ├── controllers/                  # Business logic controllers
│   │   ├── adminController.js       # Admin operations
│   │   ├── authController.js        # Authentication logic
│   │   ├── orderController.js       # Order management
│   │   ├── productController.js     # Product CRUD
│   │   ├── sectionController.js     # Section management
│   │   ├── userController.js        # User management
│   │   └── workerController.js      # Worker management
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.js                  # JWT authentication
│   │   └── validator.js             # Input validation
│   │
│   ├── routes/                       # API route definitions
│   │   ├── adminRoutes.js           # Admin endpoints
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── orderRoutes.js           # Order endpoints
│   │   ├── productRoutes.js         # Product endpoints
│   │   ├── sectionRoutes.js         # Section endpoints
│   │   ├── userRoutes.js            # User endpoints
│   │   └── workerRoutes.js          # Worker endpoints
│   │
│   ├── database/                     # Database files
│   │   └── schema.sql               # MySQL schema & seed data
│   │
│   ├── server.js                     # Main Express server
│   ├── package.json                  # Dependencies & scripts
│   ├── .env                          # Environment variables (create this)
│   ├── .env.example                  # Environment template
│   ├── .gitignore                    # Git ignore rules
│   └── README.md                     # Backend documentation
│
├── frontend/                         # Frontend UI (HTML + Bootstrap)
│   │
│   ├── admin/                        # Admin dashboard pages
│   │   ├── dashboard.html           # Admin home with analytics
│   │   ├── sections.html            # Manage sections
│   │   ├── products.html            # Manage products
│   │   ├── workers.html             # Manage workers
│   │   ├── users.html               # Manage medical stores
│   │   ├── orders.html              # View all orders
│   │   └── settings.html            # Profile & GST settings
│   │
│   ├── worker/                       # Worker dashboard pages
│   │   ├── dashboard.html           # Worker home
│   │   ├── create-order.html        # Create order for stores
│   │   └── orders.html              # Worker order history
│   │
│   ├── user/                         # User dashboard pages
│   │   ├── dashboard.html           # User home
│   │   ├── shop.html                # Browse & shop products
│   │   ├── cart.html                # Shopping cart
│   │   └── orders.html              # User order history
│   │
│   ├── css/                          # Stylesheets
│   │   └── style.css                # Main stylesheet (mobile-first)
│   │
│   ├── js/                           # JavaScript files
│   │   ├── config.js                # API config & utilities
│   │   ├── login.js                 # Login logic
│   │   ├── cart.js                  # Cart management
│   │   └── admin-products.js        # Admin product management
│   │
│   ├── index.html                    # Landing page (redirects to login)
│   ├── login.html                    # Multi-role login page
│   ├── forgot-password.html          # Password reset page
│   ├── invoice.html                  # Printable invoice template
│   └── README.md                     # Frontend documentation
│
├── README.md                         # Main project documentation
├── SETUP.md                          # Detailed setup instructions
├── QUICKSTART.md                     # Quick start guide
└── PROJECT_STRUCTURE.md              # This file
```

## File Descriptions

### Backend Files

| File | Purpose |
|------|---------|
| `server.js` | Main Express application entry point |
| `config/database.js` | MySQL connection pool configuration |
| `controllers/*.js` | Business logic for each module |
| `middleware/auth.js` | JWT token verification & role checking |
| `middleware/validator.js` | Express-validator wrapper |
| `routes/*.js` | API endpoint definitions |
| `database/schema.sql` | Database schema & initial data |

### Frontend Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page (auto-redirects) |
| `login.html` | Multi-role login interface |
| `forgot-password.html` | Password reset form |
| `invoice.html` | Printable invoice template |
| `css/style.css` | Global styles (mobile-first) |
| `js/config.js` | API URL, Axios config, utilities |
| `js/cart.js` | Cart management functions |
| `admin/*.html` | Admin dashboard pages |
| `worker/*.html` | Worker dashboard pages |
| `user/*.html` | User dashboard pages |

## Key Features by Module

### Admin Module
- Dashboard with analytics
- Section management (CRUD)
- Product management (CRUD)
- Worker management (CRUD)
- User management (CRUD)
- Order viewing & filtering
- GST settings
- Profile management

### Worker Module
- Medical store search
- Product browsing
- Order creation for stores
- Order history
- Invoice printing

### User Module
- Product catalog
- Shopping cart
- Order placement
- Order history
- Invoice printing

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

### Frontend
- **Markup**: HTML5
- **Styling**: Bootstrap 5 + Custom CSS
- **Scripting**: Vanilla JavaScript (ES6+)
- **HTTP Client**: Axios
- **Icons**: Font Awesome 6

## Database Tables

1. `admin` - Admin account & settings
2. `workers` - Worker accounts
3. `users` - Medical store owners
4. `sections` - Product categories
5. `products` - Product inventory
6. `orders` - Order records
7. `order_items` - Order line items

## API Endpoints Summary

- `/api/auth/*` - Authentication
- `/api/admin/*` - Admin operations
- `/api/sections/*` - Section management
- `/api/products/*` - Product management
- `/api/workers/*` - Worker management
- `/api/users/*` - User management
- `/api/orders/*` - Order management

## Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Role-based access control
- Input validation
- SQL injection prevention
- CORS enabled

## Mobile Responsive

- Mobile-first CSS design
- Touch-friendly UI (48px min buttons)
- Responsive navigation
- Optimized invoice printing

## License

ISC
