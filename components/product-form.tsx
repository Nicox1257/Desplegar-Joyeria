"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Product } from "@/lib/store"
import { storage } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Upload, Loader2 } from "lucide-react"

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "cadenas",
    price: product?.price || 0,
    description: product?.description || "",
    specifications: product?.specifications || "",
    image: product?.image || "",
    featured: product?.featured || false,
  })

  const [imagePreview, setImagePreview] = useState(product?.image || "")

  console.log("[v0] ProductForm montado", { product, formData })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log("[v0] Archivo seleccionado:", file)
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        console.log("[v0] Imagen cargada, tamaño:", result.length)
        setImagePreview(result)
        setFormData({ ...formData, image: result })
      }
      reader.onerror = () => {
        console.error("[v0] Error al leer la imagen")
        alert("Error al cargar la imagen. Por favor intenta de nuevo.")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Formulario enviado", formData)

    if (!formData.name.trim()) {
      alert("Por favor ingresa el nombre del producto")
      return
    }

    if (formData.price <= 0) {
      alert("Por favor ingresa un precio válido")
      return
    }

    if (!formData.description.trim()) {
      alert("Por favor ingresa una descripción")
      return
    }

    setIsLoading(true)

    try {
      if (product) {
        console.log("[v0] Actualizando producto:", product.id)
        storage.updateProduct(product.id, formData)
      } else {
        console.log("[v0] Creando nuevo producto")
        const newProduct = storage.addProduct(formData)
        console.log("[v0] Producto creado:", newProduct)
      }

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/productos")
      }
    } catch (error) {
      console.error("[v0] Error al guardar producto:", error)
      alert("Error al guardar el producto. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Cadena de Oro 18k"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cadenas">Cadenas</SelectItem>
                  <SelectItem value="anillos">Anillos</SelectItem>
                  <SelectItem value="pulseras">Pulseras</SelectItem>
                  <SelectItem value="aretes">Aretes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio (COP) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="150000"
                required
                min="0"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el producto..."
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications">Especificaciones</Label>
            <Textarea
              id="specifications"
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              placeholder="Material: Oro laminado 18k&#10;Peso: 5g&#10;Largo: 50cm&#10;Ancho: 3mm"
              rows={4}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500">Separa cada especificación en una línea nueva</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
              disabled={isLoading}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Destacar en página principal
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Imagen del Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Subir Imagen *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
                disabled={isLoading}
              />
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Formatos: JPG, PNG, WEBP. Tamaño máximo: 5MB</p>
          </div>

          {imagePreview && (
            <div className="relative aspect-square w-full max-w-xs rounded-lg overflow-hidden border border-gray-200 bg-white">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" className="bg-[#d4af37] hover:bg-[#b8941f] text-white" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : product ? (
            "Actualizar Producto"
          ) : (
            "Crear Producto"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/productos")} disabled={isLoading}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
