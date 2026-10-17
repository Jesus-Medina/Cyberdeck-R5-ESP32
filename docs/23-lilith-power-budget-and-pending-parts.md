# Lilith — plan de energía V1 Pro e inventario pendiente (17-10-2026)

> **Matriz P1–P6/B1–B6 (propuesta, NO ejecutada):** [26 — matriz de 12 interruptores, arneses RF de tapa y pruebas](26-lilith-switch-matrix-and-antenna-routing.md). SW0 y SW1 son las únicas funciones de switch canónicas V0.1. P3/P4 proponen inhibición en serie de EN1/EN2 distinta del netlist original, que requiere aprobación; P5/P6 y B1–B6 quedan sin cablear hasta instalar circuitos protegidos. Ningún interruptor extra genera una nueva salida protegida.


## ¿Alcanza lo comprado?

**Para prototipar V0.1:** en principio sí, sujeto a comprobar llegada, calidad y montaje SMD. **Para la V1 Pro completa:** no. La BOM V0.1 cubre dos salidas 5 V protegidas y supervisor, NO la alimentación completa del Dell, LiFePO4, múltiples rails y los aproximadamente 29 bloques funcionales previstos.

| Elemento | Estado conocido |
|---|---|
| Mean Well GST60A12-P1J 12V/5A y buck XL4015 | **Confirmados físicamente**; no ensayados conectados |
| ESP32-S3, OLED SH1106 e INA3221 | Físicamente presentes y probados en banco 3,3V |
| TPS2553DBVR-1 | **5 registrados/comprados; 2 para V0.1**, 3 reserva; SOT-23-6 sin soldar |
| ADuM1201BRZ | **5 registrados**; 1 para aislamiento UART; sin montar |
| EEPROM 24C02 SOP8, TCA9548A, CP2102, PC817 | Registrados en BOM; entrega/montaje individual pendientes de verificar |
| Adaptadores SOT23 0,95mm→DIP 2,54mm, SOP/SOIC8→DIP8 y pines macho | Registrados; los IC no están pre-soldados |
| Jack DC, fusibles lentos 2A 5x20, portafusibles, borneras, cables, kit pasivos | Registrados; comprobar cantidades reales y ratings |
| Resistencias 5Ω/10W, 10Ω/10W | Registradas para prueba a 5V; no equivalentes a 100Ω/¼W |
| 6 palancas SPST + 6 basculantes ON/OFF | Comprados; rating DC, función y montaje final pendientes |
| Pack LiFePO4/BMS, cargador, power-path, DC-DC Dell, power MUX | **No constan comprados ni integrados** |

La categoría `YA/P0/P1/P2` en la BOM antigua NO demuestra la recepción efectiva ni aprobación de cada componente. Evitar duplicar kits de resistencias/capacitores y adaptadores sin inventario.

## Arquitectura: dos fases distintas

**Banco V0.1 todavía NO construido:**

```text
Mean Well 12 V → fusible 2 A → SW0 → XL4015 regulado 5 V
                                     ├→ SW1 → INA CH3 → supervisor ESP32
                                     ├→ TPS2553 #1 → INA CH1 → Smart Out 1
                                     └→ TPS2553 #2 → INA CH2 → Smart Out 2
```

**Portátil final, concepto pendiente de selección:**

```text
LiFePO4 4S con BMS + fusible cerca del pack
  ├→ cargador LiFePO4 + power-path que permita uso/carga simultánea
  ├→ DC-DC especial para cargador original Dell (tensión, potencia, conector e ID)
  └→ entrada A selector AUX seguro
Dell batería → electrónica Dell → USB PowerShare medido → entrada B selector AUX
selector break-before-make y bloqueo inverso
  → regulación compatible con ambos rangos (buck-boost o normalización por fuente)
  → rails 5V, 12V regulado, 3V3 lógica, 5–6V servo cuando correspondan
  → protecciones adecuadas por corriente/voltaje + switches + sensores
```

**Reglas de seguridad:** Dell nunca carga LiFePO4; AUX nunca regresa a entrada DC-IN Dell; sin retorno entre fuentes ni simultaneidad por defecto; no suponer corriente suficiente del USB Dell para todos los dispositivos. El Mean Well es una **fuente de banco**, NO cargador LiFePO4. XL4015 es un **buck**, no sirve por sí solo para subir 5 V de USB Dell; TPS2553 solo admite entrada ~2,5–6,5 V y no protege cargas de 12 V directamente.

## Panel de mando y protección de cargas

Comprados **12 interruptores físicos (6 SPST y 6 basculantes)**; SW0 y SW1 son funciones por asignar dentro del panel, no equipos extra ya montados. **12 switches ≠ 12 ramas protegidas**. El objetivo histórico V1 Pro propone **6–10 ramas protegidas** y **4–8 Smart Module Ports**, sujeto a carga real. Solo 5 TPS2553 registrados y de ellos V0.1 usa 2; los tres restantes sirven solo a cargas 5 V compatibles (no a servos de corriente superior o 12V).

La **fuente LAB regulable CC/CV** con buck-boost, perilla/encoder, visualización V/A/W, fusible y switch OUTPUT es distinta del **XL4015 del carril fijo de 5 V**. La protección se diseña por módulo, no por cantidad de palancas.

## Lista de faltantes para Pro (no comprar todavía a ciegas)

1. Batería LiFePO4 4S comercial con BMS, capacidad Wh suficiente, fusible/distribución seguros y cargador compatible.
2. Power-path de carga única con soporte de consumo simultáneo.
3. Convertidor de alimentación Dell con tensión/potencia/conector/ID verificados en el cargador original.
4. Power-MUX / selector LiFePO4–OFF–Dell seguro con bloqueo de retorno; diseño de DC-DC que acepte tensión 4S y USB Dell.
5. Reguladores y protecciones para 5V/3V3/12V y 5–6V servo según potencias medidas; salidas inteligentes extras.
6. Más medición por canal/grupo si queremos monitorizar más de tres ramas.
7. Hub USB alimentado sin backfeed, desconexión por puerto solo si compatible, sensores térmicos, ventilación y cableado/fusibles/conectores adecuados.
8. PCB definitiva, control de interferencias RF, montaje mecánico y medición de dimensiones interiores reales del maletín Easy de 40,6×33×17,4 cm exteriores (sin perforaciones).

## Presupuesto antes de próximas compras

Crear **una fila por módulo real**:

| Módulo | V mín/típ/máx | Corriente reposo/normal/pico | W | Conector e interfaz | Protección | Switch | Medición |
|---|---|---|---|---|---|---|---|
| Pendiente inventario físico | ? | ? | ? | USB / SPI / UART / etc | ? | ? | ? |

Los ~29 bloques planificados son una **agrupación aproximada, no 29 dispositivos comprados ni 29 salidas**. Incluyen Dell, ESP32-S3, ESP32 CYD, Arduino, Ethernet extra, Wi-Fi Lab, RTL-SDR, LoRa, GNSS, NFC, FNIRSI, GM328A, analizador lógico, USB-UART, PSU Lab, backplane/TPS, INA, LiFePO4, rail servo, OLED, RTC, BME280, termometría, IR, hub USB, GPIO, ventilación, USB-C PD. Opcionales: CC1101, radio FM/Bluetooth, capturadora HDMI.

Ver [arquitectura portátil](21-portable-power-architecture.md), [BOM V0.1](17-v0.1-final-bom-checklist.md), [montaje real](22-lilith-build-status-2026-10-17.md).
