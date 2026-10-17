# Lilith — plan de soldadura SMD y adaptadores (17-10-2026)

## Problema detectado

Los IC pequeños **no vienen soldados a sus adaptadores**. La lista de compras original no advirtió con suficiente claridad que se necesita **soldadura SMD** para convertirlos a pines 2,54mm; el usuario recién está aprendiendo a soldar. No asumir que tener un adaptador significa que se puede insertar el chip con cables Dupont.

| Chip | Encapsulado | Adaptador | Destino |
|---|---|---|---|
| TPS2553DBVR-1 | SOT-23-6, paso 0,95mm | SOT23-6 compatible → DIP 2,54mm | 2 salidas V0.1, 3 reserva |
| ADuM1201BRZ | SOIC8/SOP8, confirmar patrón | SOP/SOIC8 → DIP8 2,54mm | aislamiento UART Dell/AUX |
| EEPROM 24C02 SOP8 | SOP8/SOIC8 según lote | SOP/SOIC8 → DIP8 2,54mm | ID de módulos |

**No todos los adaptadores SOT/SOP tienen el mismo paso o pinout.** Validar serigrafía, huella, pin1 y mapeo real antes de energizar.

### Herramientas útiles

Un **soporte fijo de PCB / tercera mano**, lupa con luz o microscopio, **flux de electrónica** (nunca ácido para tuberías), estaño fino 0,3–0,5mm, pinzas de precisión, cautín con punta adecuada, malla desoldadora, multímetro, ventilación y gafas. No es obligatorio comprar una estación profesional de entrada. El soporte no sustituye flux, magnificación y práctica.

### Práctica y proceso de montaje

1. Practicar antes en **componentes SMD baratos o PCB de descarte**. No empezar por nuestros TPS2553.
2. Desconectar toda energía. Identificar pin 1 del chip y posición correcta en adaptador usando hoja de datos y lupa.
3. Sujetar PCB, aplicar algo de flux, preestañar un pad, colocar chip con pinzas y fijar **una patita**; comprobar alineación.
4. Soldar patitas restantes con poco estaño y flux; quitar puentes con malla con cuidado de no arrancar pistas.
5. Inspeccionar todas las uniones con aumento; comprobar continuidad de pad→pin accesible y cortos indebidos entre pads.
6. Soldar headers macho de 2,54mm si faltan y **mapear pin por pin**; no confiar en orientación visual genérica.
7. Probar un circuito cada vez con alimentación correcta, protección/carga resistiva, EN por defecto OFF, ILIM y FAULT para TPS2553. Para ADuM conservar dos dominios aislados de masa: GND_Dell **no** unido a GND_AUX.

Si no se puede inspeccionar fiable la soldadura, solicitar montaje SMD a un técnico antes de conectar módulos costosos. **Nunca soldar o medir resistencia con la placa energizada.**

Ver [BOM](17-v0.1-final-bom-checklist.md), [netlist](20-v0.1-wiring-netlist.md) y [bitácora](22-lilith-build-status-2026-10-17.md).
