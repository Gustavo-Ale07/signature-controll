import { Request, Response, NextFunction } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import prisma from '../config/database';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);

  if (auth.userId) {
    try {
      const clerkUser = await clerkClient.users.getUser(auth.userId);
      const primaryEmailId = clerkUser.primaryEmailAddressId;
      const primaryEmail = clerkUser.emailAddresses.find((email) => email.id === primaryEmailId)
        || clerkUser.emailAddresses[0];
      const email = primaryEmail?.emailAddress;
      const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim();

      if (!email) {
        return res.status(400).json({ error: 'No email available for this user' });
      }

      let user = await prisma.user.findFirst({
        where: { provider: 'clerk', providerId: auth.userId },
      });

      if (!user) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          user = existing;
        } else {
          user = await prisma.user.create({
            data: {
              email,
              name: name || null,
              provider: 'clerk',
              providerId: auth.userId,
            },
          });
        }
      }

      (req as any).user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ error: 'Unauthorized' });
}

export function attachUser(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
}
