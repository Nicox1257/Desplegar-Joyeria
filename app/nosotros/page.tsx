"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { storage } from "@/lib/store"

export default function NosotrosPage() {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    setConfig(storage.getConfig())
  }, [])

  if (!config) return null

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/elegant-gold-pattern.png')] opacity-5" />
          <div className="container max-w-4xl relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-balance bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                {config.about.title}
              </h1>
              <p className="text-xl text-gray-300 text-pretty">{config.about.subtitle}</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">{config.about.history}</p>
              <p className="text-gray-700 leading-relaxed text-lg">{config.about.mission}</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-gray-900">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {config.about.values.map((value: any, index: number) => (
                <Card
                  key={index}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white"
                >
                  <CardContent className="pt-12 pb-8 text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                        {index === 0 && <Award className="w-8 h-8 text-white" />}
                        {index === 1 && <Heart className="w-8 h-8 text-white" />}
                        {index === 2 && <Sparkles className="w-8 h-8 text-white" />}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
