# 05 — Diseño mecánico

## Caja

Objetivo actual:

- Robust MJ-5018 / Easy 16";
- exterior aprox. 406 × 330 × 174 mm;
- interior de referencia aprox. 372 × 260 × 155 mm;
- Dell completo aprox. 330 × 240 mm.

El Dell ocupa casi toda el área útil, por lo que el diseño se resuelve **en capas**.

## Estrategia recomendada

No desnudar la motherboard desde el primer día.

Primera integración:

1. conservar el conjunto inferior Dell funcional;
2. separar el display assembly si hace falta montarlo en la tapa;
3. mantener motherboard, cooler, batería, teclado y touchpad en su estructura original mientras sea posible;
4. colocar los módulos auxiliares en una bandeja técnica inferior;
5. montar instrumentación en un panel superior independiente.

## Capas

```text
TAPA
┌────────────────────────────────────┐
│ LCD Dell 14"                       │
│ OLED / indicadores / audio opc.    │
└────────────────────────────────────┘

SUPERFICIE
┌────────────────────────────────────┐
│ FNIRSI | GM328A | CYD | GPIO       │
│ PSU LAB | V/A | switches           │
│                                    │
│ teclado + touchpad Dell            │
└────────────────────────────────────┘

BANDEJA TÉCNICA
┌────────────────────────────────────┐
│ ESP32-S3 | HUB | Arduino | UE306   │
│ power AUX | logic | UART           │
│ Wi-Fi LAB | RTL-SDR | LoRa | GNSS │
└────────────────────────────────────┘
```

## Distribución por zonas

### Zona RF

- RTL-SDR;
- Wi‑Fi USB;
- LoRa;
- GNSS;
- coaxiales;
- bulkheads.

Ubicar en un extremo y lejos de:

- buck/boost;
- USB-C PD converters;
- amplificadores;
- cables de potencia.

### Zona power

- fusibles;
- eFuse;
- load switches;
- DC/DC;
- powerbank/entrada AUX;
- medidor;
- fuente variable.

### Zona control

- ESP32-S3;
- backplane;
- RTC;
- sensores;
- conectores JST.

### Zona lab

- Arduino;
- USB-UART;
- logic analyzer;
- bornes GPIO.

## Panel superior propuesto

```text
┌──────────────────────────────────────────────┐
│ FNIRSI | GM328A | ESP32 CYD | GPIO TERMINAL │
│                                              │
│ OLED | ENC | USB | PSU V/A | SWITCH BANK    │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │          TECLADO DELL                   │ │
│ │                              TOUCHPAD    │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

## Panel de comunicaciones

```text
[DC DELL] [AUX/PD] [USB3] [USB3] [USB-C]
[LAN1] [LAN2] [HDMI] [AUDIO]
[RP-SMA WIFI A] [RP-SMA WIFI B]
[SMA SDR] [SMA LORA] [GNSS]
[GPIO/I2C/SPI/UART] [+ LAB -]
```

## Fijación

Preferir:

- separadores M3;
- inserts térmicos en piezas impresas;
- brackets atornillados;
- velcro industrial sólo para módulos que deban retirarse;
- foam fino antivibración;
- bridas reutilizables.

Evitar:

- silicona caliente como fijación estructural;
- módulos suspendidos por cables;
- PCB tocando plástico sin separadores;
- cables RF doblados agresivamente.

## Acceso de mantenimiento

La bandeja superior debe poder levantarse sin desconectar todo.

Cada arnés debe llevar etiqueta:

- PWR-01;
- USB-01;
- RF-SDR;
- RF-LORA;
- FAN-01;
- I2C-01;
- GPIO-LAB.

## Ventilación

Mantener libres las entradas del Dell. Añadir entrada y extracción en la caja según las temperaturas medidas.

La resistencia al agua original de la caja deja de estar garantizada después de hacer agujeros, salvo que se usen bulkheads, juntas y respiraderos diseñados para sellado.
