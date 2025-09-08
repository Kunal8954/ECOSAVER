require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const otpStore = {}; // In-memory for demo

app.post('/send-otp', async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ error: 'Mobile required' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[mobile] = otp;
  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile
    });
    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/verify-otp', (req, res) => {
  const { mobile, otp } = req.body;
  if (otpStore[mobile] === otp) {
    delete otpStore[mobile];
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

app.listen(3000, () => console.log('OTP server running on port 3000'));
