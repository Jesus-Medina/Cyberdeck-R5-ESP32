# 06 — Plan de construcción

La regla es simple: **probar primero, cortar después**.

## Fase 0 — Inventario y mediciones

- validar Dell Vostro 3405;
- confirmar 12 GB RAM y SSD;
- batería y cargador;
- temperaturas;
- medir caja real;
- identificar Arduino exacto;
- fotografiar puertos y ventilación;
- crear plantillas de cartón.

## Fase 1 — MVP de control

En mesa:

```text
Dell USB -> ESP32-S3 -> OLED
                    -> switch
                    -> LED
                    -> sensor
```

Implementar USB serial y telemetría.

## Fase 2 — Energía AUX

Sin conectar todavía instrumentos caros:

- powerbank/fuente AUX;
- fusible;
- eFuse/protección;
- rail 5 V;
- INA219/INA226;
- un load switch;
- ventilador de prueba.

Medir corrientes y temperaturas.

## Fase 3 — Backbone USB

Instalar y probar:

- hub alimentado;
- anti-backfeed;
- ESP32;
- Arduino;
- UE306;
- USB-UART;
- puertos externos.

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
- panel RJ45;
- antenas externas.

## Fase 8 — RF

Uno por uno:

1. RTL-SDR;
2. GNSS;
3. LoRa;
4. NFC/RFID;
5. FM/Bluetooth opcional.

Antes de cerrar la caja, medir si DC/DC o USB introducen ruido al SDR.

## Fase 9 — Mecánica v1

- bandeja inferior ABS;
- standoffs;
- canaletas/cableado;
- panel superior temporal;
- soportes de pantalla;
- ventilación.

## Fase 10 — Integración Dell

Preferencia:

- conservar base Dell funcional si cabe;
- retirar únicamente el conjunto de display para fijarlo a la tapa;
- desnudar motherboard sólo si el volumen lo exige.

No soldar sobre placa/batería.

## Fase 11 — Backplane/PCB

Después de validar el prototipo:

- esquemático;
- conectores J1–J12;
- drivers;
- load switches;
- sensores de potencia;
- fan control;
- headers ESP32;
- fabricación PCB v1.

## Fase 12 — Panel definitivo

Sólo después de tener dimensiones reales de todos los módulos:

- cortar ABS/aluminio;
- rotular;
- instalar bulkheads;
- fijar instrumentos;
- montar switches y displays.

## Fase 13 — Pruebas finales

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
- transporte.

## Criterio de terminado

El deck se considera v1.0 cuando:

- el Dell funciona sin módulos AUX;
- cada módulo se puede reemplazar individualmente;
- no hay cables sueltos;
- todos los rails están protegidos;
- toda conexión externa está etiquetada;
- el panel puede abrirse para mantenimiento;
- existe un diagrama actualizado del cableado real.
