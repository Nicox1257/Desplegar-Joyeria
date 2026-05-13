// Sistema de almacenamiento local para productos y configuración

export interface Product {
  id: string
  name: string
  category: "cadenas" | "anillos" | "pulseras" | "aretes"
  price: number
  description: string
  specifications: string
  image: string
  featured: boolean
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  products: Product[]
  total: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
}

export interface SiteConfig {
  heroTitle: string
  heroDescription: string
  heroCTA: string
  benefits: {
    title: string
    description: string
    icon: string
  }[]
  about: {
    title: string
    subtitle: string
    history: string
    mission: string
    values: {
      title: string
      description: string
    }[]
  }
  contact: {
    phone: string
    email: string
    whatsapp: string
    instagram: string
    facebook: string
    tiktok: string
    address: string
    mapUrl: string
  }
  categories: {
    id: string
    name: string
    description: string
  }[]
}

const DEFAULT_CONFIG: SiteConfig = {
  heroTitle: "Elegancia y Distinción en Cada Pieza",
  heroDescription:
    "Descubre nuestra exclusiva colección de joyería fina, elaborada con los más altos estándares de calidad. Cada pieza es una obra de arte diseñada para realzar tu estilo único.",
  heroCTA: "Ver Catálogo",
  benefits: [
    {
      title: "Alta Calidad",
      description: "Materiales seleccionados y acabados premium garantizan joyas duraderas y elegantes.",
      icon: "diamond",
    },
    {
      title: "Envíos Seguros",
      description: "Enviamos a todo el país con embalaje especializado y seguimiento en tiempo real.",
      icon: "package",
    },
    {
      title: "Confianza Total",
      description: "Clientes felices nos respaldan. Garantía y atención personalizada para cada pedido.",
      icon: "handshake",
    },
  ],
  about: {
    title: "Nuestra Historia",
    subtitle: "Más de una década creando momentos inolvidables con joyas excepcionales",
    history:
      "Luxara Joyería nació en 2012 con un sueño: hacer accesible la elegancia y distinción de la joyería fina para todos. Desde nuestros humildes inicios en Villavicencio, hemos crecido hasta convertirnos en una de las joyerías más reconocidas de la región, manteniendo siempre nuestro compromiso con la calidad y el servicio excepcional.",
    mission:
      "Nuestra misión es ofrecer joyas de oro laminado de la más alta calidad, con diseños únicos que realcen la belleza y personalidad de cada cliente. Creemos que cada pieza cuenta una historia y nos esforzamos por ser parte de los momentos más especiales de tu vida.",
    values: [
      {
        title: "Calidad Premium",
        description: "Solo trabajamos con materiales de oro laminado certificados de la más alta calidad",
      },
      {
        title: "Atención Personalizada",
        description: "Cada cliente es único y merece un servicio excepcional y asesoría experta",
      },
      {
        title: "Diseños Únicos",
        description: "Piezas exclusivas que destacan tu personalidad y estilo con elegancia",
      },
    ],
  },
  contact: {
    phone: "+57 324 557 3332",
    email: "luxarajoyeria@gmail.com",
    whatsapp: "573245573332",
    instagram: "https://instagram.com/luxarajoyeria",
    facebook: "https://facebook.com/luxarajoyeria",
    tiktok: "https://tiktok.com/@luxarajoyeria",
    address: "Villavicencio, Meta, Colombia",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127470.89537611!2d-73.6279!3d4.1420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3e2e5c5c5c5c5c%3A0x5c5c5c5c5c5c5c5c!2sVillavicencio%2C%20Meta!5e0!3m2!1ses!2sco!4v1234567890",
  },
  categories: [
    { id: "cadenas", name: "Cadenas", description: "Elegancia en cada eslabón" },
    { id: "anillos", name: "Anillos", description: "Símbolos de compromiso y estilo" },
    { id: "pulseras", name: "Pulseras", description: "Sofisticación en tu muñeca" },
    { id: "aretes", name: "Aretes", description: "Brillo que ilumina tu rostro" },
  ],
}

