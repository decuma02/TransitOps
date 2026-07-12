import express from 'express';
import prisma from '../prisma';
import { authMiddleware, requireRole } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

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

router.get('/:id/documents', async (req, res) => {
  try {
    const documents = await prisma.vehicleDocument.findMany({
      where: { vehicleId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.post('/:id/documents', requireRole(['ADMIN', 'FLEET_MANAGER', 'DRIVER']), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const document = await prisma.vehicleDocument.create({
      data: {
        vehicleId: req.params.id,
        name: req.body.name || req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
      },
    });
    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

export default router;
