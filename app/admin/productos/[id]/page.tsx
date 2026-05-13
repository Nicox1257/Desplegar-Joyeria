"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { storage, type Product } from "@/lib/store"

export default function EditarProductoPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const id = params.id as string
    const products = storage.getProducts()
    const found = products.find((p) => p.id === id)
    if (found) {
      setProduct(found)
    }
  }, [params.id])

  if (!product) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-3xl font-serif font-bold">Editar Producto</h2>
        <p className="text-gray-600 mt-2">Modifica la información del producto</p>
      </div>
      <ProductForm product={product} />
    </div>
  )
}
