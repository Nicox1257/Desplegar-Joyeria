"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { storage, type SiteConfig } from "@/lib/store"

const categoryImages = {
  cadenas: "/elegant-gold-chains-on-white-marble.jpg",
  anillos: "/elegant-gold-plated-rings-on-black-display.jpg",
  pulseras: "/sophisticated-gold-plated-bracelets-on-marble.jpg",
  aretes: "/brilliant-gold-plated-earrings-on-elegant-stand.jpg",
}

export function CategoriesSection() {
  const [config, setConfig] = useState<SiteConfig | null>(null)

  useEffect(() => {
    setConfig(storage.getConfig())
  }, [])

  if (!config) return null

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-balance text-gray-900">
            Explora Nuestras Categorías
          </h2>
          <p className="text-lg text-gray-600 text-pretty">Encuentra la joya perfecta para cada ocasión</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {config.categories.map((category) => (
            <Link key={category.id} href={`/productos?categoria=${category.id}`}>
              <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white hover:-translate-y-2">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                  <Image
                    src={categoryImages[category.id as keyof typeof categoryImages] || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                    <span className="text-white font-semibold text-lg">Ver Colección</span>
                  </div>
                </div>
                <CardContent className="pt-6 pb-8 text-center space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-amber-700 transition-all">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
