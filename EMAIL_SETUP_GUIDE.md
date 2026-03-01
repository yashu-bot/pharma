# Email OTP Setup Guide

## Overview
The system now supports email-based OTP (One-Time Password) for secure password reset. This guide will help you configure Gmail to send OTP emails.

## Prerequisites
- A Gmail account
- Access to Google Account settings

## Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to enable 2-Step Verification

## Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to Security settings
2. Under "Signing in to Google", click on "App passwords"
3. You may need to sign in again
4. In the "Select app" dropdown, choose "Mail"
5. In the "Select device" dropdown, choose "Other (Custom name)"
6. Enter "Pharma Management System" as the name
7. Click "Generate"
8. Google will display a 16-character password (e.g., "abcd efgh ijkl mnop")
9. **Copy this password** - you'll need it for the .env file

## Step 3: Configure Environment Variables

1. Open your `backend/.env` file
2. Add or update these lines:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with the 16-character app password (remove spaces)

Example:
```env
EMAIL_USER=pharmamanagement@gmail.com
EMAIL_PASSWORD=xyzw1234abcd5678
```

## Step 4: Update Render Environment Variables

If deploying to Render.com:

1. Go to your Render dashboard
2. Select your web service
3. Click on "Environment" in the left sidebar
4. Add two new environment variables:
   - Key: `EMAIL_USER`, Value: your-email@gmail.com
   - Key: `EMAIL_PASSWORD`, Value: your-app-password
5. Click "Save Changes"
6. Your service will automatically redeploy

## Step 5: Run Database Migration

Execute the SQL migration to add OTP table and email fields:

```bash
# Using TablePlus or any PostgreSQL client
# Connect to your database and run:
backend/database/add-otp-system.sql
```

Or using psql command line:
```bash
psql -h your-host -U your-user -d your-database -f backend/database/add-otp-system.sql
```

## How It Works

### User Flow:
1. User goes to "Forgot Password" page
2. Enters phone number, email, and selects role
3. Clicks "Send OTP"
4. System sends 6-digit OTP to user's email
5. User enters OTP and new password
6. System verifies OTP and updates password
7. User can login with new password

### Security Features:
- OTP expires after 10 minutes
- OTP can only be used once
- Old OTPs are automatically deleted when requesting new one
- Beautiful HTML email template with security warnings
- Password must be at least 6 characters

## Testing

1. Make sure email configuration is correct in .env
2. Restart your server: `npm start`
3. Go to forgot password page
4. Enter valid phone, email, and role
5. Check your email inbox for OTP
6. Enter OTP and new password
7. Login with new credentials

## Troubleshooting

### "Failed to send OTP" error:
- Check if EMAIL_USER and EMAIL_PASSWORD are set correctly in .env
- Verify 2-Step Verification is enabled on Gmail
- Ensure App Password is generated and copied correctly (no spaces)
- Check if "Less secure app access" is NOT enabled (use App Password instead)

### "Invalid or expired OTP":
- OTP expires after 10 minutes
- Each OTP can only be used once
- Request a new OTP if expired

### Email not received:
- Check spam/junk folder
- Verify email address is correct
- Check Gmail account has not reached sending limits (500 emails/day)
- Check server logs for error messages

## Email Sending Limits

Gmail free accounts have these limits:
- 500 emails per day
- 100 emails per hour (approximately)

For production with high volume, consider:
- Google Workspace (paid)
- SendGrid
- AWS SES
- Mailgun

## Security Best Practices

1. Never commit .env file to Git
2. Use strong app passwords
3. Rotate app passwords periodically
4. Monitor email sending logs
5. Implement rate limiting for OTP requests
6. Add CAPTCHA to prevent abuse

## Support

If you encounter issues:
1. Check server logs: `npm start` output
2. Verify database migration ran successfully
3. Test email configuration with a simple test script
4. Check Render logs if deployed

## Next Steps

After setup:
1. Test the complete flow
2. Customize email template if needed (backend/services/emailService.js)
3. Add rate limiting to prevent OTP spam
4. Consider adding SMS OTP as backup option
