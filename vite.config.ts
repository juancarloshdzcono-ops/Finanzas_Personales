import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// Sirve desde https://juancarloshdzcono-ops.github.io/Finanzas_Personales/ — si el proyecto
// se muda de repo/dominio, actualiza `base` (y start_url/scope del manifest) junto con ello.
const BASE_PATH = '/Finanzas_Personales/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Mis Quincenas',
        short_name: 'Quincenas',
        description: 'Finanzas personales quincenales: conceptos, resumen, pago sin intereses y cuánto mover a Nu.',
        start_url: BASE_PATH,
        scope: BASE_PATH,
        display: 'standalone',
        background_color: '#0A0D14',
        theme_color: '#0E6B52',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
});
