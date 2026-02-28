# Pharma Management System - Backend

Node.js + Express.js REST API for Pharma Management System

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT + bcrypt
- **Architecture**: MVC Pattern

## Project Structure

```
backend/
├── config/              # Database configuration
├── controllers/         # Business logic
│   ├── adminController.js
│   ├── authController.js
│   ├── orderController.js
│   ├── productController.js
│   ├── sectionController.js
│   ├── userController.js
│   └── workerController.js
├── middleware/          # Auth & validation middleware
│   ├── auth.js
│   └── validator.js
├── routes/             # API routes
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── sectionRoutes.js
│   ├── userRoutes.js
│   └── workerRoutes.js
├── database/           # SQL schema
│   └── schema.sql
├── server.js           # Main server file
├── package.json
├── .env
└── .env.example
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pharma_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

3. Create database and run schema:
```bash
mysql -u root -p < database/schema.sql
```

4. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/worker/login` - Worker login
- `POST /api/auth/user/login` - User login
- `POST /api/auth/forgot-password` - Reset password

### Admin
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile
- `POST /api/admin/change-password` - Change password
- `GET /api/admin/gst` - Get GST settings
- `PUT /api/admin/gst` - Update GST settings
- `GET /api/admin/dashboard` - Dashboard analytics

### Sections
- `GET /api/sections` - Get all sections
- `POST /api/sections` - Add section (Admin)
- `PUT /api/sections/:id` - Update section (Admin)
- `DELETE /api/sections/:id` - Delete section (Admin)

### Products
- `GET /api/products` - Get available products (User/Worker)
- `GET /api/products/all` - Get all products (Admin)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Workers
- `GET /api/workers` - Get all workers (Admin)
- `POST /api/workers` - Add worker (Admin)
- `DELETE /api/workers/:id` - Delete worker (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/search` - Search users (Worker)
- `POST /api/users` - Add user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Orders
- `POST /api/orders` - Place order (User/Worker)
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `GET /api/orders/user/my-orders` - Get user orders
- `GET /api/orders/worker/my-orders` - Get worker orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Admin)

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control (Admin/Worker/User)
- Input validation using express-validator
- SQL injection prevention with parameterized queries
- CORS enabled

## Default Admin Credentials

- Phone: `1234567890`
- Password: `admin123`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DB_HOST | MySQL host | localhost |
| DB_USER | MySQL user | root |
| DB_PASSWORD | MySQL password | - |
| DB_NAME | Database name | pharma_db |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration | 7d |

## Database Schema

The system uses 7 main tables:
- `admin` - Admin credentials and settings
- `workers` - Worker accounts
- `users` - Medical store owners
- `sections` - Product categories
- `products` - Product inventory
- `orders` - Order records
- `order_items` - Order line items

## Error Handling

All API responses follow this format:

Success:
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Error:
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## License

ISC
