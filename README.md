# KoalaTV para Windows

Primera adaptación de escritorio del proyecto Android KoalaTV recibido.

## Incluye en esta base
- Interfaz de escritorio con identidad KoalaTV en azul marino, azul eléctrico y plata.
- Reproducción HLS mediante hls.js.
- Lectura M3U/M3U8 y numeración desde 100.
- Inicio preferente en Caracol cuando está presente en la lista.
- OSD translúcido, lista lateral, búsqueda de canales y controles de teclado.
- Importación de listas desde archivo y administración de URLs.
- Lectura inicial de URL XMLTV declarada en `url-tvg` (incluye `.gz`).
- Instalador Windows NSIS generado por electron-builder.

## Compilar localmente
Requiere Node.js 20 o superior:
```bash
npm install
npm start
npm run dist
```
El instalador queda en `dist/`.

## Compilar con GitHub
1. Sube el contenido de esta carpeta a la raíz de un repositorio GitHub.
2. Abre Actions y ejecuta `Compilar KoalaTV para Windows`.
3. Descarga el artefacto `KoalaTV-Windows-Setup` cuando termine.

## Controles
- Flechas arriba/abajo o PageUp/PageDown: canal siguiente/anterior.
- Enter: abrir/cerrar lista de canales.
- Escape: cerrar panel / mostrar OSD.
- Números: sintonización directa (numeración desde 100).
- F: pantalla completa.
- L: administrar listas.
- Espacio: pausa/reanudar.

## Notas técnicas y pendientes de validación
- Esta versión es una primera base funcional de escritorio, no un clon binario del APK. Android Media3 fue sustituido por hls.js sobre Chromium.
- EPG se obtiene desde `url-tvg` de la lista base y requiere que el proveedor publique XMLTV accesible. Se vincula por `tvg-id`; canales sin ID coincidente no mostrarán guía.
- La importación desde archivo se mantiene local. La carga de listas por URL puede depender de políticas de acceso/CORS del servidor; el flujo se debe validar con las listas reales.
- Las URLs de canales existentes se conservaron desde el ZIP aportado. Su disponibilidad y autorización de uso dependen del proveedor de origen; KoalaTV no proporciona señales.
- Antes de distribuir públicamente, revisar derechos de uso de las listas y firmar digitalmente el instalador.
