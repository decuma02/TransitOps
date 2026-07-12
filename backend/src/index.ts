import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicles';
import driverRoutes from './routes/drivers';
import tripRoutes from './routes/trips';
import maintenanceRoutes from './routes/maintenance';
import fuelRoutes from './routes/fuel';
import analyticsRoutes from './routes/analytics';

dotenv.config();

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required in production');
  process.exit(1);
}

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

import prisma from './prisma';
import bcrypt from 'bcryptjs';

const seedDemoUser = async () => {
  try {
    const demoUsers = [
      { email: 'demo_fleet@transitops.com', name: 'Demo Fleet Manager', role: 'FLEET_MANAGER' },
      { email: 'demo_driver@transitops.com', name: 'Demo Driver', role: 'DRIVER' },
      { email: 'demo_safety@transitops.com', name: 'Demo Safety Officer', role: 'SAFETY_OFFICER' },
      { email: 'demo_finance@transitops.com', name: 'Demo Financial Analyst', role: 'FINANCIAL_ANALYST' },
    ];
    
    for (const user of demoUsers) {
      const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('demo123', 10);
        await prisma.user.create({
          data: {
            email: user.email,
            password: hashedPassword,
            name: user.name,
            role: user.role as any,
          },
        });
        console.log(`${user.role} demo user seeded`);
      }
    }
  } catch (error) {
    console.error('Error seeding demo users:', error);
  }
};
seedDemoUser();

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
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
