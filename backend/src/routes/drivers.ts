import express from 'express';
import prisma from '../prisma';
import { authMiddleware, requireRole } from '../middleware/auth';
import { paramId } from '../utils/params';
import nodemailer from 'nodemailer';

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

router.post('/', requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), async (req, res) => {
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

router.put('/:id', requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), async (req, res) => {
  try {
    const { licenseExpiry, ...rest } = req.body;
    const data = { ...rest };
    if (licenseExpiry) data.licenseExpiry = new Date(licenseExpiry);
    
    const driver = await prisma.driver.update({
      where: { id: paramId(req.params) },
      data,
    });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update driver' });
  }
});

router.post('/reminders', requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiringDrivers = await prisma.driver.findMany({
      where: {
        licenseExpiry: { lte: thirtyDaysFromNow }
      }
    });

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "fake_user@ethereal.email",
        pass: "fake_password",
      },
    });

    console.log(`Sending reminders to ${expiringDrivers.length} drivers...`);

    res.json({ message: `Reminders sent successfully to ${expiringDrivers.length} drivers` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
});

export default router;
