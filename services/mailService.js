// utils/mailService.js
import nodemailer from 'nodemailer';

// Replace these with environment variables in production
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.codequest@gmail.com', 
    pass: 'eufg qtzv imha gamw'
  }
});

export async function sendOTPEmail(toEmail, otp) {
  const mailOptions = {
    from: '"Code Quest" <your-email@gmail.com>',
    to: toEmail,
    subject: 'Your OTP Code for Login',
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2>OTP Verification</h2>
        <p>Hi,</p>
        <p>Please use the OTP below to login:</p>
        <h3 style="color:##6d28d4;">${otp}</h3>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}
