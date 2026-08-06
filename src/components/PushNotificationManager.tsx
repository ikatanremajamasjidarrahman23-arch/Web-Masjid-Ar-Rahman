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
  const [isIosPrompt, setIsIosPrompt] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    // Check if user has dismissed prompts before
    const hasDismissed = localStorage.getItem('pushPromptDismissed') === 'true'
    if (hasDismissed) return

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Browser supports Push API (Android, Desktop, or iOS PWA)
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => setShowPrompt(true), 2000)
        return () => clearTimeout(timer)
      } else if (Notification.permission === 'granted') {
        subscribeToPush()
      }
    } else if (isIos && !isStandalone) {
      // iOS Safari but not added to home screen yet
      const timer = setTimeout(() => {
        setIsIosPrompt(true)
        setShowPrompt(true)
      }, 2000)
      return () => clearTimeout(timer)
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
    if (isIosPrompt) {
      // We can't actually request permission here, they need to add to home screen first.
      // We just close it for now.
      handleDismiss()
      return
    }
    
    // Request permission (This is now tied to a user gesture, so Android won't block it!)
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        await subscribeToPush()
      }
    } catch (e) {
      console.error(e)
    } finally {
      handleDismiss()
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('pushPromptDismissed', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl p-4 z-50 border border-emerald-100 flex items-start gap-4 transition-all duration-500 ease-out translate-y-0 opacity-100">
      <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full shrink-0">
        <BellRing className="w-6 h-6" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800">
          {isIosPrompt ? 'Notifikasi di iPhone' : 'Dapatkan Notifikasi Kajian'}
        </h3>
        <p className="text-sm text-gray-500 mt-1 mb-3 leading-relaxed">
          {isIosPrompt 
            ? 'Untuk menerima notifikasi di iPhone, tap tombol Share (Bagikan) di bawah lalu pilih "Add to Home Screen" (Tambahkan ke Layar Utama).'
            : 'Izinkan notifikasi agar tidak ketinggalan info kajian dan buletin terbaru dari kami.'}
        </p>
        <div className="flex gap-2">
          {!isIosPrompt && (
            <button 
              onClick={handleAllowClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors flex-grow"
            >
              Izinkan
            </button>
          )}
          <button 
            onClick={handleDismiss}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2 px-4 rounded-xl transition-colors w-full"
          >
            {isIosPrompt ? 'Mengerti' : 'Nanti'}
          </button>
        </div>
      </div>
      <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 absolute top-3 right-3">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
