# 07 — Protocolo Host ↔ Supervisor

## Transporte

### Desarrollo

USB CDC/Serial directo.

### Producción recomendada

```text
Dell -> USB-UART -> digital isolator -> ESP32 UART
```

Esto impide back-power cuando el interruptor SUPERVISOR ENABLE está OFF.

Baud inicial: 115200.

## Heartbeat

El Host Daemon envía cada ~2 s:

```text
HOST HB SEQ=184 UPTIME=621 CPU=18 RAM=43 BAT=77 TEMP=49.1
```

Timeout tentativo: 6 s.

Estados:

- PC sin power sense: `OFF`;
- power sense pero sin heartbeat: `POWERED`;
- heartbeat válido: `ONLINE`;
- heartbeat perdido: `HOST_LOST`.

## Mensajes PC → ESP32

```text
HOST HB SEQ=184 UPTIME=621
SYS CPU=18 RAM=43 BAT=77 TEMP=49.1
NET WIFI=UP LAN1=UP LAN2=DOWN IP=192.168.1.36
USB SDR=ONLINE
USB WIFI_LAB=ONLINE
USB UE306=ONLINE
PROFILE RADIO
MODULE SDR REQUEST=ON
```

## Mensajes ESP32 → PC

```text
HELLO SUPERVISOR FW=0.3 HW=V3
PC STATE=ONLINE
MODULE LORA PRESENT=1 POWER=1 HEALTH=OK CURRENT=42
MODULE SDR PRESENT=1 POWER=1 HEALTH=HOST CURRENT=238
MODULE NFC PRESENT=1 POWER=0
FAULT SLOT=3 CODE=OVERCURRENT
SW SDR=1
SW LORA=1
SENSOR AUX_V=5.08 AUX_A=0.64 TEMP=31.7
```

## Module descriptors

El firmware construye una tabla:

```text
slot
module_id
name
hw_revision
power_state
health_state
current_mA
driver
capabilities
```

Si existe EEPROM de módulo, los primeros campos pueden salir del carrier.

## Estados

```text
ABSENT
PRESENT_OFF
STARTING
POWERED
ONLINE
ACTIVE
FAULT
DISABLED
```

## Comandos

| Comando | Dirección | Uso |
|---|---|---|
| PING/PONG | ambos | enlace |
| HOST HB | Host → ESP | heartbeat |
| SYS | Host → ESP | telemetría |
| NET | Host → ESP | redes |
| USB | Host → ESP | salud de dispositivos USB |
| MODULE ... REQUEST | Host → ESP | petición |
| MODULE ... STATE | ESP → Host | estado |
| PROFILE | ambos | perfil |
| FAULT | ESP → Host | falla |
| SENSOR | ESP → Host | telemetría hardware |
| RESCAN | Host/local → ESP | inventario módulos |
| RESET MODULE=x | Host/local → ESP | power-cycle controlado |

## Política de autoridad

Los controles físicos tienen prioridad para funciones peligrosas o de energía.

Ejemplo:

- si un switch físico de rama está OFF, Linux no puede forzarla ON;
- si MASTER AUX está OFF, ningún software puede encender AUX;
- si SUPERVISOR ENABLE está OFF, no existe control remoto del supervisor.

## Evolución

Durante prototipo se usa texto legible.

Versión futura:

- CBOR o MessagePack;
- framing COBS;
- CRC;
- sequence IDs;
- capability negotiation;
- registro de fallas persistente.
