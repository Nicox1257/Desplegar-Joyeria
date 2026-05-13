"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { storage, type SiteConfig } from "@/lib/store"

export function HeroSection() {
  const [config, setConfig] = useState<SiteConfig | null>(null)

  useEffect(() => {
    setConfig(storage.getConfig())
  }, [])

  if (!config) return null

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-[#f4e4bc]/20 py-20 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight text-balance">
              {config.heroTitle}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed text-pretty">{config.heroDescription}</p>
            <Link href="/productos">
              <Button size="lg" className="bg-[#d4af37] hover:bg-[#b8941f] text-white px-8 py-6 text-lg shadow-lg">
                {config.heroCTA}
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 shadow-2xl border border-gray-200">
              <Image
                src="/elegant-gold-plated-jewelry-necklaces-bracelets-on.jpg"
                alt="Joyería en Oro Laminado Luxara"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Decoración dorada */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#d4af37] rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#d4af37] rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
