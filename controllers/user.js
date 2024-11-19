const User = require('../models/user');
const sendEmail = require('../utils/mailer');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } = require('../middlewares/validation');

module.exports = {
    register: async (req, res, next) => {
        try {
            validateRegister(req.body);
            await User.create(req.body);

            await sendEmail(
                req.body.email,
                'Welcome to Our Platform!',
                `Hi ${req.body.fullName},\n\nThank you for registering on our platform!`
            );
            res.redirect('/api/login');

        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            validateLogin(req.body);
            const user = await User.login(req.body);

            res.status(200).json({
                status: 'OK',
                message: 'Login successful',
                data: user,
            });
        } catch (err) {
            next(err);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            if (!req.body.email) {
                return res.status(400).json({ message: 'Email is required' });
            }
    
            validateForgotPassword(req.body);
    
            const resetToken = await User.generatePasswordResetToken(req.body.email);
            const resetUrl = `${req.protocol}://${req.get('host')}/api/reset-password?token=${resetToken}`;
    
            const emailContent = `
                <html>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                            <h2 style="color: #333;">Password Reset Request</h2>
                            <p style="color: #555;">Hello,</p>
                            <p style="color: #555;">We received a request to reset your password. You can reset your password by clicking the button below:</p>
                            <p style="text-align: center;">
                                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-size: 16px;">
                                    Reset My Password
                                </a>
                            </p>
                            <p style="color: #555;">This link will expire in 1 hour.</p>
                            <p style="color: #555;">If you did not request a password reset, please ignore this email.</p>
                        </div>
                    </body>
                </html>
            `;
    
            const recipientEmail = req.body.email;
            console.log(`Sending email to: ${recipientEmail}`);
    
            await sendEmail(recipientEmail, 'Password Reset Request', emailContent);
    
            res.redirect('/api/login');
    
        } catch (err) {
            next(err);
        }
    },
     
    resetPassword: async (req, res, next) => {
        try {
            console.log('Request body:', req.body);
            if (!req.body.email) {
                return res.status(400).json({ message: 'Email is required' });
            }
    
            validateResetPassword(req.body);
    
            await User.resetPassword(req.body);
    
            await sendEmail(
                req.body.email,
                'Password Changed Successfully',
                'Your password has been successfully updated. If you did not initiate this change, please contact support immediately.'
            );
    
            res.redirect('/api/login');
    
        } catch (err) {
            next(err);
        }
    },
    
};
