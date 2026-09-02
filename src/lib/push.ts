import webpush from 'web-push'
import { prisma } from './prisma'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import fs from 'fs'
import path from 'path'

if (getApps().length === 0) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT
    let serviceAccount;
    
    if (serviceAccountStr) {
      try {
        serviceAccount = JSON.parse(serviceAccountStr)
      } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT. Is it valid JSON?", e)
      }
    } else {
      const serviceAccountPath = path.join(process.cwd(), 'firebase-admin.json')
      if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
      }
    }

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount)
      })
    } else {
      console.warn("Firebase Admin credentials not found! Push notifications via FCM will not work.")
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
  }
}

export async function sendNotificationToAll(title: string, body: string, url: string = '/', imageUrl?: string | null) {
  try {
    webpush.setVapidDetails(
      'mailto:admin@example.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
      process.env.VAPID_PRIVATE_KEY as string
    )
    
    const settings = await prisma.settings.findFirst()
    const iconUrl = settings?.logoUrl || '/globe.svg'

    const subscriptions = await prisma.pushSubscription.findMany()
    
    const notificationPayload: any = {
      title,
      body,
      url,
      icon: iconUrl
    }
    
    if (imageUrl) {
      notificationPayload.image = imageUrl;
    }
    
    const promises = subscriptions.map(sub => {
      // Jika p256dh kosong, berarti ini token FCM dari APK Android
      if (!sub.p256dh) {
        if (getApps().length === 0) return Promise.resolve()
        
        const fcmPayload: any = {
          token: sub.endpoint,
          notification: {
            title,
            body
          },
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              channelId: 'default'
            }
          },
          data: {
            url
          }
        };

        if (imageUrl) {
          fcmPayload.notification.imageUrl = imageUrl;
        }

        return getMessaging().send(fcmPayload).catch(err => {
          console.error('FCM Error:', err)
          if (err.code === 'messaging/invalid-registration-token' || err.code === 'messaging/registration-token-not-registered') {
            return prisma.pushSubscription.delete({ where: { id: sub.id } })
          }
        })
      }

      // Jika p256dh ada, berarti ini Web Push biasa
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
