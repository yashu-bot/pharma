# Pharma Management System - Setup Guide

Complete setup instructions for the Pharma Management System

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

## Project Structure

```
pharma-management-system/
├── backend/              # Backend API (Node.js + Express)
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── routes/          # API endpoints
│   ├── database/        # SQL schema
│   ├── server.js        # Main server
│   ├── package.json
│   └── .env
│
├── frontend/            # Frontend UI (HTML + Bootstrap)
│   ├── admin/          # Admin pages
│   ├── worker/         # Worker pages
│   ├── user/           # User pages
│   ├── css/            # Styles
│   ├── js/             # Scripts
│   └── *.html          # Public pages
│
└── README.md
```

## Step-by-Step Setup

### 1. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment

Create `.env` file in the `backend/` directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pharma_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

#### Setup Database

1. Login to MySQL:
```bash
mysql -u root -p
```

2. Run the schema file:
```bash
mysql -u root -p < database/schema.sql
```

Or manually:
```sql
source /path/to/backend/database/schema.sql
```

This will:
- Create `pharma_db` database
- Create all required tables
- Insert default admin account
- Insert sample sections

#### Start Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start at: `http://localhost:3000`

### 2. Frontend Setup

The frontend is automatically served by the backend server from the `frontend/` folder.

No additional setup required!

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You'll be redirected to the login page.

## Default Login Credentials

### Admin Account
- **Phone:** `1234567890`
- **Password:** `admin123`

**Important:** Change the admin password immediately after first login!

### Create Worker Account
1. Login as Admin
2. Go to "Workers" section
3. Click "Add Worker"
4. Fill in details and save

### Create User Account (Medical Store)
1. Login as Admin
2. Go to "Users" section
3. Click "Add User"
4. Fill in medical store details and save

## Testing the System

### 1. Test Admin Dashboard
- Login as admin
- View dashboard analytics
- Add sections (e.g., Tablets, Syrups)
- Add products with details
- Manage workers and users
- View orders

### 2. Test Worker Dashboard
- Login as worker
- Search for a medical store
- Browse products
- Add to cart
- Place order
- View invoice

### 3. Test User Dashboard
- Login as user (medical store owner)
- Browse products by sections
- Add products to cart
- Place order
- View order history
- Print invoice

## API Testing

You can test the API using tools like Postman or curl:

### Example: Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890","password":"admin123"}'
```

### Example: Get Products (with token)
```bash
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running: `sudo service mysql status`
- Verify credentials in `.env` file
- Ensure database exists: `SHOW DATABASES;`

### Port Already in Use
- Change PORT in `.env` file
- Or kill process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:3000 | xargs kill -9
  ```

### JWT Token Invalid
- Check JWT_SECRET in `.env`
- Clear browser localStorage
- Login again

### CORS Errors
- Backend has CORS enabled by default
- If issues persist, check browser console
- Verify API_URL in `frontend/js/config.js`

## Production Deployment

### Backend

1. **Update Environment Variables**
   - Set strong JWT_SECRET
   - Use production database credentials
   - Set NODE_ENV=production

2. **Use Process Manager**
   ```bash
   npm install -g pm2
   pm2 start server.js --name pharma-api
   pm2 startup
   pm2 save
   ```

3. **Setup Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable HTTPS**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Frontend

Frontend is served by the backend, so no separate deployment needed.

If you want to serve frontend separately:
1. Update API_URL in `frontend/js/config.js`
2. Deploy frontend to static hosting (Netlify, Vercel, etc.)

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Use HTTPS in production
- [ ] Enable MySQL SSL connection
- [ ] Set up firewall rules
- [ ] Regular database backups
- [ ] Keep dependencies updated
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring

## Backup Database

```bash
# Backup
mysqldump -u root -p pharma_db > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p pharma_db < backup_20240101.sql
```

## Support

For issues or questions:
1. Check the README files in backend/ and frontend/
2. Review the API documentation
3. Check database schema in backend/database/schema.sql

## License

ISC
