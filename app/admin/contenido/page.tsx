"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, type SiteConfig } from "@/lib/store"
import { Save } from "lucide-react"

export default function ContenidoAdminPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setConfig(storage.getConfig())
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (config) {
      storage.setConfig(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      window.location.reload()
    }
  }

  if (!config) return null

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold">Contenido del Sitio</h2>
          <p className="text-gray-600 mt-2">Edita los textos que aparecen en la página</p>
        </div>
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700 gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Guardado!" : "Guardar Cambios"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sección Hero (Inicio)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Título Principal</Label>
            <Input
              id="heroTitle"
              value={config.heroTitle}
              onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroDescription">Descripción</Label>
            <Textarea
              id="heroDescription"
              value={config.heroDescription}
              onChange={(e) => setConfig({ ...config, heroDescription: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroCTA">Texto del Botón</Label>
            <Input
              id="heroCTA"
              value={config.heroCTA}
              onChange={(e) => setConfig({ ...config, heroCTA: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beneficios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {config.benefits.map((benefit, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-semibold text-amber-600">Beneficio {index + 1}</h4>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={benefit.title}
                  onChange={(e) => {
                    const newBenefits = [...config.benefits]
                    newBenefits[index].title = e.target.value
                    setConfig({ ...config, benefits: newBenefits })
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={benefit.description}
                  onChange={(e) => {
                    const newBenefits = [...config.benefits]
                    newBenefits[index].description = e.target.value
                    setConfig({ ...config, benefits: newBenefits })
                  }}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Página de Nosotros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aboutTitle">Título</Label>
            <Input
              id="aboutTitle"
              value={config.about.title}
              onChange={(e) => setConfig({ ...config, about: { ...config.about, title: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aboutSubtitle">Subtítulo</Label>
            <Input
              id="aboutSubtitle"
              value={config.about.subtitle}
              onChange={(e) => setConfig({ ...config, about: { ...config.about, subtitle: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aboutHistory">Historia</Label>
            <Textarea
              id="aboutHistory"
              value={config.about.history}
              onChange={(e) => setConfig({ ...config, about: { ...config.about, history: e.target.value } })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aboutMission">Misión</Label>
            <Textarea
              id="aboutMission"
              value={config.about.mission}
              onChange={(e) => setConfig({ ...config, about: { ...config.about, mission: e.target.value } })}
              rows={4}
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold">Valores</h4>
            {config.about.values.map((value, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <h5 className="font-semibold text-amber-600">Valor {index + 1}</h5>
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={value.title}
                    onChange={(e) => {
                      const newValues = [...config.about.values]
                      newValues[index].title = e.target.value
                      setConfig({ ...config, about: { ...config.about, values: newValues } })
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={value.description}
                    onChange={(e) => {
                      const newValues = [...config.about.values]
                      newValues[index].description = e.target.value
                      setConfig({ ...config, about: { ...config.about, values: newValues } })
                    }}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={config.contact.phone}
              onChange={(e) => setConfig({ ...config, contact: { ...config.contact, phone: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={config.contact.email}
              onChange={(e) => setConfig({ ...config, contact: { ...config.contact, email: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp (solo números)</Label>
            <Input
              id="whatsapp"
              value={config.contact.whatsapp}
              onChange={(e) => setConfig({ ...config, contact: { ...config.contact, whatsapp: e.target.value } })}
              placeholder="573245573332"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={config.contact.instagram}
              onChange={(e) => setConfig({ ...config, contact: { ...config.contact, instagram: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={config.contact.facebook}
              onChange={(e) => setConfig({ ...config, contact: { ...config.contact, facebook: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok URL</Label>
            <Input
              id="tiktok"
              value={config.contact.tiktok}
              onChange={(e) => setConfig({ ...config, contact: { ...config.contact, tiktok: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={config.contact.address}
              onChange={(e) => setConfig({ ...config, contact: { ...config.contact, address: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapUrl">URL del Mapa de Google (iframe embed)</Label>
            <Textarea
              id="mapUrl"
              value={config.contact.mapUrl}
              onChange={(e) => setConfig({ ...config, contact: { ...config.contact, mapUrl: e.target.value } })}
              rows={3}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
