"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { storage, type Product } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Trash2, ShoppingBag, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CarritoPage() {
  const [cart, setCart] = useState<Product[]>([])
  const [config, setConfig] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    setConfig(storage.getConfig())
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/login")
    }
  }, [mounted, isLoading, user, router])

  useEffect(() => {
    if (user) {
      loadCart()
    }
  }, [user])

  const loadCart = () => {
    if (user) {
      setCart(storage.getCart(user.id))
    }
  }

  const removeFromCart = (index: number) => {
    if (user) {
      storage.removeFromCart(index, user.id)
      loadCart()
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }

  const calculateTotal = () => {
    return cart.reduce((sum, product) => sum + product.price, 0)
  }

  const sendToWhatsApp = () => {
    if (cart.length === 0 || !user) return

    // Create order in the system
    const order = storage.createOrder(user.id, user.name, user.email, cart)

    const whatsappNumber = config?.contact?.whatsapp || "573245573332"

    let message = "🛍️ *Nuevo Pedido - Luxara Joyería*\n\n"
    message += `👤 *Cliente:* ${user.name}\n`
    message += `📧 *Email:* ${user.email}\n`
    message += `🔢 *Pedido #:* ${order.id}\n\n`
    message += "📦 *Productos:*\n"

    cart.forEach((product, index) => {
      message += `\n${index + 1}. *${product.name}*\n`
      message += `   Categoría: ${getCategoryName(product.category)}\n`
      message += `   Precio: $${product.price.toLocaleString("es-CO")}\n`
      if (product.specifications) {
        message += `   Especificaciones: ${product.specifications}\n`
      }
    })

    message += `\n💰 *Total: $${calculateTotal().toLocaleString("es-CO")}*\n\n`
    message += "¿Podrían confirmar la disponibilidad de estos productos?"

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")

    // Clear cart and redirect to orders
    storage.clearCart(user.id)
    loadCart()
    window.dispatchEvent(new Event("cartUpdated"))

    setTimeout(() => {
      router.push("/mis-pedidos")
    }, 1000)
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
        <div className="container max-w-4xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-serif font-bold mb-4">Carrito de Compras</h1>
            <p className="text-gray-600">Revisa tus productos antes de hacer el pedido</p>
          </div>

          {cart.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="py-16 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-600">Agrega productos para comenzar tu pedido</p>
                </div>
                <Link href="/productos">
                  <Button className="bg-amber-600 hover:bg-amber-700">Ver Productos</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <Card>
                <CardContent className="p-6 space-y-4">
                  {cart.map((product, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0 hover:bg-gray-50 transition-colors rounded-lg p-2"
                    >
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                            priority={index < 3}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-500">{getCategoryName(product.category)}</p>
                        <p className="text-lg font-bold text-amber-600 mt-2">
                          ${product.price.toLocaleString("es-CO")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 transition-all hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold text-amber-600">
                      ${calculateTotal().toLocaleString("es-CO")}
                    </span>
                  </div>
                  <Button
                    onClick={sendToWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 gap-2 text-lg py-6 transition-all hover:scale-105"
                  >
                    <Send className="w-5 h-5" />
                    Enviar Pedido por WhatsApp
                  </Button>
                  <p className="text-sm text-gray-600 text-center mt-4">
                    Al hacer clic, se creará tu pedido y se abrirá WhatsApp
                  </p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Link href="/productos">
                  <Button variant="outline" className="bg-transparent hover:bg-gray-100 transition-colors">
                    Seguir Comprando
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
