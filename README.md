# Cyberdeck R5 + ESP32

Cyberdeck portátil modular basado en un **Dell Vostro 3405** con **AMD Ryzen 5 3450U, 12 GB RAM y SSD de 256 GB**, reutilizando pantalla, batería/BMS, teclado, touchpad, Wi‑Fi/Bluetooth, audio y refrigeración originales.

La filosofía del proyecto es **no copiar literalmente** un cyberdeck de Raspberry Pi: se toma su idea de instrumentación y panel modular, pero el Dell x86 permanece como computador principal y se añaden subsistemas independientes para control, redes, radio, electrónica e instrumentación.

> **Estado:** diseño mecánico/electrónico v2.0. Caja objetivo: Robust MJ-5018 / Easy 16", con volumen interior aproximado de 372 × 260 × 155 mm. Antes de cortar paneles se debe medir la unidad real.

## Objetivos

- Computador x86 Linux/Windows completo.
- Supervisor físico independiente con ESP32-S3.
- Pantalla táctil ESP32 CYD como herramienta secundaria.
- Arduino dedicado a laboratorio GPIO.
- Doble Ethernet.
- Wi‑Fi interno para uso normal y Wi‑Fi USB dedicado para laboratorio autorizado.
- RTL-SDR con antena externa.
- LoRa independiente.
- GNSS/GPS, NFC/RFID y RTC.
- Banco de electrónica integrado: fuente variable, osciloscopio, tester de componentes, analizador lógico y USB-UART.
- Puertos de panel, antenas externas y alimentación modular.
- Reparabilidad: módulos atornillados y conectados por JST/USB, evitando soldarlos permanentemente.
- Mantener la batería/BMS Dell sin modificar sus celdas.

## Arquitectura resumida

```mermaid
flowchart TB
    subgraph PC["COMPUTADOR PRINCIPAL"]
        DELL["Dell Vostro 3405\nRyzen 5 3450U\n12 GB / 256 GB"]
        BAT["Batería + BMS Dell"]
        IO["Pantalla + teclado + touchpad"]
        WIFI0["Wi‑Fi/Bluetooth interno"]
    end

    subgraph USB["BACKBONE USB"]
        HUB["Hub USB 3.x alimentado\ncon protección anti-backfeed"]
    end

    subgraph CONTROL["CONTROL"]
        ESP["ESP32-S3 supervisor"]
        OLED["OLED estado"]
        SW["Switches / botones / encoder"]
        PWRCTRL["Load switches / MOSFET"]
        SENSOR["Sensores + INA219/INA226"]
    end

    subgraph AUXUI["UI AUXILIAR"]
        CYD["ESP32 CYD 2.8\" táctil + microSD"]
        RTC["RTC DS3231"]
    end

    subgraph LAB["LAB ELECTRÓNICO"]
        ARD["Arduino de laboratorio"]
        GPIO["Bornes GPIO / I²C / SPI / UART"]
        PSU["Fuente DC variable + V/A + bananas"]
        SCOPE["FNIRSI-138 Pro o equivalente"]
        GM["GM328A"]
        LOGIC["Analizador lógico USB"]
        UART["USB-UART"]
    end

    subgraph COMMS["REDES / RADIO"]
        WIFI1["Wi‑Fi USB dual-band de laboratorio"]
        ETH2["TP-Link UE306"]
        SDR["RTL-SDR"]
        LORA["LoRa SX1262/SX127x"]
        GPS["GNSS/GPS"]
        NFC["PN532 NFC/RFID"]
        RADIO["Radio FM/Bluetooth opcional"]
    end

    BAT --> DELL
    IO --> DELL
    WIFI0 --> DELL
    DELL --> HUB

    HUB --> ESP
    HUB --> CYD
    HUB --> ARD
    HUB --> WIFI1
    HUB --> ETH2
    HUB --> SDR
    HUB --> GPS
    HUB --> LOGIC
    HUB --> UART

    ESP --> OLED
    ESP --> SW
    ESP --> PWRCTRL
    ESP --> SENSOR
    ESP --> LORA
    ESP --> NFC
    ESP --> RTC
    ARD --> GPIO
    PSU --> GPIO
```

## Roles

| Subsistema | Rol |
|---|---|
| Dell Ryzen | Linux/Windows, VMs, programación, SDR, redes, análisis |
| ESP32-S3 | Supervisor permanente del cyberdeck |
| ESP32 CYD | Pantalla táctil/herramienta independiente |
| Arduino | Microcontrolador de laboratorio reprogramable |
| Wi‑Fi USB | Laboratorio inalámbrico autorizado |
| LAN Dell + UE306 | Dos interfaces Ethernet físicas |
| RTL-SDR | Recepción y análisis RF |
| LoRa | Telemetría/enlaces LoRa compatibles con normativa local |
| GNSS | Posición y tiempo |
| PN532 | NFC/RFID de laboratorio |
| FNIRSI + GM328A + logic analyzer | Instrumentación electrónica |
| Fuente variable | Alimentar prototipos externos |

## Principio de construcción

**El Dell no se convierte en una Raspberry Pi.** El computador queda eléctricamente independiente y el mundo físico se añade mediante USB, ESP32, Arduino y una distribución auxiliar protegida.

```text
PC Dell intacto
      │
      ├── USB backbone ── periféricos
      │
      └── USB serial ─── ESP32 supervisor
                             │
                    switches / power / sensores
```

No se soldará sobre la batería Dell, sus celdas ni la motherboard salvo que una futura modificación esté documentada, medida y sea realmente necesaria.

## Documentación

- `docs/01-vision.md` — alcance y decisiones.
- `docs/02-architecture.md` — arquitectura completa.
- `docs/03-electrical.md` — alimentación, protecciones y buses.
- `docs/04-bom.md` — BOM maestra con todas las piezas.
- `docs/05-mechanical.md` — distribución en la caja.
- `docs/06-build-phases.md` — orden de construcción y pruebas.
- `docs/07-protocol.md` — protocolo PC ↔ ESP32.
- `docs/08-comms-radio.md` — Wi‑Fi, Ethernet, SDR, LoRa, GNSS y NFC.
- `docs/09-instrumentation.md` — laboratorio electrónico integrado.
- `TODO.md` — tareas pendientes.

## Regla principal

Primero se monta y prueba en banco. **La placa frontal definitiva se corta al final**, cuando todas las piezas reales estén compradas y medidas.
