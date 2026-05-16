'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ImagePlus, Loader2, X, FolderTree } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CategoryImageUploadProps {
  currentImage: string | null
  onImageChange: (url: string | null) => void
}

export function CategoryImageUpload({
  currentImage,
  onImageChange,
}: CategoryImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar en cliente (el servidor revalida)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Formato no válido',
        description: 'Solo se aceptan JPG, PNG o WebP',
        variant: 'destructive',
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Archivo muy grande',
        description: 'La imagen no debe superar los 5MB',
        variant: 'destructive',
      })
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

      const res = await fetch('/api/upload/category', { method: 'POST', body: formData })
      const result = await res.json()

      if (result.success) {
        setPreview(result.url)
        onImageChange(result.url)
        toast({ title: 'Imagen subida', description: 'La imagen se subió correctamente' })
      } else {
        setPreview(currentImage)
        onImageChange(currentImage)
        toast({
          title: 'Error al subir',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch {
      setPreview(currentImage)
      onImageChange(currentImage)
      toast({
        title: 'Error de red',
        description: 'No se pudo subir la imagen',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      // Limpiar input para permitir re-seleccionar el mismo archivo
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <Label>Imagen</Label>

      <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed bg-muted/40">
        {preview ? (
          <>
            <Image src={preview} alt="Vista previa" fill className="object-cover" />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Subiendo…</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm font-medium">Haz clic para subir</span>
                <span className="text-xs">o arrastra un archivo aquí</span>
              </>
            )}
          </button>
        )}

        {/* Icono decorativo cuando no hay imagen ni botón activo */}
        {!preview && !isUploading && (
          <FolderTree className="pointer-events-none absolute right-3 bottom-3 h-5 w-5 text-muted-foreground/30" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">JPG, PNG o WebP. Máx 5MB.</p>

        <div className="flex gap-2">
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
                Subiendo…
              </>
            ) : preview ? (
              'Cambiar'
            ) : (
              'Seleccionar imagen'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
