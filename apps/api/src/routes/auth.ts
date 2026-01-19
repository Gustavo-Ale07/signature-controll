import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import passport from '../config/passport';
import prisma from '../config/database';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '../validators/schemas';
import { config } from '../config';

const router = Router();

// Register
router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        provider: 'local',
      },
    });
    
    // Auto login
    req.login(user, (err) => {
      if (err) return next(err);
      
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', validate(loginSchema), (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user: any, info: any) => {
    if (err) return next(err);
    
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Authentication failed' });
    }
    
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const user = req.user as any;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${config.frontendUrl}/login?error=oauth` }),
  (_req: Request, res: Response) => {
    res.redirect(`${config.frontendUrl}/dashboard`);
  }
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${config.frontendUrl}/login?error=oauth` }),
  (_req: Request, res: Response) => {
    res.redirect(`${config.frontendUrl}/dashboard`);
  }
);

export default router;
