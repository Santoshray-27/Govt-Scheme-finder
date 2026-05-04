import express from 'express';
import { Scheme } from '../models';

const router = express.Router();

// Get all active schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).select('-embedding');
    res.json({ success: true, data: schemes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get scheme by ID
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id).select('-embedding');
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, data: scheme });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
