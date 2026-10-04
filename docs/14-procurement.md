# 14 — Compras para v3 Smart Modular

## Regla

No comprar piezas dependientes del Dell hasta abrir la unidad real.

## Comprar ahora — prototipo universal

- ESP32-S3 DevKit;
- OLED I2C 1.3";
- ESP32 CYD 2.8";
- DS3231;
- BME280;
- TCA9548A;
- INA226 / INA3221;
- EEPROM 24C02/24C04 para carriers;
- bornes enchufables;
- JST y crimpadora;
- perfboard;
- fusibles/polyfuse;
- switches de panel;
- encoder;
- LEDs;
- ventilador 5 V PWM/tach;
- analizador lógico USB;
- USB-UART CP2102/FTDI;
- level shifters;
- optoacopladores;
- separadores/tornillos M2/M3;
- ABS/FR4 para subchasis temporal.

## Comprar después de validar power

- eFuse/load-switch channels;
- Smart Backplane PCB;
- powerbank/fuente AUX;
- buck/boost CC/CV;
- V/A meter;
- bananas;
- USB-C PD modules;
- aislador digital UART;
- hub USB 3 con per-port power switching real si se consigue.

## Comunicaciones

- RTL-SDR;
- antena SDR;
- Wi-Fi USB Linux-friendly;
- antenas Wi-Fi;
- LoRa SX1262/SX127x;
- antena LoRa de la banda elegida;
- GNSS;
- PN532;
- SMA/RP-SMA bulkheads.

## Instrumentación

- FNIRSI/equivalente;
- GM328A/LCR-T7;
- logic analyzer;
- USB-UART;
- probes/cables.

## Comprar sólo después del teardown Dell

- cable/display extension;
- controller eDP;
- FFC extenders;
- WLAN pigtails;
- brackets finales;
- panel definitivo;
- PCB mecánica/carriers con dimensiones finales.

## Hub USB

Preferencia v3:
- hub powered;
- anti-backfeed;
- per-port power switching real;
- compatible con Linux/uhubctl si es posible.

No confiar sólo en que el descriptor USB diga "per-port switching"; validar que realmente corte VBUS.

## Orden de compra

### Lote A
Control + sensores + montaje.

### Lote B
Power + backplane prototype.

### Lote C
Redes/RF.

### Lote D
Instrumentación.

### Lote E
Piezas Dell-specific y panel definitivo.
