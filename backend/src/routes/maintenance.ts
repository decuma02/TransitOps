import express from 'express';
import prisma from '../prisma';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const logs = await prisma.maintenanceLog.findMany({ include: { vehicle: true } });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch maintenance logs' });
  }
});

router.post('/', requireRole(['ADMIN', 'FLEET_MANAGER']), async (req, res) => {
  try {
    const { vehicleId, ...rest } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const log = await tx.maintenanceLog.create({
        data: {
          vehicleId,
          ...rest,
          status: 'OPEN'
        }
      });

      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'IN_SHOP' }
      });

      return log;
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create maintenance log' });
  }
});

router.post('/:id/close', requireRole(['ADMIN', 'FLEET_MANAGER']), async (req, res) => {
  try {
    const logId = req.params.id;
    const log = await prisma.maintenanceLog.findUnique({ where: { id: logId } });
    if (!log) return res.status(404).json({ error: 'Log not found' });

    const result = await prisma.$transaction(async (tx) => {
      const closedLog = await tx.maintenanceLog.update({
        where: { id: logId },
        data: { status: 'CLOSED' }
      });

      await tx.vehicle.update({
        where: { id: log.vehicleId },
        data: { status: 'AVAILABLE' }
      });

      return closedLog;
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to close log' });
  }
});

export default router;
