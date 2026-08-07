'use client'

import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'
import { X, Check } from 'lucide-react'

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedFile: File) => void
  onCancel: () => void
  aspect?: number
}

export default function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  aspect = 16 / 9,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    try {
      setIsProcessing(true)
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels as any,
        0
      )
      if (croppedImage) {
        onCropComplete(croppedImage)
      }
    } catch (e) {
      console.error(e)
      alert("Gagal memproses gambar. Silakan coba lagi.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-gray-800 text-lg">Sesuaikan Posisi & Ukuran</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-gray-900 w-full">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-white shrink-0">
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2 font-medium">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(Number(e.target.value))
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              {isProcessing ? "Memproses..." : <><Check className="w-5 h-5" /> Simpan Potongan</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
