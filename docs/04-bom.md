# 04 — BOM maestra

Esta es la lista de piezas del diseño completo. **No significa comprar todo el mismo día**: se agrupa por prioridad para evitar incompatibilidades.

Estados:

- **YA**: ya existe o viene con el Dell.
- **P0**: imprescindible para la estructura.
- **P1**: núcleo funcional del cyberdeck.
- **P2**: laboratorio/comunicaciones.
- **P3**: expansión opcional planificada.

## 1. Computador y carcasa

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| YA | Dell Vostro 3405 Ryzen 5 3450U | 1 | Computador principal |
| YA | RAM 12 GB | 1 | Memoria |
| YA | SSD 256 GB | 1 | Almacenamiento |
| YA | LCD Dell 14" | 1 | Pantalla principal |
| YA | Batería/BMS/cargador Dell | 1 | Energía PC |
| YA | Teclado + touchpad Dell | 1 | Entrada |
| YA | Wi‑Fi/Bluetooth Dell | 1 | Conectividad normal |
| P0 | Caja Robust MJ-5018 / Easy 16" | 1 | Chasis |
| P0 | ABS 3 mm / panel equivalente | 2 hojas | panel superior + bandeja |
| P0 | Separadores M3 surtidos | lote | montaje |
| P0 | Tornillería M2/M3 | lote | montaje |
| P0 | JST-XH/JST-PH surtidos | lote | cableado desmontable |
| P0 | Ferrules, termorretráctil, malla | lote | cableado |

## 2. Control y UI

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P1 | ESP32-S3 DevKit USB-C | 1 | Supervisor principal |
| P1 | OLED I²C 1.3" | 1 | Estado permanente |
| P1 | ESP32-2432S028R CYD 2.8" | 1 | UI táctil auxiliar |
| P1 | Extensión microSD macho-hembra | 1 | Acceso sin microsoldadura |
| P1 | RTC DS3231 | 1 | Hora independiente |
| P1 | Encoder rotatorio con pulsador | 1–2 | Navegación |
| P1 | Switches de panel | 8–12 | Control módulos |
| P1 | Pulsadores | 3–5 | Power/macros/reset |
| P1 | LEDs indicadores | 6–12 | Estado |
| P1 | Buzzer pequeño | 1 | Avisos |
| P1 | BME280 o similar | 1 | Temp/humedad/presión |
| P1 | INA219 o INA226 | 1–2 | V/A del rail AUX |

## 3. Arduino y GPIO

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| YA | Arduino existente | 1 | MCU de laboratorio |
| P1 | Bornes verdes enchufables | lote | GPIO accesible |
| P1 | Header GPIO de panel | 1 | I²C/SPI/UART/digital/analog |
| P1 | Protoboard pequeña desmontable | 1 | Pruebas rápidas |
| P2 | Level shifter 3.3/5 V | 1–2 | Adaptación lógica |
| P2 | Optoacopladores | lote | aislamiento de señales |

## 4. Backbone USB / panel

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P0 | Hub USB 3.x alimentado, anti-backfeed | 1 | Backbone |
| P0 | Extensión USB-A 3.x panel mount | 2–3 | Puertos externos |
| P0 | Extensión USB-C panel mount | 1–2 | Servicio |
| P0 | HDMI panel mount | 1 | Salida externa |
| P0 | RJ45 panel mount | 1–2 | Ethernet externo |
| P0 | Jack 3.5 mm panel mount | 1 | Audio |
| P0 | Pigtails SMA/RP-SMA bulkhead | varios | Antenas |
| P1 | USB interno corto/angulado | varios | Cableado limpio |

## 5. Redes

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| YA | Ethernet integrado Dell | 1 | LAN1 |
| YA | TP-Link UE306 | 1 | LAN2 |
| P2 | Wi‑Fi USB dual-band Linux-friendly | 1 | laboratorio autorizado |
| P2 | Antenas Wi‑Fi removibles | 2 | Wi‑Fi USB |
| P2 | RP-SMA bulkhead | 2 | panel Wi‑Fi |

Preferencia técnica para el adaptador Wi‑Fi: chipset con buen soporte Linux y antenas desmontables. Validar modelo exacto antes de comprar.

