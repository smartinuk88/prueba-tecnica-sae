# Prueba Técnica

Aplicación web desarrollada con Next.js que permite visualizar usuarios y sus parcelas agrícolas en un mapa interactivo. Construida como prueba técnica.

---

## Stack Técnico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL con extensión PostGIS
- **ORM:** Prisma
- **Mapa:** React Leaflet + OpenStreetMap
- **Estilos:** Tailwind CSS v4
- **Tests:** Jest + Testing Library
- **Contenedor:** Docker + Docker Compose
- **Control de versiones:** Git Flow

---

## Instalación y configuración

### Requisitos previos

- Node.js v20.9 o superior
- npm
- Docker y Docker Compose

### Pasos

1. **Clonar el repositorio:**

```bash
git clone https://github.com/smartinuk88/prueba-tecnica-sae.git
cd prueba-tecnica-sae
```

2. **Configurar variables de entorno:**

```bash
cp env.development.example .env.development
cp env.test.example .env.test
```

3. **Instalar dependencias:**

```bash
npm install
```

4. **Iniciar la base de datos:**

```bash
docker compose up -d
```

5. **Ejecutar migraciones:**

```bash
npm run prisma:migrate:dev
npm run prisma:migrate:test
```

6. **Generar el cliente de Prisma:**

```bash
npm run prisma:generate
```

7. **Poblar la base de datos:**

```bash
npx dotenv -e .env.development -- npx prisma db seed
```

8. **Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### Ejecutar tests

```bash
npm test
```

---

## Tareas completadas

### ✅ Tarea 1 — Script de seed

Script completo que puebla la base de datos con:

- 2 provincias, 9 municipios
- 10 usuarios (7 con perfil de imagen, 3 sin perfil para probar el avatar de inicial)
- 7 tipos de cultivo
- 14 parcelas distribuidas entre los usuarios (con 0, 1, 2 y 3 parcelas por usuario)
- 22 recintos geométricamente contenidos dentro de sus parcelas
- 50 películas con embeddings vectoriales placeholder

