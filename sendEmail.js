import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();                               

const sendEmail = async (to, subject, html) => {
  try {
   const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // use 587 for TLS
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    });

    const mailOptions = {
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendEmail;