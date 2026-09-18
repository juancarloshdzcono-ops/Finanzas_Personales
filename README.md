# Mis Quincenas

Laboratorio de finanzas personales quincenales/mensuales de Juan Carlos — reemplaza su Excel
de gastos por una app que se pueda ver y operar desde el celular.

## Estado

App React + TypeScript + Tailwind CSS, empaquetada con Vite como PWA (Progressive Web App)
instalable en Android/iOS vía "Agregar a inicio". El estado vive en Supabase (tablas
`periods`/`concepts` con RLS por usuario, acceso por magic link de correo) con `localStorage`
como caché local para apertura instantánea y resiliencia offline. También hay un "Modo Local"
sin cuenta que usa solo `localStorage`.

## Modelo de datos

Un concepto tiene: nombre, monto en 1ra y 2da quincena, medio de pago (efectivo/TDC) y un
estado del dinero (Retirar / En Nu / Pagado). Los conceptos viven agrupados por periodo
mensual (`YYYY-MM`). Tres vistas —Resumen, Tarjeta (pago para no generar intereses) y Nu— se
calculan a partir de esa misma lista de conceptos, no de tablas separadas.

## Desarrollo

```bash
npm install
npm run dev
```

Variables de entorno necesarias (ver `.env.example`): `VITE_SUPABASE_URL` y
`VITE_SUPABASE_ANON_KEY`.

## Build y preview de la PWA

El service worker y el manifest sólo se generan en el build de producción:

```bash
npm run build
npm run preview
```

## Despliegue

`.github/workflows/deploy.yml` compila con `npm run build` y publica `dist/` a GitHub Pages
en cada push a `master` (vía `actions/deploy-pages`, sin rama `gh-pages`). Para que funcione:

1. En **Settings → Pages → Build and deployment → Source**, cambiar a **GitHub Actions**
   (hoy el repo sirve directo desde la raíz de `master`; si no se cambia esto antes de un
   push, Pages seguiría publicando el código fuente de Vite sin compilar).
2. En **Settings → Secrets and variables → Actions**, crear `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` (mismos valores que `.env` local) — el build los necesita
   inyectados para que la app compilada no truene al cargar.

## Arquitectura

- `src/state/FinanzasContext.tsx` — estado global (reducer) de periodos/conceptos y las
  acciones que los mutan.
- `src/state/persistence.ts` — carga/guardado en Supabase y caché en `localStorage`.
- `src/components/views/` — las 4 pestañas (Resumen, Conceptos, Tarjeta, Nu).
- `src/components/ui/` — piezas reutilizables (Card, StatusPill, campos de formulario, etc).
- `src/hooks/useAuth.ts` — sesión de Supabase + Modo Local.

`vite.config.ts` fija `base: '/Finanzas_Personales/'` para que el build sirva bien desde
GitHub Pages en ese subpath — si el proyecto cambia de repo o dominio, actualízalo ahí.

## Contexto completo

El origen, las decisiones de diseño y los pendientes están en la bóveda compartida:
`_Memoria-compartida/Laboratorio-Finanzas-Personales.md` dentro de `C:\Users\juanc\Developer`.
