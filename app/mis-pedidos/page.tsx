"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storage, type Order } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function MisPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/login")
    }
  }, [mounted, isLoading, user, router])

  useEffect(() => {
    if (user) {
      loadOrders()
    }

    const handleOrdersUpdate = () => {
      if (user) {
        loadOrders()
      }
    }

    window.addEventListener("ordersUpdated", handleOrdersUpdate)
    return () => window.removeEventListener("ordersUpdated", handleOrdersUpdate)
  }, [user])

  const loadOrders = () => {
    if (user) {
      const userOrders = storage.getUserOrders(user.id)
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      confirmed: { label: "Confirmado", className: "bg-blue-100 text-blue-800 border-blue-300" },
      completed: { label: "Completado", className: "bg-green-100 text-green-800 border-green-300" },
      cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800 border-red-300" },
    }
    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      cadenas: "Cadenas",
      anillos: "Anillos",
      pulseras: "Pulseras",
      aretes: "Aretes",
    }
    return names[category] || category
  }

  if (!mounted || isLoading) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-6xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-serif font-bold mb-4">Mis Pedidos</h1>
            <p className="text-gray-600">Revisa el estado de tus pedidos</p>
          </div>

          {orders.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="py-16 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No tienes pedidos aún</h3>
                  <p className="text-gray-600">Comienza a comprar para ver tus pedidos aquí</p>
                </div>
                <Link href="/productos">
                  <Button className="bg-amber-600 hover:bg-amber-700">Ver Productos</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.image ? (
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                Sin imagen
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold line-clamp-1">{product.name}</h4>
                            <p className="text-sm text-gray-500">{getCategoryName(product.category)}</p>
                            <p className="text-amber-600 font-semibold mt-1">
                              ${product.price.toLocaleString("es-CO")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t flex items-center justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-amber-600">${order.total.toLocaleString("es-CO")}</span>
                    </div>
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
