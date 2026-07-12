import express from 'express';
import prisma from '../prisma';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

router.post('/', requireRole(['ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER']), async (req, res) => {
  try {
    const { licenseExpiry, ...rest } = req.body;
    const driver = await prisma.driver.create({
      data: {
        ...rest,
        licenseExpiry: new Date(licenseExpiry),
      },
    });
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create driver' });
  }
});

router.put('/:id', requireRole(['ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER']), async (req, res) => {
  try {
    const { licenseExpiry, ...rest } = req.body;
    const data = { ...rest };
    if (licenseExpiry) data.licenseExpiry = new Date(licenseExpiry);
    
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data,
    });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update driver' });
  }
});

export default router;
