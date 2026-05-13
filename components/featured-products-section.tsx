"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { storage, type Product } from "@/lib/store"

export function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadProducts = () => {
      setFeaturedProducts(storage.getFeaturedProducts())
    }

    loadProducts()

    window.addEventListener("storage", loadProducts)
    window.addEventListener("productsUpdated", loadProducts)

    return () => {
      window.removeEventListener("storage", loadProducts)
      window.removeEventListener("productsUpdated", loadProducts)
    }
  }, [])

  if (featuredProducts.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-balance text-gray-900">
            Productos Destacados
          </h2>
          <p className="text-lg text-gray-600 text-pretty">Descubre nuestras joyas más populares</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/productos?categoria=${product.category}`}>
              <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white hover:-translate-y-2">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                  {product.image ? (
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="pt-6 pb-8 text-center space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 line-clamp-1 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                    ${product.price.toLocaleString("es-CO")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/productos"
            className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </div>
    </section>
  )
}
