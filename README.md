<p align="center">
  <img src="./public/rebulogo.png" alt="Rebu" width="220" />
</p>

# Rebu HR - Challenge

Aplicación Next.js para gestión de empleados (listado, filtros, creación/edición, detalle) con un dashboard básico. UI moderna con shadcn y Tailwind.

<p align="center">
  <a href="https://rebuhr.vercel.app/" target="_blank" rel="noreferrer">
    <img alt="Demo en Vercel" src="https://img.shields.io/badge/Demo%20en%20Vercel-Visitar-000000?logo=vercel&labelColor=000000&color=1fcc69" />
  </a>
</p>

## Instrucciones de instalación y ejecución

Requisitos: Node 18+.

1. Instalar dependencias

```bash
npm install
```

2. Desarrollo

```bash
npm run dev
# http://localhost:3000
```

3. Linter y formato

```bash
npm run lint
npm run format
```

4. Type-check

```bash
npm run type-check
```

5. Tests (Vitest)

```bash
npm run test
npm run test:watch
npm run test:coverage
```

## Decisiones técnicas importantes y por qué

- Separación de responsabilidades: componentes de UI, hooks, servicios y utilidades en `src/components`, `src/lib/hooks`, `src/lib/services`, `src/lib/utils`. Facilita mantenimiento, testing y escalabilidad.
- shadcn + Tailwind: acelerar maquetación y lograr consistencia visual con componentes accesibles y personalizables.
- Componentes reutilizables: tablas, formularios tipados, selects tipados (`TypedSelect`), layout de dashboard y utilidades (`cn`, formateadores, etiquetas de estado).
- Servicio in-memory (`employeeService`): permite simular CRUD/filtrado/validaciones sin backend, ideal para demo y pruebas.
- Middleware de auth: reglas simples de redirección según cookie para emular rutas públicas/privadas.
- Tests con Vitest: unitarios para utils, middleware y servicio; estructura en `src/test/**` replicando el árbol de `src` para localizar fácilmente las pruebas.

## Lista de features implementadas

- Autenticación simulada con middleware y contexto.
- Dashboard con métricas de empleados y listado reciente.
- CRUD simulado de empleados (crear, editar, eliminar) vía `employeeService`.
- Listado con filtros (búsqueda, departamento, países, estado), orden y paginación.
- Virtualización para tablas grandes.
- Formularios con validación (Zod) y validación de email asíncrona.
- UI responsiva, accesible y animaciones sutiles (Framer Motion).
- Tests unitarios para utilidades, servicio y middleware.

## Tiempo aproximado invertido

- ~30 horas.

## Si usaste IA, cómo y para qué

- Generación/aceleración de datos mock para pruebas.
- Utilidades reutilizables (helpers de formato, etiquetas) para ahorrar tiempo.
- Borrador inicial del `employeeService` y luego refinamiento manual.
- Sugerencias de tipos y corrección de errores a medida que avanzaba la implementación.
- Mejorar este README.md

## Cosas que mejoraría con más tiempo

- UX de detalle/edición: reemplazar la navegación a página por un modal de edición para reducir clics.
- Refinar y unificar la capa de UI (temas, tokens de diseño, estados de foco/errores) para mayor fluidez.
- Persistencia real (API o DB) y manejo de sesiones.

## Estructura del proyecto (resumen)

- `src/app`: rutas y layouts de Next.js.
- `src/components`: UI y componentes de dominio (empleados, layout, etc.).
- `src/lib`: hooks, servicios, contextos, tipos, utilidades y validaciones.
- `src/test`: pruebas unitarias con la misma estructura que `src`.
