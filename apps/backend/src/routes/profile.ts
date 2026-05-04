import express from 'express';
import { UserProfile } from '../models';
import { protect, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = express.Router();

// Create or Update profile
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { profileName, demographics, location, economic, social, family } = req.body;
    
    let profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.id, profileName },
      { demographics, location, economic, social, family },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: profile, message: 'Profile saved successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all profiles for current user
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const profiles = await UserProfile.find({ userId: req.user.id });
    res.json({ success: true, data: profiles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
