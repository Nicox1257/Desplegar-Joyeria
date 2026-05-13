"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { storage, type Product } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductosAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("todos")

  useEffect(() => {
    loadProducts()

    const handleProductsUpdate = () => {
      loadProducts()
    }

    window.addEventListener("productsUpdated", handleProductsUpdate)

    return () => {
      window.removeEventListener("productsUpdated", handleProductsUpdate)
    }
  }, [])

  const loadProducts = () => {
    setProducts(storage.getProducts())
  }

  const handleDelete = (id: string) => {
    storage.deleteProduct(id)
    loadProducts()
  }

  const categoryNames = {
    cadenas: "Cadenas",
    anillos: "Anillos",
    pulseras: "Pulseras",
    aretes: "Aretes",
  }

  const filteredProducts = activeCategory === "todos" ? products : products.filter((p) => p.category === activeCategory)

  const renderProductGrid = (productsToShow: Product[]) => {
    if (productsToShow.length === 0) {
      return (
        <Card className="border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No hay productos en esta categoría</p>
            <Link href="/admin/productos/nuevo">
              <Button className="bg-[#d4af37] hover:bg-[#b8941f]">Crear Producto</Button>
            </Link>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsToShow.map((product) => (
          <Card key={product.id} className="overflow-hidden border-gray-200 hover:border-[#d4af37] transition-colors">
            <div className="relative aspect-square bg-gray-50">
              {product.image ? (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
              )}
              {product.featured && (
                <Badge className="absolute top-2 right-2 bg-[#d4af37] hover:bg-[#b8941f] border-0">Destacado</Badge>
              )}
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1 text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{categoryNames[product.category]}</p>
              </div>
              <p className="text-lg font-bold text-[#d4af37]">${product.price.toLocaleString("es-CO")}</p>
              <div className="flex gap-2">
                <Link href={`/admin/productos/${product.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 bg-transparent border-gray-300 hover:border-[#d4af37] hover:text-[#d4af37]"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 bg-transparent border-gray-300 hover:border-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Productos</h2>
          <p className="text-gray-600 mt-2">Gestiona el catálogo de joyas</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button className="bg-[#d4af37] hover:bg-[#b8941f] gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="todos" className="w-full" onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-5 bg-gray-100">
          <TabsTrigger value="todos" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white">
            Todos ({products.length})
          </TabsTrigger>
          <TabsTrigger value="cadenas" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white">
            Cadenas ({products.filter((p) => p.category === "cadenas").length})
          </TabsTrigger>
          <TabsTrigger value="anillos" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white">
            Anillos ({products.filter((p) => p.category === "anillos").length})
          </TabsTrigger>
          <TabsTrigger value="pulseras" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white">
            Pulseras ({products.filter((p) => p.category === "pulseras").length})
          </TabsTrigger>
          <TabsTrigger value="aretes" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white">
            Aretes ({products.filter((p) => p.category === "aretes").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-6">
          {renderProductGrid(products)}
        </TabsContent>
        <TabsContent value="cadenas" className="mt-6">
          {renderProductGrid(products.filter((p) => p.category === "cadenas"))}
        </TabsContent>
        <TabsContent value="anillos" className="mt-6">
          {renderProductGrid(products.filter((p) => p.category === "anillos"))}
        </TabsContent>
        <TabsContent value="pulseras" className="mt-6">
          {renderProductGrid(products.filter((p) => p.category === "pulseras"))}
        </TabsContent>
        <TabsContent value="aretes" className="mt-6">
          {renderProductGrid(products.filter((p) => p.category === "aretes"))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
