# Email OTP Password Reset Feature

## Overview
Secure password reset system using email-based One-Time Password (OTP) verification.

## Features
- ✅ 6-digit OTP generation
- ✅ Email delivery via Gmail SMTP
- ✅ 10-minute OTP expiration
- ✅ One-time use OTP
- ✅ Beautiful HTML email template
- ✅ Support for all roles (Admin, Worker, User)
- ✅ Resend OTP functionality
- ✅ Security warnings in email

## API Endpoints

### 1. Request OTP
**POST** `/auth/request-otp`

Request body:
```json
{
  "phone": "1234567890",
  "email": "user@example.com",
  "role": "user"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP sent to your email successfully. Valid for 10 minutes."
}
```

### 2. Verify OTP and Reset Password
**POST** `/auth/verify-otp-reset`

Request body:
```json
{
  "phone": "1234567890",
  "email": "user@example.com",
  "role": "user",
  "otp": "123456",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

## Database Schema

### password_reset_otps Table
```sql
CREATE TABLE password_reset_otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Email Template
The OTP email includes:
- Professional header with gradient background
- Large, centered OTP code
- 10-minute validity notice
- Security warnings
- Responsive design
- Company branding

## Security Features

1. **Time-based Expiration**: OTP expires after 10 minutes
2. **Single Use**: OTP can only be used once
3. **Auto Cleanup**: Old OTPs are deleted when requesting new one
4. **Verification**: Requires phone + email + role match
5. **Password Validation**: Minimum 6 characters
6. **Secure Storage**: OTP stored in database, not in memory

## Configuration

Required environment variables in `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

## Files Modified/Created

### New Files:
- `backend/services/emailService.js` - Email sending service
- `backend/database/add-otp-system.sql` - Database migration
- `EMAIL_SETUP_GUIDE.md` - Setup instructions

### Modified Files:
- `backend/controllers/authController.js` - Added OTP methods
- `backend/routes/authRoutes.js` - Added OTP routes
- `backend/public/forgot-password.html` - New OTP UI
- `backend/.env.example` - Added email config

## Usage Flow

1. User clicks "Forgot Password"
2. Enters phone, email, and selects role
3. Clicks "Send OTP"
4. System validates user exists
5. Generates 6-digit OTP
6. Stores OTP in database with expiration
7. Sends email with OTP
8. User receives email and enters OTP
9. User enters new password
10. System verifies OTP is valid and not expired
11. Updates password and marks OTP as used
12. User can login with new password

## Error Handling

- Invalid phone/email combination
- Expired OTP
- Already used OTP
- Password mismatch
- Email sending failure
- Database errors

## Testing Checklist

- [ ] Request OTP with valid credentials
- [ ] Receive email with OTP
- [ ] Verify OTP and reset password
- [ ] Login with new password
- [ ] Test expired OTP (wait 10 minutes)
- [ ] Test invalid OTP
- [ ] Test resend OTP functionality
- [ ] Test with all roles (admin, worker, user)
- [ ] Test password validation
- [ ] Test email not found scenario

## Future Enhancements

1. Rate limiting for OTP requests
2. SMS OTP as backup option
3. CAPTCHA to prevent abuse
4. Email verification during registration
5. Password strength meter
6. Account lockout after failed attempts
7. Audit log for password resets
8. Custom email templates per role
9. Multi-language support
10. Push notification option

## Maintenance

### Clean up expired OTPs:
```sql
DELETE FROM password_reset_otps 
WHERE expires_at < CURRENT_TIMESTAMP 
OR is_used = TRUE;
```

Run this periodically (e.g., daily cron job) to keep database clean.

## Support

For issues or questions:
1. Check EMAIL_SETUP_GUIDE.md
2. Verify environment variables
3. Check server logs
4. Test email configuration
5. Verify database migration
