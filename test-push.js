const webpush = require('web-push');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

webpush.setVapidDetails(
  'mailto:admin@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function testPush() {
  const subscriptions = await prisma.pushSubscription.findMany();
  console.log('Found', subscriptions.length, 'subscriptions');
  
  for (const sub of subscriptions) {
    const pushSub = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth }
    };
    try {
      await webpush.sendNotification(pushSub, JSON.stringify({
        title: 'Test dari Antigravity',
        body: 'Apakah ini masuk ke HP Anda?',
        url: '/',
        icon: '/icon.png'
      }));
      console.log('Successfully sent to:', sub.endpoint.substring(0, 50) + '...');
    } catch (e) {
      console.error('Failed to send to:', sub.endpoint.substring(0, 50) + '...', e.statusCode);
    }
  }
}

testPush().finally(() => prisma.$disconnect());
