"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Upload, Trash2 } from "lucide-react"
import { storage } from "@/lib/store"

export default function ConfiguracionPage() {
  const handleExport = () => {
    const data = {
      products: storage.getProducts(),
      config: storage.getConfig(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `luxara-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          if (data.products) storage.setProducts(data.products)
          if (data.config) storage.setConfig(data.config)
          window.location.reload()
        } catch (error) {
          alert("Error al importar datos")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleClearAll = () => {
    if (confirm("¿Estás seguro? Esto eliminará todos los productos y restablecerá la configuración.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-serif font-bold">Configuración</h2>
        <p className="text-gray-600 mt-2">Gestiona los datos de tu tienda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Respaldo de Datos</CardTitle>
          <CardDescription>Exporta o importa todos tus productos y configuración</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleExport} variant="outline" className="w-full gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Exportar Datos
          </Button>
          <div>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
            <label htmlFor="import-file">
              <Button type="button" variant="outline" className="w-full gap-2 bg-transparent" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  Importar Datos
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
          <CardDescription>Acciones irreversibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClearAll} variant="destructive" className="w-full gap-2">
            <Trash2 className="w-4 h-4" />
            Eliminar Todos los Datos
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
