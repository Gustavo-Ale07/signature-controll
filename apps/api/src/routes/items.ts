import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { isAuthenticated } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createItemSchema, updateItemSchema } from '../validators/schemas';
import { encryptSecret, decryptSecret } from '../utils/crypto';
import { config } from '../config';
import { Prisma } from '@prisma/client';

const router: Router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: config.upload.uploadDir,
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  },
});

// Apply auth middleware to all routes
router.use(isAuthenticated);

// List items with filters
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    const { type, search } = req.query;
    
    const where: any = {
      userId: user.id,
    };
    
    if (type && (type === 'SUBSCRIPTION' || type === 'ACCOUNT')) {
      where.type = type;
    }
    
    if (search && typeof search === 'string') {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }
    
    const items = await prisma.item.findMany({
      where,
      select: {
        id: true,
        type: true,
        name: true,
        email: true,
        value: true,
        billingDay: true,
        duration: true,
        notes: true,
        iconPath: true,
        createdAt: true,
        updatedAt: true,
        // NEVER return encrypted fields in list
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Get dashboard stats
router.get('/stats/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    
    type DashboardItem = Prisma.ItemGetPayload<{
      select: {
        id: true;
        name: true;
        value: true;
        billingDay: true;
        duration: true;
      };
    }>;

    const items: DashboardItem[] = await prisma.item.findMany({
      where: {
        userId: user.id,
        type: 'SUBSCRIPTION',
      },
      select: {
        id: true,
        name: true,
        value: true,
        billingDay: true,
        duration: true,
      },
    });
    
    // Calculate monthly total
    let monthlyTotal = 0;
    type UpcomingBilling = {
      id: string;
      name: string;
      value: number | null;
      billingDay: number;
      duration: DashboardItem['duration'];
    };

    const upcomingBillings: UpcomingBilling[] = [];
    
    items.forEach((item) => {
      if (item.value && item.duration) {
        let monthlyValue = item.value;
        
        if (item.duration === 'SEMIANNUAL') {
          monthlyValue = item.value / 6;
        } else if (item.duration === 'ANNUAL') {
          monthlyValue = item.value / 12;
        }
        
        monthlyTotal += monthlyValue;
        
        if (item.billingDay !== null) {
          upcomingBillings.push({
            id: item.id,
            name: item.name,
            value: item.value,
            billingDay: item.billingDay,
            duration: item.duration,
          });
        }
      }
    });
    
    // Sort by billing day
    upcomingBillings.sort((a, b) => a.billingDay - b.billingDay);
    
    res.json({
      monthlyTotal: Math.round(monthlyTotal * 100) / 100,
      upcomingBillings: upcomingBillings.slice(0, 5), // Next 5
    });
  } catch (error) {
    next(error);
  }
});

// Get single item
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    const { id } = req.params;
    
    const item = await prisma.item.findFirst({
      where: {
        id,
        userId: user.id, // Security: always filter by userId
      },
      select: {
        id: true,
        type: true,
        name: true,
        email: true,
        value: true,
        billingDay: true,
        duration: true,
        notes: true,
        iconPath: true,
        createdAt: true,
        updatedAt: true,
        // Don't return encrypted fields here either
      },
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// Get item secret (password) - separate endpoint for security
router.get('/:id/secret', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    const { id } = req.params;
    
    const item = await prisma.item.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        secretCiphertext: true,
        secretIv: true,
        secretAuthTag: true,
      },
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (!item.secretCiphertext || !item.secretIv || !item.secretAuthTag) {
      return res.json({ password: null });
    }
    
    const password = decryptSecret({
      ciphertext: item.secretCiphertext,
      iv: item.secretIv,
      authTag: item.secretAuthTag,
    });
    
    res.json({ password });
  } catch (error) {
    next(error);
  }
});

// Create item
router.post('/', upload.single('icon'), validate(createItemSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    const { type, name, email, password, value, billingDay, duration, notes } = req.body;
    
    const iconPath = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Encrypt password if provided
    let encrypted = null;
    if (password) {
      encrypted = encryptSecret(password);
    }
    
    const item = await prisma.item.create({
      data: {
        userId: user.id,
        type,
        name,
        email: email || null,
        secretCiphertext: encrypted?.ciphertext || null,
        secretIv: encrypted?.iv || null,
        secretAuthTag: encrypted?.authTag || null,
        value: value ? parseFloat(value) : null,
        billingDay: billingDay ? parseInt(billingDay, 10) : null,
        duration: duration || null,
        notes: notes || null,
        iconPath,
      },
    });
    
    // Return without encrypted fields
    const { secretCiphertext, secretIv, secretAuthTag, ...safeItem } = item;
    
    res.status(201).json(safeItem);
  } catch (error) {
    next(error);
  }
});

// Update item
router.patch('/:id', upload.single('icon'), validate(updateItemSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    const { id } = req.params;
    
    // Verify ownership
    const existing = await prisma.item.findFirst({
      where: { id, userId: user.id },
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const { type, name, email, password, value, billingDay, duration, notes } = req.body;
    
    const updateData: any = {};
    
    if (type !== undefined) updateData.type = type;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email || null;
    if (value !== undefined) updateData.value = value ? parseFloat(value) : null;
    if (billingDay !== undefined) updateData.billingDay = billingDay ? parseInt(billingDay, 10) : null;
    if (duration !== undefined) updateData.duration = duration || null;
    if (notes !== undefined) updateData.notes = notes || null;
    
    if (req.file) {
      updateData.iconPath = `/uploads/${req.file.filename}`;
    }
    
    if (password !== undefined) {
      if (password) {
        const encrypted = encryptSecret(password);
        updateData.secretCiphertext = encrypted.ciphertext;
        updateData.secretIv = encrypted.iv;
        updateData.secretAuthTag = encrypted.authTag;
      } else {
        updateData.secretCiphertext = null;
        updateData.secretIv = null;
        updateData.secretAuthTag = null;
      }
    }
    
    const item = await prisma.item.update({
      where: { id },
      data: updateData,
    });
    
    const { secretCiphertext, secretIv, secretAuthTag, ...safeItem } = item;
    
    res.json(safeItem);
  } catch (error) {
    next(error);
  }
});

// Delete item
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    const { id } = req.params;
    
    const item = await prisma.item.findFirst({
      where: { id, userId: user.id },
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    await prisma.item.delete({ where: { id } });
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
