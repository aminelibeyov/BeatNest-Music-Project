const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

let transporter;

if (isDevelopment) {
  // Mock transporter for development - logs emails instead of sending
  transporter = {
    sendMail: async (mailOptions) => {
      const logsDir = path.join(__dirname, '../../logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      const emailLog = `
========================================
📧 EMAIL (Development Mode - Not Sent)
========================================
TO: ${mailOptions.to}
SUBJECT: ${mailOptions.subject}
FROM: ${mailOptions.from}
TIME: ${new Date().toISOString()}
----------------------------------------
${mailOptions.html}
========================================

`;
      
      const logsFile = path.join(logsDir, 'emails.log');
      fs.appendFileSync(logsFile, emailLog);
      console.log(`✅ Email logged to logs/emails.log - TO: ${mailOptions.to}`);
      
      return { response: 'Email logged in development mode', messageId: `dev-${Date.now()}` };
    }
  };
} else {
  // Real Gmail transporter for production
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@beatnest.com',
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    if (!isDevelopment) {
      console.log('✅ Real email sent:', info.response);
    }
    return info;
  } catch (error) {
    console.error('❌ Error with email:', error.message);
    if (!isDevelopment) {
      throw error;
    }
    // In development, don't throw - just log the error
    return { response: 'Email service error (dev mode)', messageId: `error-${Date.now()}` };
  }
};

const sendVerificationEmail = async (email, verificationToken, userName) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">🎵 BeatNest Email Verification</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Thank you for signing up at BeatNest! Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          ✓ Verify Email
        </a>
      </div>
      <p style="color: #666; font-size: 12px;">Or copy this link: <br>${verificationLink}</p>
      <p style="color: #ff6b6b; font-weight: bold;">⏰ This link will expire in 24 hours.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">© 2026 BeatNest Music Platform. All rights reserved.</p>
    </div>
  `;

  return sendEmail(email, '🎵 Verify Your BeatNest Account', htmlContent);
};

const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">🔐 Password Reset Request</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          🔓 Reset Password
        </a>
      </div>
      <p style="color: #666; font-size: 12px;">Or copy this link: <br>${resetLink}</p>
      <p style="color: #ff6b6b; font-weight: bold;">⏰ This link will expire in 1 hour.</p>
      <p style="color: #666; margin-top: 20px;">If you didn't request this password reset, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">© 2026 BeatNest Music Platform. All rights reserved.</p>
    </div>
  `;

  return sendEmail(email, '🔐 Reset Your BeatNest Password', htmlContent);
};

const sendWelcomeEmail = async (email, userName) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">🎵 Welcome to BeatNest!</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Welcome to <strong>BeatNest</strong> - Your Ultimate Music Streaming Platform! 🎧</p>
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
        <h3 style="color: #22c55e; margin-top: 0;">Get Started:</h3>
        <ul style="color: #333; line-height: 1.8;">
          <li>🔍 Search for your favorite songs and artists</li>
          <li>❤️ Add songs to your wishlist and favorites</li>
          <li>🎤 Create and manage your own playlists</li>
          <li>⭐ Discover trending music and new artists</li>
          <li>🎵 Stream unlimited music content</li>
        </ul>
      </div>
      <p style="color: #666;">Happy listening! 🎧</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">© 2026 BeatNest Music Platform. All rights reserved.</p>
    </div>
  `;

  return sendEmail(email, '🎵 Welcome to BeatNest!', htmlContent);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
