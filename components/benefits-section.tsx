"use client"

import { Diamond, Package, Handshake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { storage, type SiteConfig } from "@/lib/store"

const iconMap = {
  diamond: Diamond,
  package: Package,
  handshake: Handshake,
}

export function BenefitsSection() {
  const [config, setConfig] = useState<SiteConfig | null>(null)

  useEffect(() => {
    setConfig(storage.getConfig())
  }, [])

  if (!config) return null

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-balance text-gray-900">
          ¿Por qué comprar con nosotros?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {config.benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon as keyof typeof iconMap]
            return (
              <Card
                key={index}
                className="border border-gray-200 shadow-md hover:shadow-xl transition-all hover:border-[#d4af37] bg-white"
              >
                <CardContent className="pt-12 pb-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#f4e4bc] flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[#d4af37]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#d4af37]">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-pretty">{benefit.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
