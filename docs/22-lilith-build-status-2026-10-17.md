# Lilith Cyberdeck — bitácora de montaje real (17-10-2026)

> Estado: **prototipo funcional de supervisión a 3,3 V**, alimentado desde USB del ESP32-S3. **NO** es todavía la V0.1 completa de distribución 12 V→5 V, ni se han probado protecciones TPS2553. Registrar hechos observados sin confundirlos con diseños futuros.

## Componentes realmente usados y pruebas

| Elemento | Resultado |
|---|---|
| Dell Vostro 3405 Ryzen 5 3450U/12 GB/256 GB | Equipo principal comprado, aún independiente del banco |
| ESP32-S3 N16R8 REV1.2 | Arranca y ejecuta programa por USB (Arduino IDE: ESP32S3 Dev Module) |
| OLED SH1106 1,3" 128x64 | Funciona con U8g2; dirección I²C 0x3C |
| INA3221, tres shunts R100 (~0,1 Ω) | Funciona en **0x40**; fabricante 0x5449, chip 0x3220 |
| Dirección INA A0 | **Puente soldado A0→GND**, continuidad verificada. Antes la dirección fluctuaba 0x40/0x41 al quedar flotante |
| Tres resistencias 100 Ω ¼W | Ahora son **tres cargas independientes**, una por canal |
| Voltaje medido con multímetro | **3,17 V** en fila 5→fila 2, con las tres resistencias conectadas |
| Resistencia medida sin USB, 3V3-GND | 27,5 Ω in-circuit; 3×100 Ω ideal 33,3 Ω, pero existen caminos de los demás circuitos |
| Funcionamiento reportado | Sin parpadeos de OLED, reinicios ni temperatura anormal perceptible del regulador durante ensayo; no es una prueba térmica larga |

Muestra real con tres ramas:

| Canal | Voltaje bus | Caída shunt | Corriente | Potencia |
|---|---:|---:|---:|---:|
| CH1 | 3,168 V | 3,280 mV | 32,8 mA | 103,91 mW |
| CH2 | 3,168 V | 3,240 mV | 32,4 mA | 102,64 mW |
| CH3 | 3,176 V | 3,240 mV | 32,4 mA | 102,90 mW |

**Total medido en cargas: ~97,6 mA**, sin incluir ESP32, INA ni pantalla. Prueba anterior de CH1 único: ~3,232 V, 33,2–33,6 mA; estable >5 min. Entre ambas pruebas hubo un ensayo temporal con **un resistor compartido por los tres VIN−**: ya no representa el circuito actual.

## Mapa físico de la protoboard usado HOY

**No confundir filas con GPIO ni trasladar estas conexiones a la V0.1 de 5 V. Desconectar USB para Ω/continuidad, cambios o soldadura.**

| Conexión | Fila / punto |
|---|---|
| GND de ESP32, OLED, INA | **2** |
| 3V3 del ESP32 | **5**, con puente A–E ↔ F–J sobre esa fila |
| SDA del ESP32 GPIO8 hacia INA y OLED | **10** |
| SCL del ESP32 GPIO9 hacia INA y OLED | **15** |
| OLED VDD e INA VS | **5** |
| INA A0 | soldado a GND en breakout; dirección 0x40 |
| INA VIN1+, VIN2+, VIN3+ | **5** cada uno |
| INA VIN1− → resistor 1 | **25 → [100 Ω] → 20 → GND/fila 2** |
| INA VIN2− → resistor 2 | **35 → [100 Ω] → 30 → riel lateral negativo (−)** |
| INA VIN3− → resistor 3 | **45 → [100 Ω] → 40 → riel lateral negativo (−)** |
| Riel lateral (−) | conectado con jumper a fila **2**; continuidad comprobada en un punto |
| Riel lateral (+) | NO conectado, nunca dar por hecho que tiene 3,3 V |

Algunos rieles laterales tienen interrupción central: verificar continuidad del punto exacto usado a fila 2. En una fila A–E son continuos y F–J son continuos, pero separados por la ranura central salvo puente.

## Programa de pruebas

Arduino IDE, Wire.begin(8,9); U8g2 OLED SH1106 0x3C (en U8g2, dirección 0x3C<<1); INA3221 0x40. Registros shunt/bus: CH1 0x01/0x02, CH2 0x03/0x04, CH3 0x05/0x06; IDs 0xFE/0xFF. Corriente I=Vshunt/0,1 Ω con unidades correctas; potencia P=Vbus*I. El programa en pantalla/serie muestra los tres canales.

**IMPORTANTE:** el `firmware/esp32-supervisor/src/main.cpp` del repositorio sigue siendo un **boceto antiguo de switches**, NO el `.ino` cargado/probado del INA/OLED. Falta exportar el código exacto de Arduino y subirlo antes de marcar firmware reproducible.

## Qué significa SW0 / SW1 y qué está pendiente

- **SW0:** corte físico general de 12 V AUX, **NO montado**.
- **SW1:** corte físico del supervisor, **NO montado**.
- Comprados 6 interruptores de palanca SPST y 6 basculantes ON/OFF. Sin asignación física final ni cableado.
- **V0.1 planificada:** Mean Well 12 V/5 A→jack→fusible 2 A→SW0→XL4015 ajustado a 5,00 V→bus. Bus→SW1→INA CH3→ESP32 supervisor; bus→TPS2553+INA CH1 y CH2→**dos salidas de 5 V protegidas**. No confundir las tres resistencias simuladas con tres salidas finales.
- Fuente Mean Well y XL4015 físicamente **en manos del usuario**, pero NO cableados ni comprobados entre sí; TPS2553 aún son chips SMD sin montar.

## Próximas verificaciones seguras

1. Fotografiar conexiones, comprobar interrupciones del riel GND y registrar valores.
2. Identificar jack 5,5×2,1 centro positivo, ratings DC SW0/SW1, fusible correcto y IN+/IN−/OUT+/OUT− reales del XL4015; **no abrir la fuente de 230 V**.
3. Probar Mean Well sola. Instalar fusible/SW0 y regular XL4015 a 5,00 V **sin ESP32 conectado**.
4. Probar con cargas **10 Ω/10 W** (a 5 V: 0,5 A/2,5 W) y **5 Ω/10 W** (1 A/5 W) cuidando temperatura; 100 Ω/¼ W a 5 V disiparía 0,25 W sin margen, no usar para esa etapa.
5. Practicar y soldar SMD en adaptadores TPS2553, verificar puentes y pin1; configurar EN apagado por defecto, ILIM y FAULT; probar canal por canal.
6. Integrar INA en bus 5 V (CH1/CH2 de salidas, CH3 supervisor), SW1 y alimentación correcta del ESP32 por pin 5V, **nunca 5V a 3V3**; evitar doble alimentación USB/5V externos.
7. Integrar TCA9548A+24C02 y CP2102+ADuM1201 con GND Dell y AUX separados.
8. Comprobar protección frente a fallas, temperatura y funcionamiento prolongado antes de hardware caro.

Referencias: [BOM V0.1](17-v0.1-final-bom-checklist.md), [netlist de diseño](20-v0.1-wiring-netlist.md), [pendientes Pro](23-lilith-power-budget-and-pending-parts.md), [SMD](24-lilith-smd-assembly.md).
