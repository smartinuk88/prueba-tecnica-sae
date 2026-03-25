# Prueba Técnica - Esférico SAE

## 📋 Descripción

Esta prueba técnica consiste en desarrollar una aplicación web con Next.js que permita visualizar usuarios y sus parcelas agrícolas en un mapa interactivo.

---

## ⚠️ Notas importantes

- **Si no da tiempo a completar todo**, prioriza las tareas que consideres más importantes. Preferimos ver menos funcionalidades bien implementadas que muchas a medias.
- **Puedes utilizar herramientas de IA** (ChatGPT, Copilot, Claude, etc.) sin ningún problema. Sin embargo, ten en cuenta que posteriormente se realizará una entrevista técnica en la que se preguntará sobre el código desarrollado, por lo que es importante que entiendas todo lo que has implementado.
- **Se valorará el uso de Git**: la forma en que estructuras los commits (mensajes claros y descriptivos) y las ramas que creas. Puedes usar GitFlow, trunk-based development o cualquier estrategia de branching que consideres apropiada.

---

## 🚀 Setup

### Requisitos previos

- Node.js (v20.9 o superior)
- pnpm o npm
- Docker y Docker Compose

### Instalación

1. **Configurar variables de entorno:**

   ```bash
   cp env.development.example .env.development
   cp env.test.example .env.test
   ```

2. **Instalar dependencias:**

   ```bash
   pnpm install
   # o
   npm install
   ```
3. **Levantar la base de datos PostgreSQL con PostGIS:**

   ```bash
   docker compose build
   docker compose up -d
   ```
4. **Ejecutar migraciones en la base de datos de desarrollo:**

   ```bash
   pnpm run prisma:migrate:dev
   # o
   npm run prisma:migrate:dev
   ```
5. **Ejecutar migraciones en la base de datos de test:**

   ```bash
   pnpm run prisma:migrate:test
   # o
   npm run prisma:migrate:test
   ```
5. **Generar el cliente de Prisma:**

   ```bash
   pnpm run prisma:generate
   # o
   npm run prisma:generate
   ```
6. **Iniciar el servidor de desarrollo:**

   ```bash
   pnpm run dev
   # o
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:3000`.

---


## 📝 Tareas a realizar

### 1. Completar el script de seedeo

**Archivo:** `/prisma/seed/seed.ts`

Completa el script de seed para poblar la base de datos con datos de prueba. Deberás crear:

- **Provincias y Municipios**
- **Usuarios** (al menos 6 - 7 usuarios de ejemplo)
- **Cultivos** (tipos de cultivo: trigo, maíz, olivo, etc.)
- **Parcelas** con geometrías de polígonos (asociadas a usuarios y municipios)
- **Recintos** dentro de las parcelas (asociados a cultivos)

**Instrucciones:**

