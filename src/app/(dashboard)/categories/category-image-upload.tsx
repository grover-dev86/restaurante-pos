'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ImagePlus, Loader2, X, FolderTree, UploadCloud } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CategoryImageUploadProps {
  currentImage: string | null
  onImageChange: (url: string | null) => void
}

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function CategoryImageUpload({
  currentImage,
  onImageChange,
}: CategoryImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const { toast } = useToast()

  // ==========================================
  // Subida del archivo (común a click y drop)
  // ==========================================

  const uploadFile = async (file: File) => {
    // Validaciones cliente
    if (!VALID_TYPES.includes(file.type)) {
      toast({
        title: 'Formato no válido',
        description: 'Solo se aceptan JPG, PNG o WebP',
        variant: 'destructive',
      })
      return
    }
    if (file.size > MAX_SIZE) {
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
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  // ==========================================
  // Click sobre input file
  // ==========================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  // ==========================================
  // Drag & drop nativo del navegador
  // ==========================================

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current += 1
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current -= 1
    // Usamos un contador porque dragLeave dispara también al pasar sobre hijos.
    // Solo ocultamos el feedback cuando salimos del wrapper más externo.
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)

    if (isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const openFilePicker = () => {
    if (!isUploading) inputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>Imagen</Label>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed transition ${
          isDragging
            ? 'border-primary bg-primary/10 ring-2 ring-primary/40'
            : 'border-muted-foreground/25 bg-muted/40'
        }`}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Vista previa"
              fill
              className="object-cover pointer-events-none select-none"
              draggable={false}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            {/* Overlay cuando se está arrastrando un archivo sobre una imagen ya existente */}
            {isDragging && !isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/70 text-primary-foreground pointer-events-none">
                <UploadCloud className="h-10 w-10" />
                <span className="text-sm font-medium">Suelta para reemplazar</span>
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Subiendo…</span>
              </>
            ) : isDragging ? (
              <>
                <UploadCloud className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-primary">Suelta el archivo aquí</span>
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

        {/* Icono decorativo cuando no hay imagen ni acción en curso */}
        {!preview && !isUploading && !isDragging && (
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
            onClick={openFilePicker}
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
