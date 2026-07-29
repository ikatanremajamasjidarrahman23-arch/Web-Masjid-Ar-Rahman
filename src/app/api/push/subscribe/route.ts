import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const subscription = await request.json()
    
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
    }

    // Save or update subscription
    await prisma.pushSubscription.upsert({
      where: {
        endpoint: subscription.endpoint
      },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving subscription:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
