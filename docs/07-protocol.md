# 07 — Protocolo PC ↔ ESP32

## Transporte

Primera versión: USB CDC/Serial a 115200 baud.

Formato sencillo basado en líneas de texto para facilitar depuración.

## PC → ESP32

Ejemplos:

```text
SYS CPU=42 RAM=37 BAT=81
NET WIFI=-52 IP=192.168.1.36
TEMP CPU=47.2
MODE NORMAL
OLED MSG=HELLO
```

## ESP32 → PC

```text
HELLO ESP32-SUPERVISOR 0.1
SW MASTER=1
SW SDR=1
SW GPS=0
BTN MACRO1=PRESS
STATE AUX=ON
```

## Comandos propuestos

| Comando | Dirección | Descripción |
|---|---|---|
| `PING` | PC → ESP | prueba de enlace |
| `PONG` | ESP → PC | respuesta |
| `SYS ...` | PC → ESP | telemetría |
| `NET ...` | PC → ESP | red |
| `SW ...` | ESP → PC | cambio de switch |
| `BTN ...` | ESP → PC | pulsador |
| `MODE ...` | ambos | modo operativo |
| `POWER PULSE` | interno | solicitud controlada de power |

## Evolución

Si el protocolo crece, migrar a JSON Lines o CBOR con CRC/sequence numbers.
