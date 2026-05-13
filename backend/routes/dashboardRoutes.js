import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import sequelize from '../config/db_sequelize.js';

// Import all disease models
import Malaria from '../models/Malaria.js';
import TB from '../models/TB.js';
import FeverRash from '../models/FeverRash.js';
import ARI from '../models/ARI.js';
import Polio from '../models/Polio.js';
import Hemorrhagic from '../models/Hemorrhagic.js';

const router = express.Router();
const models = [Malaria, TB, FeverRash, ARI, Polio, Hemorrhagic];

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const counts = await Promise.all(models.map(model => model.count()));
    const totalNotifications = counts.reduce((a, b) => a + b, 0);

    // Calculate suspected vs confirmed by looking at real data "status" or "outcome" if possible
    // For now we use realistic mock splits based on the real total, but let's try to query real pending counts:
    const pendingCounts = await Promise.all(
      models.map(model => model.count({ where: { status: 'Pending' } }).catch(() => 0))
    );
    const suspectedCases = pendingCounts.reduce((a, b) => a + b, 0);
    const confirmedCases = totalNotifications - suspectedCases;

    // Get unique regions across all models
    let regionsSet = new Set();
    for (const model of models) {
      const govs = await model.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('governorate')), 'governorate']],
        raw: true
      });
      govs.forEach(g => {
        if (g.governorate) regionsSet.add(g.governorate.trim());
      });
    }

    res.json({
      totalNotifications,
      confirmedCases,
      suspectedCases,
      regionsCovered: regionsSet.size || 0
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch real-time stats' });
  }
});

router.get('/cases-by-governorate', authenticateToken, async (req, res) => {
  try {
    let govMap = {};

    for (const model of models) {
      const counts = await model.findAll({
        attributes: ['governorate', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['governorate'],
        raw: true
      }).catch(() => []); // catch safely in case column doesn't exist on one model

      counts.forEach(c => {
        if (!c.governorate) return;
        const gov = c.governorate.trim();
        govMap[gov] = (govMap[gov] || 0) + parseInt(c.count, 10);
      });
    }

    let data = Object.keys(govMap).map(name => ({
      name,
      cases: govMap[name]
    })).sort((a, b) => b.cases - a.cases);

    if (data.length === 0) {
      data = [{ name: 'No Data Yet', cases: 0 }];
    }

    res.json(data);
  } catch (error) {
    console.error('Governorate cases error:', error);
    res.status(500).json({ error: 'Failed to fetch cases by governorate' });
  }
});

router.get('/top-affected-regions', authenticateToken, async (req, res) => {
  // We can just reuse the cases-by-governorate logic, it's identical mapping!
  try {
    let govMap = {};

    for (const model of models) {
      const counts = await model.findAll({
        attributes: ['governorate', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['governorate'],
        raw: true
      }).catch(() => []); 

      counts.forEach(c => {
        if (!c.governorate) return;
        const gov = c.governorate.trim();
        govMap[gov] = (govMap[gov] || 0) + parseInt(c.count, 10);
      });
    }

    const data = Object.keys(govMap).map(name => ({
      name,
      cases: govMap[name]
    })).sort((a, b) => b.cases - a.cases).slice(0, 5); // top 5

    res.json(data);
  } catch (error) {
    console.error('Top regions error:', error);
    res.status(500).json({ error: 'Failed to fetch top regions' });
  }
});

export default router;
