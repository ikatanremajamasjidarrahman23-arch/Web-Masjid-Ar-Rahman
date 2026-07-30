const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const adminCount = await prisma.admin.count();
    console.log('Admin count:', adminCount);
    
    if (adminCount > 0) {
      const admins = await prisma.admin.findMany();
      console.log('Admins in DB:', admins);
    }
  } catch (e) {
    console.error('Error connecting to DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
