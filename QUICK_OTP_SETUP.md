# Quick OTP Setup - 5 Minutes

## Step 1: Get Gmail App Password (2 minutes)

1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" if not already enabled
3. Click "App passwords" (under "Signing in to Google")
4. Select: App = "Mail", Device = "Other (Custom name)"
5. Enter name: "Pharma System"
6. Click "Generate"
7. **Copy the 16-character password** (e.g., abcd efgh ijkl mnop)

## Step 2: Update .env File (1 minute)

Open `backend/.env` and add:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

Replace with your actual Gmail and app password (remove spaces from password).

## Step 3: Run Database Migration (1 minute)

Using TablePlus or any PostgreSQL client:
1. Connect to your database
2. Open SQL editor (Ctrl+T)
3. Copy content from `backend/database/add-otp-system.sql`
4. Paste and run (Ctrl+Enter)

## Step 4: Restart Server (30 seconds)

```bash
cd backend
npm start
```

## Step 5: Test (30 seconds)

1. Go to: http://localhost:3000/forgot-password.html
2. Enter phone, email, and role
3. Click "Send OTP"
4. Check your email
5. Enter OTP and new password
6. Done!

## For Render Deployment

Add environment variables in Render dashboard:
- `EMAIL_USER` = your-email@gmail.com
- `EMAIL_PASSWORD` = your-app-password

Then run the SQL migration on your Render PostgreSQL database.

## That's It!

Your OTP system is now live. Users can reset passwords securely via email.

## Need Help?

See detailed guide: `EMAIL_SETUP_GUIDE.md`
