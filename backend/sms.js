// Sends the OTP SMS. Pick the provider with SMS_PROVIDER in .env:
//   (unset)   -> dev mode, OTP printed in the server console
//   fast2sms  -> needs FAST2SMS_API_KEY
//   twilio    -> needs TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM
export async function sendOtpSms(phone, otp) {
  const provider = process.env.SMS_PROVIDER;

  if (provider === 'fast2sms') {
    const url = new URL('https://www.fast2sms.com/dev/bulkV2');
    url.search = new URLSearchParams({
      authorization: process.env.FAST2SMS_API_KEY,
      route: 'otp',
      variables_values: otp,
      numbers: phone,
      flash: '0'
    });
    const r = await fetch(url);
    const data = await r.json();
    if (!data.return) throw new Error(data.message || 'Fast2SMS failed');
    return;
  }

  if (provider === 'twilio') {
    const { TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM } = process.env;
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: `+91${phone}`,
        From: TWILIO_FROM,
        Body: `Your Eco-Saathi OTP is ${otp}. Valid for 5 minutes.`
      })
    });
    if (!r.ok) throw new Error(`Twilio error ${r.status}`);
    return;
  }

  console.log(`[DEV OTP] ${phone} -> ${otp}`);
}