Las geometrías de parcelas y recintos se insertan mediante raw queries usando `ST_GeomFromGeoJSON` de PostGIS. Los polígonos se diseñaron con [geojson.io](https://geojson.io).

### ✅ Tarea 2 — Vista de listado de usuarios (`/users`)

- Listado de usuarios en formato de tarjetas
- Muestra nombre, email y número de parcelas
- El campo `password` nunca se obtiene de la base de datos — excluido explícitamente en el `select` de Prisma
- Imagen de perfil mediante el componente `Image` de Next.js con avatar de inicial como fallback
- Al hacer clic en una tarjeta, navega a `/user/:id`

**Bonus completado:** Modelo `Profile` con relación 1:1 con `Usuario`, incluyendo campo de imagen renderizado con el componente `Image` de Next.js.

### ✅ Tarea 3 — Vista de mapa con parcelas y recintos (`/user/:id`)

- Mapa interactivo con React Leaflet y tiles de OpenStreetMap
- Parcelas renderizadas como polígonos verdes
- Recintos renderizados como polígonos ámbar dentro de sus parcelas
- Tooltip al hacer hover con información de la base de datos:
  - Parcela: municipio, provincia, número de recintos
  - Recinto: cultivo, fecha de siembra, fecha de cosecha
- Popup al hacer clic en una parcela con opciones de gestión

### ✅ Tarea 4 — Tests con Jest

10 tests implementados cubriendo:

- Renderizado correcto de datos de usuario en las tarjetas
- Renderizado de imagen de perfil con texto alternativo correcto
- Avatar de inicial cuando no hay imagen de perfil
- Ausencia de datos sensibles (password) en el UI
- Lógica singular/plural para el conteo de parcelas
- Navegación correcta al hacer clic en una tarjeta
- Renderizado de usuarios iniciales en el componente de búsqueda
- Presencia de input de búsqueda y botones de filtro
- Conteo correcto de resultados

### ✅ Tarea 5A — Búsqueda y filtro de usuarios

- Buscador en `/users` por nombre y email
- Filtro para mostrar todos los usuarios, solo los que tienen parcelas, o solo los que no tienen
- Debouncing de 500ms en el input de búsqueda para minimizar peticiones al servidor
- Endpoint `GET /api/usuarios` con validación de parámetros de entrada:
  - `search`: string opcional, máximo 100 caracteres
  - `filter`: debe ser uno de `todos`, `con-parcelas`, `sin-parcelas` — devuelve 400 si no es válido

---

## CRUD de parcelas

Funcionalidad adicional implementada más allá de las tareas requeridas:

### Añadir parcela

- Formulario para añadir nuevas parcelas a un usuario
- El usuario pega la geometría en formato GeoJSON desde [geojson.io](https://geojson.io)
- Selección de municipio existente mediante dropdown, o creación de uno nuevo introduciendo nombre y provincia
- Validación del GeoJSON antes de insertar en la base de datos
- Server Action de Next.js para la mutación, con `revalidatePath` para invalidar la caché tras la operación

### Eliminar parcela

- Botón de eliminación accesible desde el popup de cada parcela en el mapa
- Panel de confirmación con scroll suave para evitar acciones accidentales
- La eliminación en cascada borra primero los recintos asociados antes de eliminar la parcela (requerido por la constraint de clave foránea)
- Verificación server-side de que la parcela pertenece al usuario antes de eliminar

---

## Decisiones técnicas

### Arquitectura general

Se ha utilizado el App Router de Next.js con Server Components por defecto para las páginas de datos, minimizando el JavaScript enviado al cliente. Los Client Components se limitan a los elementos interactivos: búsqueda, mapa, formulario de parcelas.

### Datos geográficos

Para las tablas con geometría (`Parcela` y `Recinto`), Prisma no soporta el tipo `geometry` de PostGIS de forma nativa. Se han utilizado raw queries con `ST_GeomFromGeoJSON` para inserciones y `ST_AsGeoJSON` para lecturas, manteniendo Prisma para el resto de operaciones CRUD.

### Seguridad en datos sensibles

El campo `password` de `Usuario` nunca se obtiene de la base de datos — se excluye explícitamente mediante el `select` de Prisma en todas las consultas. La protección está en la capa de acceso a datos, no solo en la UI.

### Autenticación de Server Actions

Las Server Actions de eliminación verifican que `usuarioId` del parámetro coincide con el propietario de la parcela antes de ejecutar el DELETE, previniendo que un usuario pueda eliminar parcelas ajenas.

### Búsqueda: API vs filtrado client-side

Se implementó la búsqueda mediante un endpoint API (`/api/usuarios`) para satisfacer el requisito de validación de parámetros. Para un dataset pequeño como este, el filtrado client-side de los datos ya cargados sería más eficiente — evitaría peticiones de red en cada keystroke incluso con debouncing. En una aplicación real la elección dependería del tamaño esperado del dataset y los requisitos de paginación.

### Leaflet y SSR

React Leaflet requiere APIs del navegador (`window`, `document`) y no puede renderizarse en el servidor. Se utiliza `next/dynamic` con `ssr: false` para importar el componente del mapa únicamente en el cliente. La separación en dos componentes (`MapView` y `Map`) mantiene el concern del SSR aislado de la lógica de renderizado del mapa.

### Tailwind CSS v4

Tailwind v4 escanea el código estáticamente para generar las clases CSS. Las clases utilizadas únicamente en componentes renderizados condicionalmente (como el panel de confirmación de eliminación) pueden no ser detectadas. Se resolvió añadiendo un archivo `src/safelist.txt` referenciado como `@source` en `globals.css`.

### Asignación de municipio a parcelas

La asignación de municipio es una selección manual del usuario, no una verificación geométrica automática. Una implementación en producción podría validar las coordenadas contra los datos de límites municipales oficiales del [SIGPAC](https://www.mapa.gob.es/es/agricultura/temas/sistema-de-informacion-geografica-de-parcelas-agricolas-sigpac-/) del Ministerio de Agricultura.

### Caching

No se implementó caching explícito en esta versión. En producción se utilizaría la directiva `use cache` de Next.js 16 con `cacheComponents` habilitado, aplicando límites de caché a nivel de función con perfiles `cacheLife` apropiados. La invalidación tras mutaciones utilizaría `revalidatePath`.

### Estado de búsqueda basado en URL

El estado de búsqueda y filtro se gestiona mediante URL search params (`useSearchParams` de Next.js) en lugar de estado local de React. Esto permite compartir resultados filtrados mediante la URL, persistir el estado al recargar la página, y que el botón atrás del navegador funcione correctamente. La URL actúa como única fuente de verdad para el estado del filtro.

### Separación de tipos y queries

Los tipos compartidos se centralizan en `/src/types/index.ts` y las queries de base de datos en `/src/lib/db/`, separando claramente las responsabilidades. La capa de datos devuelve tipos ya transformados y listos para usar — las páginas no necesitan conocer los detalles internos de cómo se almacenan los datos.

### Navegación entre parcelas con FlyToHandler

La navegación entre parcelas utiliza el hook `useMap()` de react-leaflet dentro de un componente renderless `FlyToHandler`. Este componente vive dentro de `MapContainer` — el único lugar donde `useMap()` puede llamarse — y reacciona a cambios en `selectedParcela` animando el mapa con `map.flyTo()`. Es un patrón común para operaciones programáticas sobre el mapa sin acoplar la lógica al componente principal.

---

## Cambios post-revisión

Tras la revisión técnica, se implementaron las siguientes mejoras:

- **Tipos centralizados** — los tipos compartidos se extrajeron a `/src/types/index.ts` eliminando definiciones duplicadas en múltiples componentes
- **Queries extraídas** — las consultas a la base de datos se movieron a `/src/lib/db/` separando la lógica de acceso a datos de las páginas
- **Estado de búsqueda en URL** — el estado de búsqueda y filtro migró de `useState` a URL search params, haciendo los resultados compartibles y persistentes
- **Navegación entre parcelas** — implementada mediante `FlyToHandler` y `useMap()` de react-leaflet, permitiendo centrar el mapa en cualquier parcela con animación suave
- **Hash de contraseñas** — las contraseñas del seed se hashean con bcrypt en lugar de almacenarse en texto plano

---

## Mejoras futuras

### Dibujo interactivo de polígonos

El formulario de añadir parcela actualmente requiere pegar GeoJSON manualmente desde una herramienta externa. Una mejora natural sería integrar `leaflet-draw` para permitir al usuario dibujar el polígono directamente sobre el mapa de la aplicación. Se optó por el enfoque actual para mantener el alcance dentro de los tiempos disponibles.

### Verificación geométrica de municipio

Validar que las coordenadas de una parcela pertenecen realmente al municipio seleccionado, usando datos de límites oficiales del SIGPAC con `ST_Within` de PostGIS.

### Autenticación y roles

Implementar autenticación con NextAuth.js o Clerk y un sistema de roles:

- **Admin:** acceso completo, gestión de todos los usuarios y parcelas
- **Usuario:** acceso solo a sus propias parcelas
- Protección de rutas a nivel de middleware de Next.js

### CRUD completo de recintos

Actualmente los recintos solo se crean mediante el seed. Una extensión natural sería permitir añadir, editar y eliminar recintos desde la vista del mapa, respetando siempre el constraint `ST_Within` respecto a su parcela padre.

### Embeddings reales para búsqueda semántica

Los embeddings de películas se han insertado como vectores de ceros placeholder. Una implementación completa generaría embeddings reales usando `@xenova/transformers` localmente, habilitando búsqueda semántica genuina en la ruta `/movies` mediante `pgvector`.

### Caching con `use cache`

Migrar a la directiva `use cache` de Next.js 16 con `cacheComponents: true`, aplicando perfiles `cacheLife` granulares por tipo de dato y usando `revalidatePath` tras cada mutación para invalidación precisa.

### Paginación

Para datasets grandes, implementar paginación en el listado de usuarios y en la búsqueda, tanto en el endpoint API como en el componente de búsqueda.

---

## Notas sobre Git

Se ha utilizado Git Flow como estrategia de branching:

- `main` — código estable
- `develop` — rama de integración
- `feature/*` — una rama por funcionalidad
- `fix/*` — correcciones puntuales

Los mensajes de commit siguen el formato Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`).
