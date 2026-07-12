import express from 'express';
import prisma from '../prisma';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

router.post('/', requireRole(['ADMIN', 'FLEET_MANAGER']), async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.create({
      data: req.body,
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create vehicle' });
  }
});

router.put('/:id', requireRole(['ADMIN', 'FLEET_MANAGER']), async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update vehicle' });
  }
});

router.delete('/:id', requireRole(['ADMIN', 'FLEET_MANAGER']), async (req, res) => {
  try {
    await prisma.vehicle.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete vehicle' });
  }
});

export default router;
