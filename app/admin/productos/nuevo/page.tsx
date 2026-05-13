import { ProductForm } from "@/components/product-form"
import { Suspense } from "react"

export default function NuevoProductoPage() {
  console.log("[v0] Renderizando NuevoProductoPage")

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Nuevo Producto</h2>
        <p className="text-gray-600 mt-2">Agrega una nueva joya al catálogo</p>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        }
      >
        <ProductForm />
      </Suspense>
    </div>
  )
}
