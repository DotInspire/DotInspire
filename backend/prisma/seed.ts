import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Ensuring Admin and Settings exist...');

  // 1. Seed Admin User (only if not existing)
  const adminEmail = process.env.ADMIN_EMAIL || 'dotinspire787@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.create({
      data: {
        name: 'Dot Inspire Admin',
        email: adminEmail,
        passwordHash,
        role: 'SUPERADMIN',
      },
    });
    console.log('✅ Admin user created');
  }

  // 2. Seed Default Website Settings (only if not existing)
  const existingSettings = await prisma.websiteSettings.findUnique({ where: { id: 'default' } });
  if (!existingSettings) {
    await prisma.websiteSettings.create({
      data: {
        id: 'default',
        businessName: 'Dot Inspire Design Studio',
        legalName: 'Dot Inspire Interior Design Studio LLP',
        phone: '7591953607',
        whatsapp: '7591953607',
        email: 'dotinspire787@gmail.com',
        address: 'Paigotoor P.O., Paingotoor, PIN 686671, Kerala, India',
        instagramUrl: 'https://www.instagram.com/dot_inspire_/',
        footerText: 'Crafting timeless interior and architectural environments with passion and precision.',
      },
    });
    console.log('✅ Website settings created');
  }

  console.log('✨ Production setup complete. No dummy items/projects/services added.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

