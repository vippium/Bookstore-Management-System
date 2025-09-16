const nodemailer = require("nodemailer");

const sendEmail = async({ to, subject, html, attachments = [] }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.verify().catch(() => {
            console.warn("⚠️ Email transporter verification failed.");
        });

        return transporter.sendMail({
            from: `"Bookstore 📚" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        });
    } catch (err) {
        console.error("❌ Email sending failed:", err.message);
        // ⛔️ don’t throw, just log
        return null;
    }
};

module.exports = sendEmail;