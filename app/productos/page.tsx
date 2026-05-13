"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { storage, type Product } from "@/lib/store"
import { ShoppingCart } from "lucide-react"

function ProductosContent() {
  const searchParams = useSearchParams()
  const categoria = searchParams.get("categoria")
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoria)

  useEffect(() => {
    loadProducts()
  }, [selectedCategory])

  const loadProducts = () => {
    if (selectedCategory) {
      setProducts(storage.getProductsByCategory(selectedCategory))
    } else {
      setProducts(storage.getProducts())
    }
  }

  const addToCart = (product: Product) => {
    storage.addToCart(product)
    window.dispatchEvent(new Event("cartUpdated"))
    alert("Producto agregado al carrito")
  }

  const categories = [
    { id: null, name: "Todos" },
    { id: "cadenas", name: "Cadenas" },
    { id: "anillos", name: "Anillos" },
    { id: "pulseras", name: "Pulseras" },
    { id: "aretes", name: "Aretes" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-4">Nuestros Productos</h1>
            <p className="text-gray-600">Explora nuestra colección de joyería fina</p>
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat.id || "all"}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? "bg-amber-600 hover:bg-amber-700" : ""}
              >
                {cat.name}
              </Button>
            ))}
          </div>
          {products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No hay productos en esta categoría todavía</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative aspect-square bg-gray-100">
                    {product.image ? (
                      <img src={product.image || "/placeholder.svg"} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                    </div>
                    <p className="text-xl font-bold text-amber-600">${product.price.toLocaleString("es-CO")}</p>
                    <Button onClick={() => addToCart(product)} className="w-full bg-amber-600 hover:bg-amber-700 gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Agregar al Carrito
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-amber-600">Cargando productos...</div>}>
      <ProductosContent />
    </Suspense>
  )
}
