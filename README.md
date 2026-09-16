# Mis Quincenas

Laboratorio de finanzas personales quincenales/mensuales de Juan Carlos — reemplaza su Excel
de gastos por una app que se pueda ver y operar desde el celular.

## Estado

Prototipo funcional como PWA (Progressive Web App): app de una sola página
(`index.html`), instalable en Android/iOS vía "Agregar a inicio" del navegador, con
`manifest.json` y un service worker (`sw.js`) para funcionar offline. Todo el estado se
guarda hoy en `localStorage` del navegador — sin backend ni sincronización entre
dispositivos todavía.

## Modelo de datos

Un concepto tiene: nombre, monto en 1ra y 2da quincena, medio de pago (efectivo/TDC) y si
se debe "Reservar para Nu" (dinero que llega en la 1ra quincena pero se paga hasta fin de
mes, candidato a mover a una cuenta con rendimiento mientras tanto). Tres vistas —Resumen,
Tarjeta (pago para no generar intereses) y Nu— se calculan a partir de esa misma lista de
conceptos, no de tablas separadas.

## Probar localmente

```bash
python -m http.server 5500
```

y abre `http://localhost:5500`.

## Contexto completo

El origen, las capturas del Excel real, las decisiones de diseño y los pendientes de
arquitectura (dónde vive el dato de verdad, sincronización entre dispositivos) están en la
bóveda compartida: `_Memoria-compartida/Laboratorio-Finanzas-Personales.md` dentro de
`C:\Users\juanc\Developer`.
