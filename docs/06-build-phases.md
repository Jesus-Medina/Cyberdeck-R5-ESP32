# 06 — Plan de construcción

> **LILITH — estado real 17-10-2026:** probados **ESP32-S3 + OLED SH1106 + INA3221 (0x40 tras soldar A0 a GND) + 3 cargas independientes 100 Ω**, alimentados por USB/3,3 V; multímetro ~3,17 V y ~32,4–32,8 mA por canal. **NO** están montados/probados el circuito 12 V→XL4015→5 V, SW0, SW1, TPS2553 ni la batería/respaldo Dell. Los chips SOT/SOP requieren soldadura en adaptadores. El firmware del repo sigue siendo demo anterior. Ver [bitácora de banco](22-lilith-build-status-2026-10-17.md), [pendientes de alimentación Pro](23-lilith-power-budget-and-pending-parts.md) y [soldadura SMD](24-lilith-smd-assembly.md).

La regla es simple: **probar primero, cortar después**.

## Fase 0 — Inventario y mediciones

- validar Dell Vostro 3405;
- confirmar 12 GB RAM y SSD;
- batería y cargador;
- temperaturas;
- medir caja **interior real**;
- no deducir la bandeja desde las medidas exteriores 406 × 330 × 174 mm;
- identificar Arduino exacto;
- fotografiar puertos y ventilación;
- crear plantillas 1:1 de cartón/cartón pluma;
- comprobar que ningún diseño requiera perforar la carcasa exterior.

## Fase 1 — MVP de control

En mesa:

~~~text
Dell USB -> ESP32-S3 -> OLED
                    -> switch
                    -> LED
                    -> sensor
~~~

Implementar USB serial y telemetría.

## Fase 2 — Energía AUX

Sin conectar todavía instrumentos caros:

- fuente AUX;
- fusible;
- protección;
- rail 5 V;
- medición INA3221;
- una rama TPS2553;
- carga de prueba.

Medir corrientes y temperaturas.

## Fase 3 — Backbone USB

Instalar y probar:

- hub alimentado;
- anti-backfeed;
- ESP32;
- Arduino;
- UE306;
- USB-UART;
- puertos de servicio internos.

## Fase 4 — Laboratorio GPIO

- Arduino a USB;
- sacar digital/analog/I²C/SPI/UART a bornes;
- level shifters;
- mini protoboard;
- logic analyzer.

## Fase 5 — Panel auxiliar

- ESP32 CYD;
- extensión microSD;
- OLED;
- encoder;
- switches;
- LEDs;
- RTC.

No microsoldar el lector SD mientras una extensión comercial funcione.

## Fase 6 — Instrumentación

Integrar y probar por separado:

- GM328A;
- FNIRSI;
- fuente variable;
- voltímetro/amperímetro;
- bananas;
- fusible de salida.

## Fase 7 — Redes

- LAN Dell;
- UE306;
- Wi‑Fi interno;
- Wi‑Fi USB de laboratorio;
- cableado;
- antenas acomodadas dentro del maletín.

## Fase 8 — RF

Uno por uno:

1. RTL-SDR;
2. GNSS;
3. LoRa;
4. NFC/RFID;
5. FM/Bluetooth opcional.

Antes de cerrar la caja, medir si DC/DC o USB introducen ruido al SDR.

## Fase 9 — Mecánica V0.1-A: maqueta

Antes de PVC o impresión 3D:

- usar cartón/cartón pluma;
- ubicar plantillas 1:1 o componentes reales;
- comprobar que el Dell y los módulos caben;
- definir zonas power/RF/control/lab;
- reservar espacio para cables;
- probar posiciones de antenas;
- comprobar acceso a switches y mantenimiento;
- verificar cierre completo del maletín.

## Fase 10 — Mecánica V0.1-B: PVC espumado 3 mm

Usar Sintra/Trovicel de 3 mm para:

- paneles provisionales;
- divisiones;
- soportes sencillos;
- pruebas de perforación;
- validar posiciones antes de fabricar la base final de prototipo.

## Fase 11 — Mecánica V0.1-C: PVC espumado 5 mm

Una vez validado el layout:

- cortar bandeja técnica usando **medidas interiores reales**;
- instalar standoffs M2.5/M3;
- dejar PCB elevadas 5–10 mm;
- organizar cableado y bridas;
- crear acceso de servicio;
- mantener potencia alejada de RF;
- validar ventilación;
- verificar que nada toque la carcasa al cerrar.

No usar pegamento caliente como fijación estructural y no quemar el PVC con cautín.

## Fase 12 — Integración Dell

Preferencia:

- conservar base Dell funcional si cabe;
- retirar únicamente el conjunto de display si fuese necesario;
- desnudar motherboard sólo si el volumen lo exige.

No soldar sobre placa/batería.

## Fase 13 — Backplane/PCB

Después de validar el prototipo:

- esquemático;
- conectores;
- drivers;
- load switches;
- sensores de potencia;
- fan control;
- headers ESP32;
- fabricación PCB.

## Fase 14 — Mecánica definitiva

Sólo después de tener dimensiones reales de todos los módulos y haber validado PVC:

- impresión 3D de brackets y bezels;
- ABS/aluminio donde aporte una ventaja real;
- canaletas;
- soportes definitivos;
- rotulación;
- acabado.

La impresión 3D **no se usa para descubrir el layout**; se usa para reproducir un layout ya probado.

## Fase 15 — Pruebas finales

- carga CPU/GPU;
- batería Dell;
- autonomía AUX;
- temperatura;
- ruido SDR;
- Wi‑Fi;
- doble Ethernet;
- LoRa en condiciones legales;
- GNSS;
- GPIO;
- fuente LAB;
- continuidad y aislamiento;
- cierre/apertura repetidos;
- transporte;
- comprobar que la carcasa exterior continúa sin perforaciones.

## Criterio de terminado

El deck se considera v1.0 cuando:

- el Dell funciona sin módulos AUX;
- cada módulo se puede reemplazar individualmente;
- no hay cables sueltos;
- todos los rails están protegidos;
- toda conexión está etiquetada;
- las bandejas pueden abrirse para mantenimiento;
- existe un diagrama actualizado del cableado real;
- el layout físico fue validado antes de fabricar soportes definitivos;
- la carcasa exterior no ha sido perforada.
