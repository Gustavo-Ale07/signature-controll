import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { config } from '../config';

// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user || !user.password) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google Strategy
if (config.google.clientId && config.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await prisma.user.findFirst({
            where: {
              provider: 'google',
              providerId: profile.id,
            },
          });
          
          if (!user) {
            // Check if email already exists
            const existingUser = await prisma.user.findUnique({
              where: { email: profile.emails?.[0]?.value },
            });
            
            if (existingUser) {
              return done(null, false, { message: 'Email already registered with different provider' });
            }
            
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value || '',
                name: profile.displayName,
                provider: 'google',
                providerId: profile.id,
              },
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Facebook Strategy
if (config.facebook.appId && config.facebook.appSecret) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebook.appId,
        clientSecret: config.facebook.appSecret,
        callbackURL: config.facebook.callbackUrl,
        profileFields: ['id', 'emails', 'name'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await prisma.user.findFirst({
            where: {
              provider: 'facebook',
              providerId: profile.id,
            },
          });
          
          if (!user) {
            const existingUser = await prisma.user.findUnique({
              where: { email: profile.emails?.[0]?.value },
            });
            
            if (existingUser) {
              return done(null, false, { message: 'Email already registered with different provider' });
            }
            
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value || '',
                name: `${profile.name?.givenName} ${profile.name?.familyName}`.trim(),
                provider: 'facebook',
                providerId: profile.id,
              },
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

export default passport;
