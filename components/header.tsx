"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, ChevronDown, User, LogOut, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { storage } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const updateCartCount = () => {
      const currentUser = localStorage.getItem("luxara_user")
      if (currentUser) {
        const userId = JSON.parse(currentUser).id
        setCartCount(storage.getCart(userId).length)
      } else {
        setCartCount(0)
      }
    }

    updateCartCount()
    window.addEventListener("storage", updateCartCount)
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const categories = storage.getConfig().categories

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Luxara Joyería" width={180} height={60} className="h-12 w-auto" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors">
            Inicio
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors outline-none">
              Productos
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/productos" className="w-full cursor-pointer">
                  Todos los Productos
                </Link>
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link href={`/productos?categoria=${category.id}`} className="w-full cursor-pointer">
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/nosotros" className="text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors">
            Nosotros
          </Link>
          <Link href="/contacto" className="text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:text-[#d4af37] opacity-30 hover:opacity-100 transition-opacity"
              title="Admin"
            >
              <div className="w-2 h-2 rounded-full bg-gray-400" />
            </Button>
          </Link>

          <Link href="/carrito">
            <Button variant="ghost" size="icon" className="relative hover:text-[#d4af37]">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#d4af37] hover:bg-[#b8941f] text-white border-0">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-[#d4af37]">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/mis-pedidos" className="w-full cursor-pointer">
                    <Package className="h-4 w-4 mr-2" />
                    Mis Pedidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" size="sm" className="hover:text-[#d4af37]">
                Iniciar Sesión
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className="text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Todos los Productos
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/productos?categoria=${category.id}`}
                className="text-sm font-medium text-gray-500 hover:text-[#d4af37] transition-colors pl-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/nosotros"
              className="text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className="text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            {user ? (
              <>
                <div className="text-sm font-medium text-gray-900 pt-2 border-t">{user.name}</div>
                <Link
                  href="/mis-pedidos"
                  className="text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis Pedidos
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors text-left"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-[#d4af37] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
