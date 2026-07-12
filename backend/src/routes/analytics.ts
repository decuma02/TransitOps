import express from 'express';
import prisma from '../prisma';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/kpis', async (req, res) => {
  try {
    const activeVehicles = await prisma.vehicle.count({ where: { status: 'ON_TRIP' } });
    const availableVehicles = await prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
    const inShop = await prisma.vehicle.count({ where: { status: 'IN_SHOP' } });
    
    const activeTrips = await prisma.trip.count({ where: { status: 'DISPATCHED' } });
    
    res.json({
      activeVehicles,
      availableVehicles,
      inShop,
      activeTrips,
      fleetUtilization: availableVehicles + activeVehicles > 0 ? (activeVehicles / (availableVehicles + activeVehicles)) * 100 : 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

router.get('/charts', async (req, res) => {
  try {
    // Dummy aggregated data for the hackathon charts
    const chartData = [
      { name: 'Mon', cost: 400, fuel: 240, revenue: 1000 },
      { name: 'Tue', cost: 300, fuel: 139, revenue: 800 },
      { name: 'Wed', cost: 200, fuel: 980, revenue: 1200 },
      { name: 'Thu', cost: 278, fuel: 390, revenue: 908 },
      { name: 'Fri', cost: 189, fuel: 480, revenue: 1100 },
      { name: 'Sat', cost: 239, fuel: 380, revenue: 1400 },
      { name: 'Sun', cost: 349, fuel: 430, revenue: 1300 },
    ];
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

export default router;
