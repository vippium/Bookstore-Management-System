function getOtpEmailTemplate({ name, otp, type = "register" }) {
    const heading =
        type === "login" ?
        "Login Verification" :
        "Verify Your Bookstore Account";

    const subText =
        type === "login" ?
        "You tried logging in, but your email isn’t verified yet." :
        "Thanks for registering. Please verify your email.";

    return `
    <div style="font-family: Arial, sans-serif; color:#111; max-width:600px; margin:0 auto; padding:20px;">
      <h2 style="color:#2563eb;">${heading}</h2>
      <p style="font-size:16px;">Hi ${name || "there"},</p>
      <p style="font-size:16px;">${subText}</p>

      <div style="font-size:28px; font-weight:bold; background:#f1f5f9; padding:15px; text-align:center; border-radius:8px; margin:20px 0;">
        ${otp}
      </div>

      <p style="font-size:14px; color:#555;">This OTP will expire in <b>15 minutes</b>.</p>
      <p style="font-size:14px; color:#555;">If you didn’t request this, you can safely ignore this email.</p>

      <hr style="margin:30px 0; border:0; border-top:1px solid #eee;" />
      <p style="font-size:12px; color:#aaa; text-align:center;">📚 Vipin's Bookstore</p>
    </div>
  `;
}

module.exports = { getOtpEmailTemplate };