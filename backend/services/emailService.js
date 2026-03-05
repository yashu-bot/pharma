const { Resend } = require('resend');

// Initialize Resend only if API key is available
let resend = null;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
} else {
    console.warn('RESEND_API_KEY not configured. Email functionality will be disabled.');
}

// Send OTP Email
exports.sendOTPEmail = async (email, otp, userName) => {
    if (!resend) {
        console.error('Email service not configured. Cannot send OTP.');
        throw new Error('Email service not configured');
    }
    
    try {
        const { data, error } = await resend.emails.send({
            from: 'Pharma Management <onboarding@resend.dev>',
            to: email,
            subject: 'Password Reset OTP - Pharma Management',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px dashed #4F46E5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 8px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                        .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${userName || 'User'},</p>
                            <p>We received a request to reset your password. Use the OTP below to complete the process:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                                <div class="otp-code">${otp}</div>
                                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong><br>
                                • Do not share this OTP with anyone<br>
                                • This OTP will expire in 10 minutes<br>
                                • If you didn't request this, please ignore this email
                            </div>
                            
                            <p>If you have any questions, please contact our support team.</p>
                            
                            <p>Best regards,<br><strong>Pharma Management Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply to this message.</p>
                            <p>&copy; ${new Date().getFullYear()} Pharma Management System. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            throw new Error('Failed to send OTP email');
        }

        console.log('OTP Email sent via Resend:', data.id);
        return { success: true, messageId: data.id };
    } catch (error) {
        console.error('Error sending OTP email via Resend:', error);
        throw new Error('Failed to send OTP email');
    }
};

// Generate 6-digit OTP
exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
