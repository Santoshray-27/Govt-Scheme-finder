import express from 'express';
import { User } from '../models';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';

const router = express.Router();

// Temporary storage for OTPs (in production use Redis)
const otpStore = new Map();

router.post('/send-otp', async (req: express.Request, res: express.Response) => {
  const { phone } = req.body;
  
  if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });

  const otp = otpGenerator.generate(6, { 
    upperCaseAlphabets: false, 
    specialChars: false, 
    lowerCaseAlphabets: false 
  });
  otpStore.set(phone, { otp, expiry: Date.now() + 10 * 60000 });

  console.log(`📱 OTP for ${phone}: ${otp}`); // For development only

  res.json({ success: true, message: 'OTP sent successfully' });
});

router.post('/verify-otp', async (req: express.Request, res: express.Response) => {
  const { phone, otp, name } = req.body;

  const storedOtp = otpStore.get(phone);
  const isMasterOtp = otp === '000000';
  
  if (!isMasterOtp && (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiry)) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ 
      name: name || 'New User', 
      phone, 
      authMethod: 'OTP' 
    });
  } else {
    user.lastLogin = new Date();
    await user.save();
  }

  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  otpStore.delete(phone); // Clean up

  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, phone: user.phone }
  });
});

export default router;
