import express from 'express';
import prisma from '../prisma';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const logs = await prisma.fuelLog.findMany();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fuel logs' });
  }
});

router.post('/', requireRole(['FLEET_MANAGER', 'DRIVER', 'FINANCIAL_ANALYST']), async (req, res) => {
  try {
    const log = await prisma.fuelLog.create({
      data: req.body,
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create fuel log' });
  }
});

export default router;
