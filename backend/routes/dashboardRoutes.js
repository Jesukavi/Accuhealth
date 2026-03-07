import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authenticateToken, (req, res) => {
  res.json({
    totalNotifications: 12356,
    confirmedCases: 8240,
    suspectedCases: 4116,
    regionsCovered: 100
  });
});

router.get('/cases-by-governorate', authenticateToken, (req, res) => {
  res.json([
    { name: 'Khartoum', cases: 921 },
    { name: 'Aljazeera', cases: 800 },
    { name: 'Kassala', cases: 658 },
    { name: 'Elgedarf', cases: 250 },
    { name: 'Kordofan', cases: 620 },
    { name: 'Darfur', cases: 700 },
    { name: 'Port Sudan', cases: 860 }
  ]);
});

router.get('/top-affected-regions', authenticateToken, (req, res) => {
  res.json([
    { name: 'Khartoum', cases: 921 },
    { name: 'Aljazeera', cases: 800 },
    { name: 'Kassala', cases: 658 },
    { name: 'Elgedarf', cases: 250 },
    { name: 'Kordofan', cases: 620 },
     { name: 'Darfur', cases: 700 },
    { name: 'Port Sudan', cases: 860 }
  ]);
});
    


export default router;
