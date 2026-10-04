# 04 — BOM maestra v3 Smart Modular

Estados:

- **YA**: disponible.
- **P0**: estructura/seguridad.
- **P1**: núcleo.
- **P2**: comunicaciones/laboratorio.
- **P3**: expansión.

## 1. Base

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| YA | Dell Vostro 3405 Ryzen 5 3450U | 1 | Host |
| YA | 12 GB RAM | 1 | Memoria |
| YA | SSD 256 GB | 1 | Almacenamiento |
| YA | pantalla/teclado/touchpad/batería/BMS/cargador | 1 set | plataforma Dell |
| P0 | Caja Robust MJ-5018 / Easy 16" | 1 | Chasis |
| P0 | ABS 3 mm / panel equivalente | 2+ | bandejas/paneles |
| P0 | M2/M3 + separadores | lote | módulos |
| P0 | JST-GH/XH o similar polarizado | lote | arneses |
| P0 | ferrules, termorretráctil, malla | lote | cableado |

## 2. Supervisor

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P1 | ESP32-S3 DevKit | 1 | supervisor |
| P1 | OLED I²C 1.3" | 1 | estado |
| P1 | **SW1 SUPERVISOR ENABLE** DC | 1 | hard-off ESP32 |
| P1 | encoder | 1–2 | menú |
| P1 | switches/pulsadores | lote | control |
| P1 | LEDs | lote | estado |
| P1 | buzzer | 1 | alarma |
| P1 | DS3231 | 1 | RTC |
| P1 | BME280 | 1 | ambiente |
| P1 | watchdog por firmware + brownout | — | resiliencia |

## 3. Smart Backplane

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P0 | **SW0 MASTER AUX** DC | 1 | hard-off AUX completo |
| P0 | fusible principal | 1 | protección |
| P0 | eFuse/protección de entrada | 1 | protección |
| P1 | high-side load switch/eFuse con EN/FAULT | 6–10 | ramas |
| P1 | resistencias pull-down EN | 1/canal | default OFF |
| P1 | INA219/INA226 | 1–2 | rails críticos |
| P1 | INA3221 o monitor multicanal equivalente | 1–3 | current sense slots |
| P1 | TCA9548A I²C mux | 1 | smart slots |
| P1 | EEPROM I²C 24C02/24C04 | 1/carrier | Module ID |
| P1 | conectores Smart Module Port | 4–8 | módulos |
| P1 | headers fan PWM/tach | 2 | ventilación |
| P1 | PCB backplane v1 | 1 | distribución |

## 4. Aislamiento Host ↔ Supervisor

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P1 | USB-UART host side | 1 | Dell → serial |
| P1 | aislador digital UART, p.ej. ISO7721/ADuM1201 o equivalente | 1 | evitar backfeed |
| P1 | circuito PC_PWR_SENSE de alta impedancia/aislado | 1 | detectar Dell |
| P1 | USB-C SERVICE para ESP32 | 1 | flash/debug |

## 5. UI auxiliar

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P1 | ESP32-2432S028R CYD 2.8" | 1 | UI táctil |
| P1 | extensión microSD | 1 | SD accesible sin microsoldadura |

## 6. Arduino / GPIO

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| YA | Arduino existente | 1 | MCU LAB |
| P1 | bornes enchufables | lote | GPIO |
| P1 | panel I²C/SPI/UART/digital/analog | 1 | expansión |
| P2 | level shifters 3.3/5 V | 1–2 | niveles |
| P2 | optoacopladores | lote | aislamiento |

## 7. USB / panel

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P0 | hub USB 3 alimentado **anti-backfeed** | 1 | backbone |
| P0/P1 | hub con per-port power control si se encuentra compatible | 1 | modularidad USB pro |
| P0 | extensiones USB-A panel | 2–3 | puertos |
| P0 | USB-C panel | 1–2 | servicio |
| P0 | HDMI panel | 1 | vídeo |
| P0 | RJ45 panel | 1–2 | LAN |
| P0 | audio 3.5 mm panel | 1 | audio |
| P0 | SMA/RP-SMA bulkheads | varios | RF |

## 8. Redes

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| YA | LAN Dell | 1 | LAN1 |
| YA | TP-Link UE306 | 1 | LAN2 |
| P2 | Wi‑Fi USB dual-band Linux-friendly | 1 | LAB autorizado |
| P2 | antenas Wi‑Fi | 2 | RF |
| P2 | RP-SMA bulkhead | 2 | panel |

## 9. RF / navegación

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P2 | RTL-SDR | 1 | recepción RF |
| P2 | SMA + antenas SDR | set | SDR |
| P2 | LoRa SX1262/SX127x | 1 | telemetría |
| P2 | Smart Carrier LoRa + EEPROM ID | 1 | módulo pro |
| P2 | SMA + antena LoRa adecuada | set | LoRa |
| P2 | GNSS/GPS | 1 | posición/tiempo |
| P2 | Smart Carrier GNSS + EEPROM ID | 1 | módulo pro |
| P2 | PN532 | 1 | NFC/RFID |
| P2 | Smart Carrier NFC + EEPROM ID | 1 | módulo pro |
| P3 | radio FM/Bluetooth | 1 | audio independiente |

