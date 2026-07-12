import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicles';
import driverRoutes from './routes/drivers';
import tripRoutes from './routes/trips';
import maintenanceRoutes from './routes/maintenance';
import fuelRoutes from './routes/fuel';
import analyticsRoutes from './routes/analytics';

dotenv.config();

import prisma from './prisma';
import bcrypt from 'bcryptjs';

const seedDemoUser = async () => {
  try {
    const email = 'demo@transitops.com';
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Demo Fleet Manager',
          role: 'FLEET_MANAGER',
        },
      });
      console.log('Demo user seeded');
    }
  } catch (error) {
    console.error('Error seeding demo user:', error);
  }
};
seedDemoUser();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
