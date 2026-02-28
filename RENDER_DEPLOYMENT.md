# Deploy to Render.com - Step by Step Guide

## 📋 Prerequisites

1. GitHub account
2. Render.com account (sign up at [render.com](https://render.com))
3. Your code pushed to GitHub

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Pharma Management System - Ready for deployment"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/pharma-management.git

# Push to GitHub
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 3: Create PostgreSQL Database

1. Click "New +" button
2. Select "PostgreSQL"
3. Fill in details:
   - **Name:** `pharma-db`
   - **Database:** `pharma_db`
   - **User:** `pharma_user`
   - **Region:** Choose closest to you
   - **Plan:** Free
4. Click "Create Database"
5. Wait for database to be created (2-3 minutes)
6. **IMPORTANT:** Copy the "Internal Database URL" - you'll need this!

### Step 4: Run Database Schema

1. In Render dashboard, go to your database
2. Click "Connect" → "External Connection"
3. Copy the PSQL Command
4. Open your terminal and run:

```bash
# Connect to database (paste the PSQL command from Render)
psql -h dpg-xxxxx-a.oregon-postgres.render.com -U pharma_user pharma_db

# Once connected, run the schema
\i backend/database/schema-postgres.sql

# Or copy-paste the SQL content directly
```

Alternatively, use a PostgreSQL client like:
- **pgAdmin** (GUI tool)
- **DBeaver** (Universal database tool)
- **TablePlus** (Mac/Windows)

### Step 5: Create Web Service

**OPTION A: Using render.yaml (Recommended)**

1. Ensure `render.yaml` is in your repository root
2. Click "New +" button → "Blueprint"
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` and create services
5. Review and click "Apply"

**OPTION B: Manual Setup**

1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub repository
4. Fill in details:
   - **Name:** `pharma-backend`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 6: Add Environment Variables

In the "Environment" section, add these variables:

```
NODE_ENV=production
PORT=3000
DB_HOST=<from database internal connection>
DB_USER=pharma_user
DB_PASSWORD=<from database connection>
DB_NAME=pharma_db
DB_PORT=5432
JWT_SECRET=<generate a random string>
JWT_EXPIRE=7d
```

**To get database connection details:**
1. Go to your database in Render
2. Click "Connect"
3. Copy values from "Internal Database URL"

**To generate JWT_SECRET:**
```bash
# Run this in terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 7: Database Configuration (Already Done!)

✅ The project has been updated to use PostgreSQL:
- `backend/config/database.js` now uses PostgreSQL adapter
- MySQL version backed up as `backend/config/database-mysql.js`
- `render.yaml` configured with correct build commands

No action needed - just commit and push!

### Step 8: Deploy

1. Click "Create Web Service"
2. Render will start building and deploying
3. Wait 5-10 minutes for first deployment
4. Check logs for any errors

### Step 9: Update Frontend API URL

Once deployed, Render gives you a URL like: `https://pharma-backend.onrender.com`

Update `frontend/js/config.js`:

```javascript
const API_URL = 'https://pharma-backend.onrender.com/api';
```

### Step 10: Deploy Frontend (Optional)

You can deploy frontend separately to Render as a Static Site:

1. Click "New +" → "Static Site"
2. Connect same repository
3. Settings:
   - **Name:** `pharma-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** Leave empty
   - **Publish Directory:** `.`
4. Click "Create Static Site"

Or use the backend to serve frontend (already configured).

## ✅ Verify Deployment

1. Visit your backend URL: `https://pharma-backend.onrender.com`
2. Test health endpoint: `https://pharma-backend.onrender.com/api/health`
3. Try logging in with default admin:
   - Phone: `1234567890`
   - Password: `admin123`

## 🔧 Troubleshooting

### Database Connection Error

**Error:** "Connection refused" or "ECONNREFUSED"

**Solution:**
- Use **Internal Database URL** (not External)
- Check DB_HOST, DB_USER, DB_PASSWORD are correct
- Ensure database is in same region as web service

### Build Failed

**Error:** "npm install failed"

**Solution:**
- Check `package.json` is in `backend/` folder
- Verify build command: `cd backend && npm install`
- Check logs for specific error

### App Crashes on Start

**Error:** "Application failed to respond"

**Solution:**
- Check start command: `cd backend && npm start`
- Verify PORT environment variable is set
- Check logs for errors
- Ensure database schema is loaded

### CORS Error

**Error:** "Access-Control-Allow-Origin"

**Solution:**
Update `backend/server.js`:
```javascript
app.use(cors({
    origin: ['https://pharma-frontend.onrender.com', 'https://pharma-backend.onrender.com'],
    credentials: true
}));
```

### Service Sleeps After 15 Minutes

**Note:** Free tier services sleep after 15 minutes of inactivity.

**Solution:**
- First request takes 30-50 seconds to wake up
- Upgrade to paid plan ($7/month) for always-on
- Or use a service like UptimeRobot to ping every 14 minutes

## 📊 Monitor Your App

1. Go to Render Dashboard
2. Click on your service
3. View:
   - **Logs:** Real-time application logs
   - **Metrics:** CPU, Memory usage
   - **Events:** Deployment history

## 🔒 Security Checklist

- [x] Changed default admin password
- [x] Set strong JWT_SECRET
- [x] Enabled HTTPS (automatic on Render)
- [x] Set NODE_ENV=production
- [x] Database password is secure
- [x] CORS configured properly

## 💰 Free Tier Limits

- **Web Service:** 750 hours/month (enough for 1 service)
- **Database:** 1 GB storage, 97 hours/month
- **Bandwidth:** 100 GB/month
- **Build Minutes:** 500 minutes/month

**Note:** Service sleeps after 15 min inactivity (wakes in 30-50 seconds)

## 🎉 Your App is Live!

Your Pharma Management System is now deployed at:
- **Backend:** `https://pharma-backend.onrender.com`
- **Frontend:** `https://pharma-backend.onrender.com` (served by backend)

Share the URL and start using your app! 🚀

## 📞 Need Help?

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Check deployment logs in Render dashboard
- Review `backend/logs` for application errors

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Render auto-deploys in 2-5 minutes
```

## 🎯 Next Steps

1. Test all features thoroughly
2. Change default admin password
3. Add your workers and users
4. Add products and sections
5. Test ordering workflow
6. Share with your team!

Congratulations! Your Pharma Management System is now live on Render! 🎊