## 10. Instrumentación

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P2 | FNIRSI-138 Pro/equivalente | 1 | scope |
| P2 | GM328A/LCR-T7 | 1 | componentes |
| P2 | logic analyzer USB 8 ch | 1 | digital |
| P2 | USB-UART | 1–2 | serial |
| P2 | bananas 4 mm | 1 par | PSU |
| P2 | cables/puntas | set | banco |

## 11. Energía AUX / fuente LAB

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P0 | batería/powerbank AUX protegida | 1 | accesorios |
| P0 | distribución 5 V | 1 | bus |
| P0 | fusibles/polyfuse | lote | protección |
| P2 | buck-boost **CC/CV programable con encoder** | 1 | fuente LAB universal |
| P2 | display V/A/W integrado o V/A meter | 1 | medición |
| P2 | switch OUTPUT físico | 1 | corte fuente LAB |
| P2 | fusible OUTPUT | 1 | protección |
| P2 | bananas 4 mm + borne tornillo | 1 set | salida universal |
| P2 | regulador 5–6 V high-current | 1 | rail SERVO/AUX |
| P2 | headers servo 3-pin / borne AUX | 2–4 | servos/periféricos |
| P2 | regulador 3.3 V protegido | 1 | rail de lógica externo |
| P2 | rail 12 V AUX (si se valida necesidad) | 1 | ventiladores/periféricos |
| P2 | USB-C PD trigger/source según diseño | 1 | PD |

## 12. Ventilación

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| YA | cooler Dell | 1 | CPU |
| P1 | fan 5 V PWM/tach si es posible | 1–2 | caja |
| P1 | rejillas/filtros | 2 | flujo |
| P1 | sensor temperatura zona power | 1 | control |

## Smart Module Port v3

Pinout lógico tentativo:

```text
1  3V3_ID
2  5V_SW
3  GND
4  ENABLE
5  POWER_GOOD / FAULT
6  SDA
7  SCL
8  UART_TX
9  UART_RX
10 INT / PRESENCE
```

No es un estándar final hasta validar corrientes, conectores y PCB.

## No pasa por el backplane genérico

- USB 3 differential pairs;
- HDMI;
- Ethernet;
- coaxial RF;
- batería Dell.

Esos enlaces usan cableado diseñado para su señal.

## Pendientes de selección

- modelo exacto de eFuse/load switch;
- hub con power por puerto;
- aislador UART;
- monitor de corriente multicanal;
- conector final Smart Module Port;
- banda LoRa legal/útil;
- powerbank/fuente AUX.


## V0.1 — BOM cerrada

La primera implementación Smart Power + Supervisor queda congelada en [17-v0.1-final-bom-checklist.md](./17-v0.1-final-bom-checklist.md).

Decisiones específicas de V0.1:

- 1 x INA3221 para tres canales de medida;
- 5 x TPS2553DBVR-1 comprados, 2 instalados inicialmente;
- RILIM de cada canal activo: 20 kΩ + 6.8 kΩ en serie = 26.8 kΩ;
- 1 x ADuM1201BRZ instalado, con dominios de masa separados;
- TCA9548A no es requisito de V0.1 y queda para expansión;
- 100 nF por TPS2553, 10 µF local según necesidad y 470 µF/16 V en bus 5 V;
- fusible V0.1: 2 A slow-blow 5x20 en la entrada DC de 12 V;
- cargas de banco: 1 x 10 Ω/10 W y 1 x 5 Ω/10 W;
- entrada física: Mean Well GST60A12-P1J -> jack 5.5x2.1 mm centro positivo.

No se energizan módulos caros hasta aprobar el bring-up documentado.


## 13. Display Control / IR Lab

| Estado | Pieza | Cant. | Función |
|---|---|---:|---|
| P2 | receptor IR 38 kHz TSOP38238 / VS1838B | 1–2 | capturar comandos de controles propios |
| P2 | LED IR 940 nm | 2–4 | reproducir comandos IR |
| YA | 2N2222 / 2N3904 del kit | 1 | driver LED IR |
| YA | resistencias del kit | varias | polarización/limitación |
| P2 | switch HDMI 2x1 con control remoto | 1 | alternar signage normal / salida Dell |
| P2 | cable HDMI Dell -> switch | 1 | vídeo del cyberdeck |
| P3 | capturadora USB HDMI | 1 | análisis/registro de fuentes HDMI propias |
| P3 | CC1101 | 1 | laboratorio sub-GHz autorizado de dispositivos propios |

Arquitectura y uso: [18-display-control-ir-lab.md](./18-display-control-ir-lab.md).
