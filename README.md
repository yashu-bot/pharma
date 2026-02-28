# Pharma Management System

A comprehensive B2B Pharma Management System with separate dashboards for Admin, Worker, and Medical Store Owners.

## Project Structure

```
pharma-management-system/
├── backend/              # Node.js + Express.js API
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── routes/          # API endpoints
│   ├── database/        # SQL schema
│   ├── server.js        # Main server file
│   └── package.json
│
├── frontend/            # HTML + Bootstrap 5 UI
│   ├── admin/          # Admin dashboard pages
│   ├── worker/         # Worker dashboard pages
│   ├── user/           # User dashboard pages
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── *.html          # Public pages
│
└── README.md           # This file
```

## Features

### Admin Dashboard
- Manage sections (Tablets, Syrups, Capsules, etc.)
- Manage products with full details
- Manage workers and users
- View all orders with filters
- Update GST settings
- Dashboard analytics
- Profile management

### Worker Dashboard
- Search and select medical stores
- Browse products by sections
- Create orders for medical stores
- View order history
- Print invoices

### User Dashboard (Medical Store Owner)
- Browse products by sections
- Add products to cart
- Place orders
- View order history
- Print invoices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT + bcrypt
- **Frontend**: HTML, Bootstrap 5, Axios
- **Architecture**: MVC pattern

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pharma_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Create database:
```bash
mysql -u root -p < database/schema.sql
```

Start backend server:
```bash
npm start
```

### 2. Frontend Setup

The backend automatically serves the frontend from the `frontend/` folder.

Access the application:
- Open browser: `http://localhost:3000`

### 3. Default Login

**Admin Credentials:**
- Phone: `1234567890`
- Password: `admin123`

## Documentation

- [Backend Documentation](backend/README.md) - API endpoints, database schema, security
- [Frontend Documentation](frontend/README.md) - Pages, components, styling

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- SQL injection prevention
- Input validation
- CORS enabled

## Mobile Responsive

Fully responsive design optimized for mobile devices:
- Touch-friendly UI
- Big buttons (min 48px)
- Hamburger menu
- Mobile-optimized invoice printing

## Key Features

✅ Role-based authentication (Admin/Worker/User)  
✅ Product management with sections  
✅ Stock validation and alerts  
✅ Expiry date tracking  
✅ Shopping cart system  
✅ Order management  
✅ GST calculation (SGST + CGST)  
✅ Invoice generation and printing  
✅ Dashboard analytics  
✅ Mobile-first responsive design  

## Development

Backend (with auto-reload):
```bash
cd backend
npm run dev
```

## Production Deployment

1. Update `.env` with production values
2. Set strong `JWT_SECRET`
3. Configure production database
4. Use process manager (PM2)
5. Set up reverse proxy (Nginx)
6. Enable HTTPS

## License

ISC
"# pharma" 
