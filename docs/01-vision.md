# 01 — Visión y alcance

## Concepto

El proyecto convierte un notebook Dell Ryzen 5 usado en un cyberdeck modular. La idea no es simplemente instalar el notebook dentro de una caja: se reutilizan sus componentes principales y se añade una capa de control electrónico independiente.

El resultado debe ser un equipo portátil capaz de funcionar como:

- computador Linux/Windows x86;
- estación de programación;
- terminal de redes;
- estación SDR;
- plataforma de microcontroladores;
- banco portátil de pruebas electrónicas;
- consola/emulación y juegos ligeros;
- plataforma para futuras expansiones.

## Computador donante

Datos conocidos del aviso:

- AMD Ryzen 5 3450U;
- SSD M.2 de 256 GB;
- RAM incluida;
- pantalla incluida;
- batería incluida;
- cargador incluido;
- Wi‑Fi/Bluetooth presumiblemente originales;
- refrigeración original incluida.

**Pendiente:** confirmar modelo exacto del Dell y cantidad/configuración real de RAM antes de diseñar cortes o soportes.

## Por qué usar notebook en lugar de Raspberry Pi

Ventajas:

- x86-64 nativo;
- mayor rendimiento CPU/GPU;
- SSD NVMe/M.2 nativo;
- más RAM;
- batería y BMS ya resueltos;
- pantalla y audio integrados;
- Windows y Linux estándar;
- mejor compatibilidad con software de escritorio.

Desventaja principal:

- no hay GPIO nativo.

Solución:

- ESP32 conectado por USB como supervisor y puente de GPIO.

## Filosofía de diseño

1. Modular.
2. Reparables los subsistemas.
3. Cableado etiquetado.
4. Alimentación protegida.
5. El PC puede funcionar aunque fallen módulos auxiliares.
6. El ESP32 puede permanecer activo con el PC apagado.
7. Nada irreversible sobre la motherboard hasta verificar pinouts.
