# 06 — Plan de construcción

## Fase 0 — Validación del notebook

Antes de desmontar:

- arrancar Windows/Linux;
- probar CPU/GPU;
- probar RAM;
- revisar SMART del SSD;
- probar batería;
- probar cargador;
- probar Wi‑Fi/Bluetooth;
- probar HDMI/USB/RJ45/audio;
- comprobar temperaturas;
- sacar fotos de todo.

## Fase 1 — Banco de pruebas del supervisor

Montar en protoboard:

```text
PC USB -> ESP32 -> OLED
               -> 2 switches
               -> 1 LED
```

Objetivo: comunicación estable PC ↔ ESP32.

## Fase 2 — Telemetría

El host envía:

- CPU %;
- RAM %;
- batería %;
- temperatura si el sistema la expone;
- IP;
- estado de red.

El ESP32 lo muestra en OLED.

## Fase 3 — Control de encendido

Después de medir el botón original:

- añadir optoacoplador;
- probar pulso de encendido;
- conservar posibilidad de usar el botón físico original.

## Fase 4 — Distribución USB

Añadir hub interno y probar uno por uno:

- ESP32;
- RTL-SDR;
- GPS;
- puertos de panel.

## Fase 5 — Alimentación de accesorios

Construir ramas protegidas y validar consumos con multímetro.

## Fase 6 — Desmontaje del notebook

Solo cuando las fases anteriores funcionan:

- retirar motherboard;
- retirar pantalla;
- conservar cables etiquetados;
- medir cada pieza;
- documentar tornillos y conectores.

## Fase 7 — Prototipo mecánico

Primero cartón/foamboard/acrílico barato. Luego carcasa definitiva.

## Fase 8 — Integración final

- paneles;
- gestión de cables;
- ventilación;
- fijaciones;
- pruebas térmicas;
- autonomía;
- pruebas SDR de ruido eléctrico.
