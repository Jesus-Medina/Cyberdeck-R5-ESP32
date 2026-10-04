# 08 — Comunicaciones, radio y RF

## Objetivo

El cyberdeck tendrá interfaces independientes para que cada tecnología tenga un trabajo claro.

```mermaid
flowchart TB
    PC["Dell / Linux"]

    PC --> INT["Wi‑Fi interno\nuso normal"]
    PC --> LAN1["LAN1 Dell"]
    PC --> LAN2["LAN2 UE306"]
    PC --> WLAB["Wi‑Fi USB LAB"]
    PC --> SDR["RTL-SDR"]
    PC --> GNSS["GNSS/GPS"]

    ESP["ESP32-S3"] --> LORA["LoRa"]
    ESP --> NFC["PN532"]

    WLAB --> WA["RP-SMA A/B"]
    SDR --> SA["SMA SDR"]
    LORA --> LA["SMA LoRa"]
    GNSS --> GA["Antena GNSS"]
```

## Wi‑Fi interno

Uso:

- Internet;
- SSH;
- actualizaciones;
- red habitual.

No se reserva para experimentación.

## Wi‑Fi USB de laboratorio

Requisitos:

- 2.4/5 GHz;
- soporte Linux estable;
- modo monitor cuando el driver/chipset lo permita;
- antenas desmontables;
- conexión USB;
- uso únicamente en redes propias/autorizadas.

Montaje:

- módulo dentro de zona RF;
- uno o dos pigtails cortos;
- conectores RP-SMA bulkhead externos.

## Ethernet

### LAN1

Puerto integrado del Dell.

### LAN2

TP-Link UE306 por USB.

Casos de uso:

- red de laboratorio + red de administración;
- router/firewall experimental;
- captura/diagnóstico de redes propias;
- puente entre dos segmentos;
- VMs con interfaces dedicadas.

## RTL-SDR

Función: recepción RF de propósito general.

Arquitectura:

```text
Antena -> SMA bulkhead -> coaxial corto -> RTL-SDR -> USB -> Linux
```

Software previsto:

- SDR++;
- GQRX;
- GNU Radio;
- rtl_433;
- herramientas de decodificación según la señal recibida.

El RTL-SDR se monta lejos de DC/DC y USB-C PD para reducir ruido.

## LoRa

LoRa será un subsistema real, no decorativo.

Hardware preferido:

- módulo basado en SX1262 o SX127x;
- interfaz SPI/UART según placa;
- antena externa;
- conector SMA dedicado.

Usos:

- telemetría entre nodos propios;
- sensores remotos;
- mensajería LoRa;
- experimentos con Meshtastic si el hardware elegido es compatible;
- beacon/status del cyberdeck.

Arquitectura:

```mermaid
flowchart LR
    ESP["ESP32-S3"] -->|SPI/UART| LORA["Módulo LoRa"]
    LORA --> SMA["SMA panel"]
    SMA --> ANT["Antena"]
```

La frecuencia, potencia y duty-cycle deben configurarse según la normativa local antes de transmitir.

## GNSS/GPS

Uso:

- posición;
- hora UTC;
- geotagging de mediciones;
- sincronización de registros.

Preferencia:

- módulo USB para máxima simplicidad, o UART si se quiere integrar con ESP32;
- antena con vista razonable al cielo;
- conector externo si la caja degrada recepción.

## NFC/RFID

PN532 conectado al ESP32 por I²C/SPI.

Usos:

- lectura/escritura de etiquetas compatibles;
- identificación de proyectos;
- automatizaciones locales;
- laboratorio autorizado.

## Bluetooth

Se conserva Bluetooth del Dell.

El ESP32 también dispone de BLE para:

- sensores;
- control;
- pruebas IoT.

## Radio FM/Bluetooth auxiliar

Opcional tipo 808BT:

- funciona con el PC apagado;
- radio FM;
- Bluetooth audio;
- AUX;
- parlantes propios.

No es requisito para v1, pero queda contemplado mecánica y eléctricamente.

## Panel RF recomendado

```text
[RP-SMA WIFI A] [RP-SMA WIFI B]
[SMA SDR] [SMA LORA] [GNSS]
```

Cada conector debe estar rotulado para evitar conectar una antena incorrecta.


## IR / control de displays

El cyberdeck tendrá un módulo IR para laboratorio con equipos propios:

- receptor IR 38 kHz;
- LED IR 940 nm con driver por transistor;
- captura y reproducción de comandos de controles propios;
- perfiles para TV, switch HDMI y otros equipos compatibles.

Para cambiar el contenido de una TV propia usada como signage, la arquitectura preferida no es RF sino:

~~~text
signage HDMI -> HDMI switch -> TV
Dell HDMI ---/
~~~

El cyberdeck puede controlar el switch mediante IR y mostrar cualquier imagen/vídeo/dashboard desde el Dell.

Detalles: [18-display-control-ir-lab.md](./18-display-control-ir-lab.md).

## Sub-GHz lab opcional

Se contempla CC1101 para pruebas autorizadas con dispositivos propios de código fijo y protocolos sub-GHz compatibles.

El RTL-SDR se mantiene como receptor de propósito general; no transmite.
