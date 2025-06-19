const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // Your Gmail address
        pass: process.env.EMAIL_PASS,       // App password or email password
      },
    });

    const mailOptions = {
      from: `"Netram Optic" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
