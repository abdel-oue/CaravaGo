import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"CaravaGo Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request - CaravaGo',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password for your CaravaGo account.</p>
          <p>Please click the button below to reset your password. This link will expire in 10 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The CaravaGo Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            This email was sent to ${email}. If you have any questions, please contact our support team.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send email verification email with 6-digit code and clickable link
// Send email verification email with 6-digit code and clickable link
export const sendEmailVerificationEmail = async (email, verificationToken, verificationCode, userName) => {
  try {
    const transporter = createTransporter();

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"CaravaGo Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify Your CaravaGo Account',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Welcome to CaravaGo!</h2>
          <p>Hello ${userName},</p>
          <p>Thank you for signing up for CaravaGo! To complete your registration, please verify your email address.</p>

          <h3 style="color: #333;">Option 1: Use this 6-digit code</h3>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <div style="font-size: 24px; font-weight: bold; color: #333; font-family: monospace; letter-spacing: 2px;">${verificationCode}</div>
          </div>
          <p>Enter this code on the verification page to activate your account.</p>

          <h3 style="color: #333;">Option 2: Click the verify button</h3>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}"
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify My Email
            </a>
          </div>

          <p>Both options will expire in 24 hours for your security.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <p>Best regards,<br>The CaravaGo Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            This email was sent to ${email}. If you have any questions, please contact our support team.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email verification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email verification email:', error);
    throw new Error('Failed to send email verification email');
  }
};

// Send password reset success email
export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CaravaGo Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Successful - CaravaGo',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Password Reset Successful</h2>
          <p>Hello,</p>
          <p>Your password has been successfully reset for your CaravaGo account.</p>
          <p>If you didn't make this change, please contact our support team immediately.</p>
          <p>You can now log in with your new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login"
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Log In Now
            </a>
          </div>
          <p>Best regards,<br>The CaravaGo Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            This email was sent to ${email}.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    throw new Error('Failed to send password reset success email');
  }
};