## 6. Radio / RF / navegación

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P2 | RTL-SDR | 1 | recepción RF |
| P2 | SMA bulkhead SDR | 1 | antena externa |
| P2 | Kit antenas SDR | 1 | recepción |
| P2 | LoRa SX1262/SX127x | 1 | telemetría LoRa |
| P2 | SMA bulkhead LoRa | 1 | antena LoRa |
| P2 | Antena LoRa adecuada a banda legal | 1 | RF |
| P2 | GNSS/GPS USB o UART | 1 | ubicación/tiempo |
| P2 | Antena GNSS | 1 | recepción satelital |
| P2 | PN532 | 1 | NFC/RFID |
| P3 | Radio FM/Bluetooth tipo 808BT | 1 | audio independiente |
| P3 | Antena FM | 1 | recepción FM |

Para cualquier transmisor RF, configurar potencia/frecuencia de acuerdo con normativa local.

## 7. Instrumentación electrónica

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P2 | FNIRSI-138 Pro o equivalente | 1 | osciloscopio |
| P2 | GM328A / LCR-T7 similar | 1 | tester componentes |
| P2 | Analizador lógico USB 8 ch | 1 | señales digitales |
| P2 | USB-UART CP2102/CH340/FTDI | 1–2 | consola serial |
| P2 | Juego de puntas/cables | 1 | medición |
| P2 | Bananas 4 mm rojo/negro | 1 par | fuente LAB |
| P2 | Mini protoboard externa | 1 | prototipos |

## 8. Alimentación auxiliar

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P0 | Powerbank/batería AUX protegida USB-C PD | 1 | accesorios |
| P0 | Módulo de distribución 5 V | 1 | rail AUX |
| P0 | Fusible principal + portafusible | 1 | protección |
| P0 | Polyfuses/fusibles por rama | lote | protección |
| P1 | High-side load switches/eFuse | 6–10 canales | encendido módulos |
| P1 | MOSFET/driver ventiladores | 2–3 | ventilación |
| P2 | Buck-boost regulable | 1 | fuente LAB |
| P2 | Voltímetro/amperímetro digital | 1 | fuente LAB |
| P2 | USB-C PD trigger/source según diseño | 1 | distribución PD |
| P2 | Interruptor OUTPUT para LAB PSU | 1 | seguridad |
| P2 | Fusible salida LAB | 1 | seguridad |

## 9. Audio / ambiente

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| YA | Parlantes Dell | 2 | audio PC |
| P3 | Amplificador clase D pequeño | 1 | audio auxiliar |
| P3 | Parlantes auxiliares | 2 | radio/Bluetooth |
| P3 | Micrófono externo/panel | 1 | experimentación |
| P3 | Tira/LEDs RGB de estado | opcional | iluminación funcional |

## 10. Refrigeración

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| YA | Cooler/heatpipe Dell | 1 | CPU |
| P1 | Ventilador 5 V silencioso | 1–2 | flujo caja |
| P1 | Rejillas | 2 | entrada/salida |
| P1 | Filtros desmontables | 1–2 | polvo |
| P1 | Sensor temperatura auxiliar | 1 | control |

## 11. PCB/backplane

Primera versión: perfboard o PCB simple.

La PCB final debe integrar:

- ESP32-S3 mediante headers;
- entradas de switches;
- LEDs;
- drivers;
- load switches;
- I²C;
- UART;
- conectores para LoRa/NFC/sensores;
- fan headers;
- INA219/INA226;
- fusibles de baja corriente;
- conectores JST.

**No** integrar en nuestra PCB:

- USB 3 de alta velocidad;
- HDMI;
- Ethernet;
- coaxial RF;
- carga de batería Dell.

Esos enlaces usan módulos/cables certificados o prefabricados.

## 12. Herramientas de montaje

- cautín con control de temperatura;
- estaño y flux;
- multímetro;
- pelacables;
- crimpadora JST/ferrules;
- Dremel o herramienta rotativa;
- taladro;
- limas;
- calibre digital;
- juego de brocas escalonadas;
- ayuda de tercera mano;
- etiquetadora o termorretráctil marcado.

## Pendientes antes de comprar

- identificar modelo exacto del Arduino;
- medir caja real;
- verificar layout interno real del Dell;
- elegir hub con alimentación independiente real;
- elegir modelo de Wi‑Fi USB;
- elegir variante LoRa y banda permitida;
- elegir powerbank/rail AUX;
- medir consumo total estimado.
