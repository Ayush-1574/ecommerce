import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a password reset email with a styled HTML template
 * Falls back to console logging if SMTP credentials are not configured
 */
export const sendResetEmail = async (toEmail, resetLink) => {
  // If SMTP credentials are not configured, fall back to console logging
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("\n========================================");
    console.log("  PASSWORD RESET LINK (Mock Email)");
    console.log("  (Configure SMTP_USER & SMTP_PASS in .env for real emails)");
    console.log("========================================");
    console.log(`  To: ${toEmail}`);
    console.log(`  Link: ${resetLink}`);
    console.log("========================================\n");
    return { success: true, mock: true };
  }

  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const mailOptions = {
    from: `"ShopVerse" <${fromEmail}>`,
    to: toEmail,
    subject: "Reset Your Password - ShopVerse",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">ShopVerse</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 22px; font-weight: 600;">Reset Your Password</h2>
                    <p style="color: #64748b; font-size: 15px; line-height: 24px; margin: 0 0 24px;">
                      We received a request to reset the password for your ShopVerse account. Click the button below to create a new password. This link will expire in <strong>1 hour</strong>.
                    </p>
                    
                    <!-- Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%);">
                          <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; letter-spacing: 0.3px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #94a3b8; font-size: 13px; line-height: 20px; margin: 24px 0 0;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>

                    <!-- Fallback Link -->
                    <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                      <p style="color: #64748b; font-size: 12px; margin: 0 0 8px;">If the button doesn't work, copy and paste this link into your browser:</p>
                      <p style="color: #3b82f6; font-size: 12px; word-break: break-all; margin: 0;">
                        <a href="${resetLink}" style="color: #3b82f6;">${resetLink}</a>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                      &copy; ${new Date().getFullYear()} ShopVerse. All rights reserved.<br>
                      This is an automated email. Please do not reply.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${toEmail}`);
    return { success: true, mock: false };
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    // Fall back to console logging
    console.log("\n========================================");
    console.log("  PASSWORD RESET LINK (Email Failed - Fallback)");
    console.log("========================================");
    console.log(`  To: ${toEmail}`);
    console.log(`  Link: ${resetLink}`);
    console.log("========================================\n");
    return { success: true, mock: true, error: error.message };
  }
};
