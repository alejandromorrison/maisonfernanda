# 🚀 Guía de Despliegue a Vercel - Maison Fernanda

## ✅ Estado del Proyecto

El sitio web de Maison Fernanda está **100% traducido al español** y listo para desplegarse en Vercel.

---

## 📋 Pasos para Desplegar en Vercel

### 1. **Preparar el Repositorio Git**

Primero, asegúrate de que todo esté en Git:

```bash
cd /home/nihilo/Documents/maison-fernanda-frontend/maison-fernanda-frontend
git init
git add .
git commit -m "Sitio web Maison Fernanda listo para producción - 100% en español"
```

Luego sube a GitHub:
```bash
git remote add origin https://github.com/TU_USUARIO/maison-fernanda-frontend.git
git branch -M main
git push -u origin main
```

### 2. **Crear Cuenta en Vercel**

1. Ve a [https://vercel.com](https://vercel.com)
2. Regístrate con tu cuenta de GitHub
3. Autoriza a Vercel para acceder a tus repositorios

### 3. **Importar el Proyecto**

1. En el dashboard de Vercel, haz clic en **"New Project"**
2. Selecciona el repositorio `maison-fernanda-frontend`
3. Vercel detectará automáticamente que es un proyecto Next.js

### 4. **Configurar Variables de Entorno**

Antes de desplegar, **configura estas variables de entorno** en Vercel:

| Variable | Valor de Ejemplo | Descripción |
|----------|------------------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://tu-api-backend.com` | URL de tu API backend |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Tu clave pública de Stripe (producción) |

**Cómo agregarlas:**
- En la pantalla de configuración del proyecto
- Busca la sección **"Environment Variables"**
- Agrega cada variable con su valor
- Asegúrate de seleccionar **Production**, **Preview**, y **Development**

### 5. **Configuración del Build**

Vercel configurará automáticamente:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

**No necesitas cambiar nada aquí** ✅

### 6. **Desplegar**

1. Haz clic en **"Deploy"**
2. Vercel construirá y desplegará tu sitio
3. El proceso toma aproximadamente 2-5 minutos
4. Recibirás una URL como: `https://maison-fernanda-frontend.vercel.app`

---

## 🌐 Dominio Personalizado

### Agregar tu Propio Dominio

1. En el dashboard de tu proyecto en Vercel
2. Ve a **Settings** → **Domains**
3. Agrega tu dominio (ej: `www.maisonfernanda.com`)
4. Sigue las instrucciones para configurar los DNS

**Registros DNS Necesarios:**
```
Tipo: A
Nombre: @
Valor: 76.76.21.21

Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
```

---

## 🔧 Archivos Importantes Configurados

### ✅ `next.config.js`
- Optimizado para producción
- Configuración de imágenes con remote patterns
- SWC minification habilitado

### ✅ `vercel.json`
- Headers de seguridad configurados
- Framework Next.js especificado
- Región optimizada (iad1 - US East)

### ✅ `.gitignore`
- `.env.local` ignorado (correcto)
- `.next/` y `out/` ignorados
- `node_modules/` ignorado

---

## 📱 Características del Sitio (100% en Español)

### Páginas Traducidas:
- ✅ **Inicio** (`/`) - Hero, productos destacados, newsletter
- ✅ **Colección** (`/collection`) - Filtros, ordenamiento, paginación
- ✅ **Detalle de Producto** (`/product/[slug]`) - Galería, selector de talla, guía de tallas
- ✅ **Carrito** (`/cart`) - Resumen del pedido, cálculo de envío
- ✅ **Pago** (`/checkout`) - Formulario de dirección, integración con Stripe
- ✅ **Cuenta** (`/account`) - Login, registro, historial de pedidos
- ✅ **Administrador** (`/admin`) - Gestión de pedidos y productos
- ✅ **Éxito** (`/checkout/success`) - Confirmación de pedido

### Componentes Traducidos:
- ✅ **Header** - Navegación, búsqueda, carrito
- ✅ **Footer** - Enlaces, newsletter, redes sociales
- ✅ **CartDrawer** - Carrito lateral deslizante
- ✅ **SearchBar** - Búsqueda con autocompletado
- ✅ **ProductCard** - Tarjetas de producto con favoritos

---

## 🔗 URLs y Recursos

### Backend API
Asegúrate de que tu backend esté desplegado y configurado:
- Debe tener CORS habilitado para tu dominio de Vercel
- Debe estar usando HTTPS
- Las rutas de API deben estar funcionando correctamente

### Stripe
- Usa claves de **producción** (`pk_live_...`) en Vercel
- Configura los webhooks de Stripe para apuntar a tu backend en producción

---

## 🚨 Checklist Pre-Despliegue

Antes de desplegar a producción, verifica:

- [ ] Backend API está desplegado y funcionando
- [ ] Variables de entorno configuradas en Vercel
- [ ] Claves de Stripe de producción obtenidas
- [ ] Dominio personalizado comprado (opcional)
- [ ] DNS configurado para el dominio (si aplica)
- [ ] Imágenes de productos subidas al servidor
- [ ] Base de datos poblada con productos
- [ ] Webhooks de Stripe configurados
- [ ] CORS habilitado en el backend para el dominio de Vercel

---

## 📊 Después del Despliegue

### Monitoreo
Vercel proporciona automáticamente:
- **Analytics** - Visitas, rendimiento, core web vitals
- **Speed Insights** - Métricas de velocidad
- **Logs** - Registros de servidor y errores

### Despliegues Automáticos
- Cada `push` a `main` despliega automáticamente
- Preview deployments para ramas y pull requests
- Rollback instantáneo a versiones anteriores

### Optimizaciones Automáticas
Vercel optimiza automáticamente:
- Imágenes (Next.js Image Optimization)
- Código (minificación, tree-shaking)
- Edge caching
- CDN global

---

## 🆘 Soporte

### Problemas Comunes

**Error: "Module not found"**
- Solución: Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm install` localmente para verificar

**Error: "API request failed"**
- Solución: Verifica la variable `NEXT_PUBLIC_API_URL`
- Asegúrate de que el backend esté accesible públicamente

**Error: "Stripe not loading"**
- Solución: Verifica la variable `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Usa la clave de producción correcta

### Recursos Útiles
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Soporte de Vercel](https://vercel.com/support)

---

## ✨ ¡Listo para Producción!

Tu sitio web de Maison Fernanda está completamente preparado y traducido al español. 
Solo necesitas:
1. Configurar las variables de entorno
2. Conectar tu repositorio de GitHub
3. Hacer clic en "Deploy"

**¡Buena suerte con tu lanzamiento! 🎉**

---

*Última actualización: Octubre 2025*

