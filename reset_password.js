const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.admin.update({
      where: { username: 'admin' },
      data: { password: hash }
    });
    console.log('Password reset successfully!');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
