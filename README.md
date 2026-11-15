# Línea Justa

App de análisis deportivo (instalable). Muestra partidos, probabilidades, resultados, tarjetas, faltas y córners. **No es una casa de apuestas** y no garantiza aciertos.

## Qué hay en esta carpeta
- `index.html`, `manifest.webmanifest`, `sw.js`, iconos: la app.
- `firestore.rules`: reglas de seguridad de la base de datos (se pegan en la consola de Firebase).
- `.github/workflows/avisos.yml` y `scripts/notify.mjs`: el servidor gratis que revisa partidos y envía avisos.

## Puesta en marcha
1. Sube todo (incluida la carpeta oculta `.github`) a la raíz de tu repositorio y activa GitHub Pages.
2. Firebase → Firestore Database → Reglas: pega `firestore.rules` y publica.
3. GitHub → Settings → Secrets and variables → Actions: secreto `FIREBASE_SERVICE_ACCOUNT` con el contenido del `.json` de la cuenta de servicio. Nunca lo subas al repositorio.
4. GitHub → Actions → "avisos" → Run workflow para probar.
5. Abre la app, pestaña Avisos → "Activar avisos con la app cerrada".

## Límites
- GitHub revisa cada 5 minutos como mínimo y puede retrasarse: los avisos no son en tiempo real exacto.
- GitHub pausa los cron si el repositorio pasa 60 días sin actividad.
- Fuente: API pública de ESPN, no oficial. Cuotas de casas de apuestas: requieren una API con licencia y no están conectadas.
- iPhone: la app debe estar instalada en la pantalla de inicio (iOS 16.4 o superior).

## Escudos
Diseños propios con los colores de cada club, no los oficiales.

## Juego responsable
Solo mayores de 18. Apuesta únicamente dinero que puedas perder.
