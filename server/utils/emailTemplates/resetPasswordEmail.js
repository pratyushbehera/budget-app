const resetPasswordEmail = ({ firstName, resetUrl }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset your FinPal password</title>
  </head>
  <body style="margin:0;padding:0;background:#f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding:24px;">
                <img
                  src="https://budget-app-sigma-taupe.vercel.app/logo.png"
                  alt="FinPal"
                  width="64"
                  style="display:block;margin-bottom:8px;"
                />
                <h1 style="margin:0;font-size:24px;color:#111827;">
                  FinPal
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px;color:#374151;font-size:14px;line-height:1.6;">
                <p>Hi ${firstName || "there"},</p>

                <p>
                  We received a request to reset your <strong>FinPal</strong>
                  account password. Click the button below to choose a new one.
                </p>

                <div style="text-align:center;margin:32px 0;">
                  <a
                    href="${resetUrl}"
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      padding:12px 20px;
                      border-radius:8px;
                      font-size:16px;
                      display:inline-block;
                    "
                  >
                    Reset Password
                  </a>
                </div>

                <p>
                  This link will expire in <strong>10 minutes</strong> for your
                  security.
                </p>

                <p>
                  If you didn’t request a password reset, you can safely ignore
                  this email.
                </p>

                <p style="margin-top:32px;">
                  Stay financially confident,<br />
                  <strong>Team FinPal</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px;background:#f3f4f6;font-size:12px;color:#6b7280;text-align:center;">
                <p style="margin:0;">
                  Having trouble? Copy and paste this link into your browser:
                </p>
                <p style="word-break:break-all;margin:8px 0 0;">
                  ${resetUrl}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = resetPasswordEmail;
