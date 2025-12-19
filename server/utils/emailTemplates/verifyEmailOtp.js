const verifyEmailOtp = ({ firstName, otp }) => `
<!DOCTYPE html>
<html>
  <body style="background:#f9fafb;padding:24px;font-family:Arial,sans-serif;">
    <table width="100%" align="center">
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
      <tr>
        <td align="center">
          <table width="100%" style="max-width:420px;background:#fff;border-radius:12px;padding:24px;">
            
            <h2 style="margin-top:0;color:#111827;">Verify your email</h2>

            <p>Hi ${firstName || "there"},</p>

            <p>
              Welcome to <strong>FinPal</strong> 👋  
              Please use the OTP below to verify your email address.
            </p>

            <div style="
              text-align:center;
              font-size:32px;
              font-weight:bold;
              letter-spacing:6px;
              margin:24px 0;
              color:#2563eb;
            ">
              ${otp}
            </div>

            <p>
              This OTP will expire in <strong>1 day</strong>.
            </p>

            <p>
              If you didn’t create a FinPal account, you can ignore this email.
            </p>

            <p style="margin-top:32px;font-size:14px;">
              — Team FinPal
            </p>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = verifyEmailOtp;
