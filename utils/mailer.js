const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


module.exports = async (email, subject, content) => {
    try {
        console.log("Sending email to:", email); 
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: content,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email} with subject "${subject}"`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw error;
    }
};