export const storage = {
  // Configuración del sitio
  getConfig(): SiteConfig {
    if (typeof window === "undefined") return DEFAULT_CONFIG
    const config = localStorage.getItem("luxara_config")
    return config ? JSON.parse(config) : DEFAULT_CONFIG
  },

  setConfig(config: SiteConfig) {
    if (typeof window === "undefined") return
    localStorage.setItem("luxara_config", JSON.stringify(config))
  },

  // Productos
  getProducts(): Product[] {
    if (typeof window === "undefined") return []
    const products = localStorage.getItem("luxara_products")
    return products ? JSON.parse(products) : []
  },

  setProducts(products: Product[]) {
    if (typeof window === "undefined") return
    localStorage.setItem("luxara_products", JSON.stringify(products))
  },

  addProduct(product: Omit<Product, "id" | "createdAt">): Product {
    const products = this.getProducts()
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    products.push(newProduct)
    this.setProducts(products)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("productsUpdated"))
    }
    return newProduct
  },

  updateProduct(id: string, updates: Partial<Product>) {
    const products = this.getProducts()
    const index = products.findIndex((p) => p.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...updates }
      this.setProducts(products)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("productsUpdated"))
      }
    }
  },

  deleteProduct(id: string) {
    const products = this.getProducts().filter((p) => p.id !== id)
    this.setProducts(products)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("productsUpdated"))
    }
  },

  getProductsByCategory(category: string): Product[] {
    return this.getProducts().filter((p) => p.category === category)
  },

  getFeaturedProducts(): Product[] {
    return this.getProducts()
      .filter((p) => p.featured)
      .slice(0, 8)
  },

  getCart(userId?: string): Product[] {
    if (typeof window === "undefined") return []

    // If no userId provided, try to get current user
    if (!userId) {
      const currentUser = localStorage.getItem("luxara_user")
      if (!currentUser) return []
      userId = JSON.parse(currentUser).id
    }

    const cartKey = `luxara_cart_${userId}`
    const cart = localStorage.getItem(cartKey)
    return cart ? JSON.parse(cart) : []
  },

  setCart(cart: Product[], userId?: string) {
    if (typeof window === "undefined") return

    // If no userId provided, try to get current user
    if (!userId) {
      const currentUser = localStorage.getItem("luxara_user")
      if (!currentUser) return
      userId = JSON.parse(currentUser).id
    }

    const cartKey = `luxara_cart_${userId}`
    localStorage.setItem(cartKey, JSON.stringify(cart))
  },

  addToCart(product: Product, userId?: string) {
    const cart = this.getCart(userId)
    cart.push(product)
    this.setCart(cart, userId)
  },

  removeFromCart(index: number, userId?: string) {
    const cart = this.getCart(userId)
    cart.splice(index, 1)
    this.setCart(cart, userId)
  },

  clearCart(userId?: string) {
    this.setCart([], userId)
  },

  getOrders(): Order[] {
    if (typeof window === "undefined") return []
    const orders = localStorage.getItem("luxara_orders")
    return orders ? JSON.parse(orders) : []
  },

  setOrders(orders: Order[]) {
    if (typeof window === "undefined") return
    localStorage.setItem("luxara_orders", JSON.stringify(orders))
  },

  getUserOrders(userId: string): Order[] {
    return this.getOrders().filter((order) => order.userId === userId)
  },

  createOrder(userId: string, userName: string, userEmail: string, products: Product[]): Order {
    const orders = this.getOrders()
    const total = products.reduce((sum, product) => sum + product.price, 0)

    const newOrder: Order = {
      id: Date.now().toString(),
      userId,
      userName,
      userEmail,
      products,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    orders.push(newOrder)
    this.setOrders(orders)

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ordersUpdated"))
    }

    return newOrder
  },

  updateOrderStatus(orderId: string, status: Order["status"]) {
    const orders = this.getOrders()
    const index = orders.findIndex((o) => o.id === orderId)
    if (index !== -1) {
      orders[index].status = status
      this.setOrders(orders)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("ordersUpdated"))
      }
    }
  },
}
