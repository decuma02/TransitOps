import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma';
import { authMiddleware, requireRole } from '../middleware/auth';
import { paramId } from '../utils/params';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: { vehicle: true, driver: true },
    });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

router.post('/', requireRole(['FLEET_MANAGER', 'DRIVER']), async (req, res) => {
  try {
    const { vehicleId, driverId, cargoWeight, ...rest } = req.body;
    
    // Validations
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    if (vehicle.status !== 'AVAILABLE') return res.status(400).json({ error: 'Vehicle is not available' });
    if (cargoWeight > vehicle.maxCapacity) return res.status(400).json({ error: 'Cargo weight exceeds vehicle capacity' });

    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    if (driver.status !== 'AVAILABLE') return res.status(400).json({ error: 'Driver is not available' });

    // Transaction for creating trip and updating statuses
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const trip = await tx.trip.create({
        data: {
          vehicleId,
          driverId,
          cargoWeight,
          ...rest,
          status: 'DISPATCHED'
        },
      });

      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'ON_TRIP' }
      });

      await tx.driver.update({
        where: { id: driverId },
        data: { status: 'ON_TRIP' }
      });

      return trip;
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create trip' });
  }
});

router.post('/:id/complete', requireRole(['FLEET_MANAGER', 'DRIVER']), async (req, res) => {
  try {
    const tripId = paramId(req.params);
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.status !== 'DISPATCHED') return res.status(400).json({ error: 'Trip not dispatchable' });

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const completedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: 'COMPLETED', completedAt: new Date() }
      });

      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'AVAILABLE' }
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'AVAILABLE' }
      });

      return completedTrip;
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to complete trip' });
  }
});

export default router;
