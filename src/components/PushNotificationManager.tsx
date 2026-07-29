'use client'

import { useEffect, useState } from 'react'
import { BellRing, X } from 'lucide-react'

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushNotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Only run on client side and if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      if (Notification.permission === 'default') {
        // Show our custom UI prompt after a small delay
        const timer = setTimeout(() => setShowPrompt(true), 2000)
        return () => clearTimeout(timer)
      } else if (Notification.permission === 'granted') {
        // Already granted, make sure we are subscribed in the background
        subscribeToPush()
      }
    }
  }, [])

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        console.error('No VAPID public key available')
        return
      }
      
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        })
      }
      
      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })
    } catch (error) {
      console.error('Push setup failed:', error)
    }
  }

  const handleAllowClick = async () => {
    // Request permission (This is now tied to a user gesture, so Android won't block it!)
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      await subscribeToPush()
      setShowPrompt(false)
    } else {
      setShowPrompt(false)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl p-4 z-50 border border-emerald-100 flex items-start gap-4 transition-all duration-500 ease-out translate-y-0 opacity-100">
      <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full shrink-0">
        <BellRing className="w-6 h-6" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800">Dapatkan Notifikasi Kajian</h3>
        <p className="text-sm text-gray-500 mt-1 mb-3 leading-relaxed">
          Izinkan notifikasi agar tidak ketinggalan info kajian dan buletin terbaru dari kami.
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleAllowClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors flex-grow"
          >
            Izinkan
          </button>
          <button 
            onClick={() => setShowPrompt(false)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2 px-4 rounded-xl transition-colors"
          >
            Nanti
          </button>
        </div>
      </div>
      <button onClick={() => setShowPrompt(false)} className="text-gray-400 hover:text-gray-600 absolute top-3 right-3">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
