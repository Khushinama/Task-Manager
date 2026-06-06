const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  try {
    // In production, use real credentials from process.env
    // For development, we can use a service like ethereal.email or a real SMTP if provided
    console.log('Using SMTP Host:', process.env.EMAIL_HOST, 'on Port:', process.env.EMAIL_PORT); // Debug log
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'TaskFlow - Email Verification OTP',
      text: `Your OTP for TaskFlow email verification is: ${otp}. It is valid for 10 minutes.`,
      html: `<h3>TaskFlow - Email Verification</h3>
             <p>Your OTP for email verification is: <strong>${otp}</strong></p>
             <p>It is valid for 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
    // console.log('OTP Email sent to', email);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Could not send OTP email');
  }
};

module.exports = { sendOTP };
