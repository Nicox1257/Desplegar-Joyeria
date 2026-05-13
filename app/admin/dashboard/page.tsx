"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, FileText, Settings, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { storage } from "@/lib/store"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 4,
    orders: 0,
    featuredProducts: 0,
  })

  useEffect(() => {
    const updateStats = () => {
      const products = storage.getProducts()
      const orders = storage.getOrders()
      const featured = products.filter((p) => p.featured)

      setStats({
        products: products.length,
        categories: 4,
        orders: orders.length,
        featuredProducts: featured.length,
      })
    }

    updateStats()

    window.addEventListener("productsUpdated", updateStats)
    window.addEventListener("ordersUpdated", updateStats)

    return () => {
      window.removeEventListener("productsUpdated", updateStats)
      window.removeEventListener("ordersUpdated", updateStats)
    }
  }, [])

  const cards = [
    {
      title: "Productos",
      value: stats.products,
      subtitle: `${stats.featuredProducts} destacados`,
      icon: Package,
      href: "/admin/productos",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pedidos",
      value: stats.orders,
      subtitle: "Total de pedidos",
      icon: ShoppingCart,
      href: "/admin/pedidos",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Contenido",
      value: "Editar",
      subtitle: "Textos y beneficios",
      icon: FileText,
      href: "/admin/contenido",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Configuración",
      value: "Ajustes",
      subtitle: "Contacto y redes",
      icon: Settings,
      href: "/admin/configuracion",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-serif font-bold">Bienvenido al Panel</h2>
        <p className="text-gray-600 mt-2">Gestiona tu tienda de joyería desde aquí</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <Link key={card.title} href={card.href}>
              <Card
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                  <div
                    className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center transition-transform hover:scale-110`}
                  >
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Resumen de la Tienda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{stats.products}</div>
              <div className="text-sm text-gray-600">Total Productos</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.orders}</div>
              <div className="text-sm text-gray-600">Pedidos</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
              <div className="text-sm text-gray-600">Categorías</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.featuredProducts}</div>
              <div className="text-sm text-gray-600">Destacados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link
            href="/admin/productos/nuevo"
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-all hover:shadow-md"
          >
            <h3 className="font-semibold text-amber-600">Agregar Nuevo Producto</h3>
            <p className="text-sm text-gray-600 mt-1">Añade joyas a tu catálogo</p>
          </Link>
          <Link
            href="/admin/pedidos"
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-all hover:shadow-md"
          >
            <h3 className="font-semibold text-amber-600">Ver Pedidos</h3>
            <p className="text-sm text-gray-600 mt-1">Gestiona los pedidos de clientes</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
