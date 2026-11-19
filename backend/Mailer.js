import nodemailer from 'nodemailer';

// Sends the login code by email using a Gmail account.
// Set these in .env to send real emails:
//   GMAIL_USER=youraddress@gmail.com
//   GMAIL_APP_PASSWORD=16-letter app password (NOT your normal Gmail password)
// If they are not set, dev mode is used: the code is printed in the server console.
let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
  return transporter;
}

export async function sendOtpEmail(email, otp) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`[DEV OTP] ${email} -> ${otp}`);
    return;
  }

  await getTransporter().sendMail({
    from: `"Eco-Saathi" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your Eco-Saathi login code',
    text: `Your Eco-Saathi login code is ${otp}. It is valid for 5 minutes. If you did not request it, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:420px">
      <h2 style="color:#15803d">Eco-Saathi</h2>
      <p>Your login code is:</p>
      <p style="font-size:32px;letter-spacing:6px;font-weight:bold">${otp}</p>
      <p style="color:#666;font-size:13px">Valid for 5 minutes. If you did not request this, you can ignore this email.</p>
    </div>`
  });
}
