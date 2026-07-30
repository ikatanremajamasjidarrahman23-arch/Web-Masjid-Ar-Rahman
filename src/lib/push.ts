import webpush from 'web-push'
import { prisma } from './prisma'

export async function sendNotificationToAll(title: string, body: string, url: string = '/') {
  try {
    webpush.setVapidDetails(
      'mailto:admin@example.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
      process.env.VAPID_PRIVATE_KEY as string
    )
    
    const subscriptions = await prisma.pushSubscription.findMany()
    
    const notificationPayload = {
      title,
      body,
      url,
      icon: '/icon.png'
    }
    
    const promises = subscriptions.map(sub => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      }
      return webpush.sendNotification(pushSubscription, JSON.stringify(notificationPayload))
        .catch(err => {
          if (err.statusCode === 404 || err.statusCode === 410) {
            console.log('Subscription expired/invalid, deleting:', sub.endpoint)
            return prisma.pushSubscription.delete({ where: { id: sub.id } })
          }
          console.error('Subscription error:', err)
        })
    })
    
    await Promise.all(promises)
  } catch (error) {
    console.error('Error sending push notifications:', error)
  }
}
