'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Camera, Loader2, X, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AvatarUploadProps {
  currentAvatar: string | null
  onAvatarChange: (url: string | null) => void
}

export function AvatarUpload({ currentAvatar, onAvatarChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar en cliente
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({ title: 'Error', description: 'Solo JPG, PNG o WebP', variant: 'destructive' })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Máximo 2MB', variant: 'destructive' })
      return
    }

    // Preview local inmediato
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    // Subir a Cloudinary
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/avatar', { method: 'POST', body: formData })
      const result = await res.json()

      if (result.success) {
        setPreview(result.url)
        onAvatarChange(result.url)
        toast({ title: 'Avatar actualizado', description: 'Imagen subida correctamente' })
      } else {
        setPreview(currentAvatar)
        onAvatarChange(currentAvatar)
        toast({ title: 'Error', description: result.message, variant: 'destructive' })
      }
    } catch {
      setPreview(currentAvatar)
      onAvatarChange(currentAvatar)
      toast({ title: 'Error', description: 'Error al subir la imagen', variant: 'destructive' })
    } finally {
      setIsUploading(false)
      // Limpiar input para permitir re-seleccionar el mismo archivo
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onAvatarChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-muted bg-muted flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-muted-foreground" />
          )}

          {isUploading && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Botón de cámara overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Subiendo...
            </>
          ) : (
            'Cambiar foto'
          )}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="mr-1 h-3 w-3" />
            Quitar
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">JPG, PNG o WebP. Máx 2MB.</p>
    </div>
  )
}
