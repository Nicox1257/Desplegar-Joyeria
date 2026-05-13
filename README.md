# Luxara Joyería - Tienda de Joyería Fina

Una elegante tienda en línea de joyería construida con Next.js 15, React 19 y Tailwind CSS.

## 🚀 Cómo ejecutar el proyecto desde Visual Studio Code

### Requisitos previos
- Node.js 18 o superior instalado en tu computadora
- Visual Studio Code instalado

### Pasos para ejecutar:

1. **Abre el proyecto en VS Code**
   - Abre Visual Studio Code
   - Ve a `Archivo > Abrir Carpeta` y selecciona la carpeta del proyecto

2. **Abre la terminal integrada**
   - Presiona `Ctrl + Ñ` (Windows/Linux) o `Cmd + Ñ` (Mac)
   - O ve a `Terminal > Nueva Terminal` en el menú

3. **Instala las dependencias** (solo la primera vez)
   \`\`\`bash
   npm install
   \`\`\`
   Espera a que termine de instalar todos los paquetes necesarios.

4. **Inicia el servidor de desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Abre el navegador**
   - El proyecto estará disponible en: `http://localhost:3000`
   - Abre tu navegador y ve a esa dirección

6. **¡Listo!** Ahora verás el proyecto funcionando correctamente con:
   - ✅ Todas las animaciones
   - ✅ Imágenes cargadas correctamente
   - ✅ Carrito funcionando
   - ✅ Panel de administración funcionando

## 📁 Estructura del Proyecto

\`\`\`
luxara-joyeria/
├── app/                    # Páginas de Next.js
│   ├── page.tsx           # Página principal
│   ├── productos/         # Catálogo de productos
│   ├── carrito/           # Carrito de compras
│   ├── admin/             # Panel de administración
│   └── nosotros/          # Página sobre nosotros
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y lógica
│   ├── store.ts          # Sistema de almacenamiento local
│   └── auth.ts           # Autenticación del admin
└── public/               # Archivos estáticos (imágenes)
\`\`\`

## 🔑 Acceso al Panel de Administración

- **URL**: `http://localhost:3000/admin`
- **Usuario**: `admin`
- **Contraseña**: `luxara2024`

Desde el panel puedes:
- Agregar, editar y eliminar productos
- Modificar el contenido del sitio
- Configurar información de contacto
- Ver estadísticas

## 🛠️ Comandos Disponibles

\`\`\`bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run start    # Inicia el servidor de producción
npm run lint     # Ejecuta el linter
\`\`\`

## 📱 Características

- ✨ Diseño elegante y responsivo
- 🛒 Carrito de compras funcional
- 📱 Integración con WhatsApp para pedidos
- 👨‍💼 Panel de administración completo
- 🎨 Animaciones suaves y modernas
- 📦 Sistema de categorías (Cadenas, Anillos, Pulseras, Aretes)
- 💾 Almacenamiento local (LocalStorage)

## 🎨 Tecnologías Utilizadas

- **Next.js 15** - Framework de React
- **React 19** - Biblioteca de UI
- **Tailwind CSS v4** - Estilos
- **TypeScript** - Tipado estático
- **Lucide React** - Iconos
- **Radix UI** - Componentes accesibles

## 📝 Notas Importantes

- Los datos se guardan en el navegador (LocalStorage)
- Para ver los cambios en tiempo real, el servidor debe estar corriendo
- Las imágenes se cargan desde la carpeta `public/`
- El proyecto usa Next.js 15 con App Router

## 🐛 Solución de Problemas

### El proyecto no se ve bien al abrir los archivos
**Solución**: Debes ejecutar `npm run dev` para iniciar el servidor de desarrollo.

### Error "Cannot find module"
**Solución**: Ejecuta `npm install` para instalar las dependencias.

### El puerto 3000 está ocupado
**Solución**: El servidor se iniciará automáticamente en otro puerto (3001, 3002, etc.)

### Las imágenes no cargan
**Solución**: Asegúrate de que el servidor esté corriendo con `npm run dev`

## 📞 Contacto

- **WhatsApp**: +57 324 557 3332
- **Email**: luxarajoyeria@gmail.com
- **Instagram**: @luxarajoyeria

---

Desarrollado con ❤️ para Luxara Joyería
