# 🚀 Quick Deployment to Render.com

## ✅ Pre-Deployment Checklist

- [x] PostgreSQL database configuration updated
- [x] render.yaml configured correctly
- [x] MySQL config backed up as `database-mysql.js`
- [ ] Code committed to Git
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] PostgreSQL database created on Render
- [ ] Database schema loaded
- [ ] Web service deployed

## 📝 Quick Steps

### 1. Commit and Push to GitHub

```bash
git add .
git commit -m "Ready for Render deployment with PostgreSQL"
git push origin main
```

### 2. Create Database on Render

1. Go to [render.com](https://render.com/dashboard)
2. Click "New +" → "PostgreSQL"
3. Settings:
   - Name: `pharma-db`
   - Database: `pharma_db_l3wg` (or any name)
   - User: `pharma_user`
   - Region: Oregon (or closest)
   - PostgreSQL Version: **16**
   - Plan: Free
4. Click "Create Database"
5. **Copy the Internal Database URL**

### 3. Load Database Schema

Connect to your database and run the schema:

```bash
# Option 1: Using psql command from Render
psql <INTERNAL_DATABASE_URL>
\i backend/database/schema-postgres.sql
\q

# Option 2: Copy-paste SQL content
# Go to Render Dashboard → Your Database → "Connect" → "PSQL Command"
# Then paste the content of backend/database/schema-postgres.sql
```

### 4. Deploy Web Service

**Using Blueprint (Recommended):**

1. Click "New +" → "Blueprint"
2. Connect your GitHub repo
3. Render detects `render.yaml` automatically
4. Click "Apply"
5. Wait for deployment (5-10 minutes)

**Manual Setup:**

1. Click "New +" → "Web Service"
2. Connect GitHub repo
3. Settings:
   - Name: `pharma-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (see below)

### 5. Environment Variables

Add these in Render dashboard:

```
NODE_ENV=production
PORT=3000
DB_HOST=<from database internal URL>
DB_USER=pharma_user
DB_PASSWORD=<from database internal URL>
DB_NAME=pharma_db_l3wg
DB_PORT=5432
JWT_SECRET=<generate random string>
JWT_EXPIRE=7d
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Update Frontend API URL

Once deployed, update `frontend/js/config.js`:

```javascript
const API_URL = 'https://your-app-name.onrender.com/api';
```

Commit and push again:
```bash
git add frontend/js/config.js
git commit -m "Update API URL for production"
git push
```

### 7. Test Your Deployment

1. Visit: `https://your-app-name.onrender.com`
2. Test health: `https://your-app-name.onrender.com/api/health`
3. Login with default admin:
   - Phone: `1234567890`
   - Password: `admin123`

## 🎯 Your Current Database

You already created a database with these details:
- **Connection String:** `postgresql://pharma_user:y9cSjbeS6NZ2ADh82cpCIxL5nf4KqqjF@dpg-d6hkc0i4d50c73fdc7p0-a.oregon-postgres.render.com/pharma_db_l3wg`
- **Host:** `dpg-d6hkc0i4d50c73fdc7p0-a.oregon-postgres.render.com`
- **User:** `pharma_user`
- **Password:** `y9cSjbeS6NZ2ADh82cpCIxL5nf4KqqjF`
- **Database:** `pharma_db_l3wg`
- **Port:** `5432`

### Load Schema to Your Database

```bash
psql postgresql://pharma_user:y9cSjbeS6NZ2ADh82cpCIxL5nf4KqqjF@dpg-d6hkc0i4d50c73fdc7p0-a.oregon-postgres.render.com/pharma_db_l3wg

# Once connected:
\i backend/database/schema-postgres.sql
\q
```

## 🔧 Troubleshooting

### Build Failed: "cd: backend: No such file or directory"
✅ **FIXED!** Updated `render.yaml` to use `rootDir: backend` instead of `cd backend`

### Database Connection Error
- Use **Internal Database URL** (not External)
- Verify all DB_* environment variables are correct
- Ensure database and web service are in same region

### App Sleeps After 15 Minutes
- Free tier limitation
- First request takes 30-50 seconds to wake up
- Upgrade to paid plan ($7/month) for always-on

## 📚 Full Documentation

For detailed instructions, see:
- `RENDER_DEPLOYMENT.md` - Complete deployment guide
- `DEPLOYMENT_GUIDE.md` - General hosting options
- `README.md` - Project overview

## 🎉 Done!

Your Pharma Management System should now be live on Render!

**Next Steps:**
1. Change default admin password
2. Add workers and users
3. Add products and sections
4. Start taking orders!

Need help? Check the logs in Render dashboard or review the full deployment guide.
