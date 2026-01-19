import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create test user
  const hashedPassword = await bcrypt.hash('Test123!', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@smilovault.com' },
    update: {},
    create: {
      email: 'test@smilovault.com',
      name: 'Test User',
      password: hashedPassword,
      provider: 'local',
    },
  });

  console.log('Created user:', user.email);

  // Note: Items with encrypted secrets will be created through the app
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
