export function verifyEmailTemplate(name: string, link: string) {
  return `
  <div style="font-family:sans-serif">
    <h2>Verify Your Account</h2>

    <p>Hi ${name},</p>

    <p>Please verify your email:</p>

    <a href="${link}"
       style="
         padding:12px 20px;
         background:#0f172a;
         color:#fff;
         text-decoration:none;
         border-radius:6px;
       ">
      Verify Email
    </a>

    <p>This link expires in 24 hours.</p>
  </div>
  `;
}

export function resetPasswordTemplate(name: string, link: string) {
  return `
  <div style="font-family:sans-serif">
    <h2>Reset Password</h2>

    <p>Hi ${name},</p>

    <p>Click below to reset password:</p>

    <a href="${link}"
       style="
         padding:12px 20px;
         background:#991b1b;
         color:#fff;
         text-decoration:none;
         border-radius:6px;
       ">
      Reset Password
    </a>

    <p>Expires in 1 hour.</p>
  </div>
  `;
}