- Para las tablas sin geometrías, usa el cliente de Prisma normalmente. Consulta la [documentación de CRUD](https://www.prisma.io/docs/orm/prisma-client/queries/crud).
- Para insertar polígonos, usa raw queries con la función `ST_GeomFromGeoJSON` de PostGIS. Consulta la [documentación de raw queries](https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries) y la [documentación de ST_GeomFromGeoJSON](https://postgis.net/docs/ST_GeomFromGeoJSON.html).
- Puedes crear polígonos de prueba fácilmente con esta herramienta: [geojson.io](https://geojson.io/#map=5/39.25/-5.56)

**Nota:** Los recintos deben estar geométricamente contenidos dentro de sus parcelas (existe un constraint que lo valida con `ST_Within`).

---

### 2. Vista de listado de usuarios

**Ruta:** `/users`

Crea una vista que muestre un listado de usuarios en formato de tarjetas (cards).

**Requisitos:**

- Mostrar datos **no sensibles** de los usuarios (nombre, email, número de parcelas, etc.)
- **NO mostrar** el password ni datos sensibles
- Al hacer clic en una tarjeta, navegar a la vista del mapa del usuario (`/user/:id`)

**Bonus (opcional):**

- Crear un modelo `Profile` con relación 1:1 con `Usuario` que incluya un campo `imagen`
- Renderizar la imagen del perfil en las tarjetas de usuario utilizando los componentes específicos para imágenes de NextJS

---

### 3. Vista de mapa con parcelas y recintos

**Ruta:** `/user/:id`

Crea una vista con un mapa de Leaflet que muestre las parcelas y recintos del usuario.

**Requisitos:**

- Usar la librería [react-leaflet](https://react-leaflet.js.org/) para renderizar el mapa
- Mostrar las **parcelas** del usuario como polígonos en el mapa
- Mostrar los **recintos** dentro de cada parcela (con un color diferente para distinguirlos)
- Al hacer **hover** sobre una parcela o recinto, mostrar información de la base de datos:
  - **Parcela:** municipio, provincia, número de recintos
  - **Recinto:** cultivo, fecha de siembra, fecha de cosecha
- La información puede mostrarse dentro del mapa (tooltip/popup) o fuera (panel lateral), a tu elección

---

### 4. Tests con Jest
**Carpeta:** `/__tests__/`

Crea al menos **3 tests** utilizando Jest (ya configurado en el proyecto).

**Ejemplos de tests válidos:**

- **Test de renderizado:** Verificar que la página de usuarios (`/users`) renderiza correctamente las tarjetas de usuario
- **Test de navegación:** Comprobar que al hacer clic en una tarjeta de usuario se navega a la ruta correcta (`/user/:id`)
- **Test de componente:** Verificar que el componente del mapa muestra el número correcto de parcelas y recintos, y que dichas parcelas y recintos solo pertenecen a dicho usuario y no a otro.
- **Test de datos:** Verificar que los datos mostrados en las tarjetas no incluyen información sensible

**Ejecutar tests:**

```bash
pnpm run test
# o
npm run test
```

---
### 5. Filtros / Vector Search
Elige entre la opción 5A o 5B y realiza solo una de las dos.

#### 5A - Filtro de usuarios

Crea un buscador de usuarios y un filtro que distinga entre usuarios que tienen parcelas y los que no.

- Implementa un buscador en la ruta `/users` que permita buscar por `nombre` y `email`.
- Añade un filtro en la misma ruta para mostrar únicamente los usuarios que tienen parcelas asociadas o los que no tienen ninguna.

**Requisitos:**

- El endpoint debe validar los parámetros de entrada.
- Debes mostrar el número de parcelas que tiene cada usuario.

#### 5B - Vector search de películas (embeddings + búsqueda semántica)

Crea una búsqueda semántica de películas usando embeddings y pgvector:

- Genera los embeddings de cada película de forma local usando [`@xenova/transformers`](https://www.npmjs.com/package/@xenova/transformers) (no dependas de APIs externas).
- Inserta las películas y sus embeddings en la tabla `Movie` usando SQL raw y el tipo `vector` de pgvector ([raw queries en Prisma](https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries)).
- Crea un endpoint `/api/movie-search` que reciba un texto y devuelva el top N de películas más similares usando búsqueda vectorial (`embedding <=> query_vector`).
- Implementa una vista `/movies` con un buscador: el usuario escribe una frase (por ejemplo, `a scary monster`) y se muestran las películas más relevantes según la búsqueda semántica.
- Puedes revisar el `/src/types/xenova-transformers.d.ts` para guiarte un poco con la libreria `@xenova/transformers`

**Requisitos:**

- El endpoint debe validar los parámetros de entrada.
- El buscador debe mostrar el título, descripción y el score de similitud de cada resultado.

**Enlaces útiles:**
- [Documentación de pgvector](https://github.com/pgvector/pgvector)
- [Ejemplo de embeddings locales con Xenova](https://github.com/xenova/transformers.js)



---

## 📊 Modelo de datos

```
Provincia (1) ──── (N) Municipio
                         │
                         │ (1)
                         ▼
Usuario (1) ──── (N) Parcela (1) ──── (N) Recinto (N) ──── (1) Cultivo
```

- **Provincia:** id, nombre
- **Municipio:** id, nombre, provinciaId
- **Usuario:** id, nombre, email, password
- **Parcela:** id, geom (Polygon), usuarioId, municipioId
- **Recinto:** id, geom (Polygon), parcelaId, cultivoId, fechaSiembra, fechaCosecha
- **Cultivo:** id, nombre

---

## 🛠️ Tecnologías

- **Framework:** Next.js 16
- **ORM:** Prisma 7
- **Base de datos:** PostgreSQL 18 + PostGIS 3.6
- **Mapas:** Leaflet / react-leaflet
- **Estilos:** CSS Modules / SCSS / Tailwind

---

## ⌨️ Comandos útiles

### Prisma

| Comando                          | Descripción                                                                                  |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm run prisma:generate`     | Regenera el cliente de Prisma después de cambios en el schema                                |
| `pnpm run prisma:migrate:dev`  | Crea y aplica una nueva migración en desarrollo                                              |
| `pnpm run prisma:migrate:test` | Aplica migraciones en la base de datos de test                                                |
| `pnpm run prisma:reset:dev`    | Resetea la base de datos de desarrollo (borra todos los datos y re-aplica migraciones + seed) |
| `pnpm run prisma:reset:test`   | Resetea la base de datos de test                                                              |

### Docker

| Comando                    | Descripción                                                                     |
| -------------------------- | -------------------------------------------------------------------------------- |
| `docker compose up -d`   | Levanta los contenedores en segundo plano                                        |
| `docker compose down`    | Para y elimina los contenedores                                                  |
| `docker compose down -v` | Para los contenedores y elimina los volúmenes (borra datos de la base de datos) |
| `docker compose logs -f` | Muestra los logs de los contenedores en tiempo real                              |

### Tests

| Comando                         | Descripción                                                |
| ------------------------------- | ----------------------------------------------------------- |
| `pnpm run test`               | Ejecuta todos los tests                                     |
| `pnpm run test -- --watch`    | Ejecuta tests en modo watch (re-ejecuta al guardar cambios) |
| `pnpm run test -- --coverage` | Ejecuta tests y genera reporte de cobertura                 |

---

## 📚 Recursos útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de react-leaflet](https://react-leaflet.js.org/)
- [Documentación de PostGIS](https://postgis.net/documentation/)
- [Herramienta para crear GeoJSON](https://geojson.io/)

---

## ✅ Criterios de evaluación

- Código limpio y bien estructurado
- Uso correcto de TypeScript
- Manejo adecuado de datos geoespaciales
- Experiencia de usuario en la visualización del mapa
- Bonus: Tests, manejo de errores, optimizaciones

¡Buena suerte! 🍀
