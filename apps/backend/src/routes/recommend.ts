import express from 'express';
import { UserProfile } from '../models';
import { protect, AuthRequest } from '../middleware/auth';
import { Response } from 'express';
import { getRecommendations } from '../services/ragService';

const router = express.Router();

router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { userProfileId } = req.body;
    
    if (!userProfileId) {
      return res.status(400).json({ success: false, message: 'UserProfileId is required' });
    }

    const profile = await UserProfile.findOne({ _id: userProfileId, userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const recommendations = await getRecommendations(profile);

    res.json({ 
      success: true, 
      data: recommendations, 
      message: 'Recommendations generated successfully' 
    });
  } catch (error: any) {
    console.error('Recommendation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
