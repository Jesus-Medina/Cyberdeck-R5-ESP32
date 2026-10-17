# TODO — v3 Smart Modular

## Situación real de Lilith a 17-10-2026

**Pruebas realizadas sobre protoboard a 3,3 V (no V0.1 completa):**

- [x] ESP32-S3 N16R8 arranca por USB; GPIO8 SDA / GPIO9 SCL.
- [x] OLED SH1106 detectada 0x3C y funcional.
- [x] INA3221 fijo 0x40 al soldar A0→GND; identificación TI y 3 shunts R100.
- [x] Tres cargas independientes 100Ω: ~32,4–32,8mA por canal, ~3,17V con multímetro.
- [x] Prueba breve sin reinicios, pantalla sin parpadeos y sin calentamiento percibido.

**Prioridad antes de integrar dispositivos caros:**

- [ ] Confirmar tramos de riel GND de protoboard y registrar fotografía de conexiones.
- [ ] Identificar rating DC de 6 palancas SPST + 6 basculantes; asignar SW0 y SW1 sin duplicar compras.
- [ ] Comprobar Mean Well 12V sola y polaridad centro positivo del jack 5,5x2,1; no abrir 230V.
- [ ] Verificar fusible 2A, interruptor SW0 y pinout XL4015; montar etapa de potencia adecuadamente, no sobre contactos de protoboard a corriente alta.
- [ ] Ajustar XL4015 **aislado del ESP32** a 5,00V y CC conservadora; ensayar 10Ω/10W y 5Ω/10W con control de temperatura.
- [ ] Practicar soldadura SMD y conseguir/usar soporte PCB/lupa/flux/pinzas/malla; montar e inspeccionar 2 TPS2553 con adaptadores 2,54mm.
- [ ] Probar TPS2553 uno por vez: ILIM, EN apagado por defecto, FAULT, sobrecorriente y recuperación.
- [ ] Integrar INA CH1/CH2 para dos salidas protegidas a 5V y CH3 para el supervisor; instalar SW1.
- [ ] Evitar alimentar el ESP32 por USB y rail 5V externo al mismo tiempo sin protección/selección.
- [ ] Validar TCA9548A + dos EEPROM 24C02 y CP2102 + ADuM1201 sin unir masas aisladas Dell/AUX.
- [ ] **Exportar .ino exacto probado** en Arduino IDE; `firmware/esp32-supervisor/src/main.cpp` no lo refleja.
- [ ] Ensayar funcionamiento prolongado, térmica, fusibles, fallas y backfeed antes de módulos reales.

**V1 Pro no construida:**

- [ ] Inventariar voltaje, corriente normal/pico y potencia de cada módulo real.
- [ ] Elegir batería LiFePO4 4S+BMS, fusible, cargador compatible y power-path.
- [ ] Verificar cargador Dell (tensión, W, conector/ID) y seleccionar DC-DC propio.
- [ ] Medir potencia USB Dell emergencia y diseñar selector break-before-make con bloqueo inverso.
- [ ] Dimensionar rails 5V/12V/3V3/servo y 6–10 ramas protegidas objetivo, con medición suficiente.
- [ ] Medir interior real maletín Easy 16, ventilación y organización de antenas sin perforar exterior.

Documentos [22 — bitácora](docs/22-lilith-build-status-2026-10-17.md), [23 — presupuesto Pro](docs/23-lilith-power-budget-and-pending-parts.md), [24 — SMD](docs/24-lilith-smd-assembly.md).

---

## Confirmado

- [x] Dell Vostro 3405.
- [x] Ryzen 5 3450U.
- [x] 12 GB RAM.
- [x] SSD 256 GB.
- [x] Caja objetivo Robust MJ-5018 / Easy 16".
- [x] ESP32-S3 como supervisor.
- [x] ESP32 CYD independiente.
- [x] Arduino LAB.
- [x] LoRa / SDR / GNSS / NFC considerados.
- [x] Arquitectura Smart Module Manager.
- [x] Supervisor con hard-off físico.
- [x] MASTER AUX separado.

## V0.1 arquitectura congelada

- [x] definir flujo 12 V -> fusible -> SW0 -> XL4015 -> 5V_BUS.
- [x] definir SW1 y +5V_SUP medido por INA3221 CH3.
- [x] definir dos ramas TPS2553 + INA3221 CH1/CH2.
- [x] definir RILIM 20 kΩ + 6.8 kΩ y EN/FAULT.
- [x] definir GPIO V0.1 del ESP32.
- [x] definir bus I²C y TCA9548A para dos EEPROM 24C02.
- [x] definir aislamiento CP2102 <-> ADuM1201 <-> ESP32.
- [x] definir GND_DELL separado de GND_AUX.
- [x] definir colores/calibres de cable y test points.
- [x] documentar manual pin-a-pin y checklist VERIFY-ON-ARRIVAL.
- [ ] verificar físicamente pinout/serigrafía de breakouts al llegar.
- [ ] medir RSHUNT real del INA3221 al llegar.
- [ ] verificar pin 3V3/TX/RX/GND del CP2102 al llegar.
- [ ] verificar orden de pines/dirección/pull-ups del OLED al llegar.

## Medición física

- [ ] medir interior real caja.
- [ ] identificar Arduino.
- [ ] abrir/fotografiar Dell.
- [ ] salud batería.
- [ ] modelo LCD.
- [ ] temperaturas.
- [ ] comportamiento USB Dell apagado/suspendido/encendido.

## Power v3

- [ ] elegir SW0 MASTER AUX.
- [ ] elegir SW1 SUPERVISOR ENABLE.
- [ ] elegir eFuse entrada.
- [ ] elegir load switch/eFuse por canal.
- [ ] diseñar EN pull-down.
- [ ] elegir current monitor multicanal.
- [ ] probar 5V_SUP=0 con SW1 OFF.
- [ ] verificar ausencia de phantom power desde Dell.
- [ ] elegir batería/fuente AUX.

## Host isolation

- [ ] elegir USB-UART lado Dell.
- [ ] elegir aislador UART.
- [ ] prototipar heartbeat aislado.
- [ ] prototipar PC_PWR_SENSE alta impedancia.
- [ ] probar OFF / BOOT / ONLINE / HOST_LOST.

## Smart Backplane

- [ ] definir número de slots.
- [ ] definir conector Smart Module Port.
- [ ] TCA9548A.
- [ ] EEPROM ID por carrier.
- [ ] formato descriptor.
- [ ] carrier LoRa.
- [ ] carrier GNSS.
- [ ] carrier NFC.
- [ ] slot AUX futuro.
- [ ] PGOOD/FAULT por canal.
- [ ] current sense por canal/grupo.
- [ ] PCB v0 en perfboard.
- [ ] PCB v1 KiCad.

## Module Manager firmware

- [ ] enum ABSENT/PRESENT_OFF/STARTING/POWERED/ONLINE/ACTIVE/FAULT/DISABLED.
- [ ] boot inventory.
- [ ] rescan.
- [ ] power sequence.
- [ ] startup timeout.
- [ ] overcurrent fault.
- [ ] retry policy.
- [ ] host-assisted USB health.
- [ ] module event log.
- [ ] profiles.
- [ ] watchdog.
- [ ] safe defaults after reset.

## Hardware principal

- [ ] ESP32-S3.
- [ ] OLED.
- [ ] CYD.
- [ ] microSD extension.
- [ ] RTC.
- [ ] BME280.
- [ ] INA monitors.
- [ ] switches/buttons/encoder.
- [ ] fans PWM/tach.

## Redes/RF

- [ ] UE306.
- [ ] Wi-Fi USB Linux-friendly.
- [ ] RP-SMA.
- [ ] RTL-SDR.
- [ ] LoRa + banda/antena.
- [ ] GNSS.
- [ ] PN532.
- [ ] radio FM/Bluetooth opcional.
- [ ] comprobar ruido RF con DC/DC encendidos.

## Laboratorio

- [ ] Arduino terminal panel.
- [ ] level shifting.
- [ ] USB-UART.
- [ ] logic analyzer.
- [ ] FNIRSI.
- [ ] GM328A.
- [ ] PSU CC/CV.
- [ ] V/A meter.
- [ ] bananas + OUTPUT switch.

## Host daemon

- [ ] systemd service.
- [ ] serial protocol.
- [ ] heartbeat.
- [ ] USB device health.
- [ ] CPU/RAM/temp/battery.
- [ ] network states.
- [ ] CLI module on/off/rescan.
- [ ] dashboard.
- [ ] event/fault logs.

## Mecánica

- [x] definir material de prototipado: PVC espumado/Sintra/Trovicel.
- [x] definir 3 mm para paneles/pruebas y 5 mm para bandeja estructural V0.1.
- [x] reservar impresión 3D para layout congelado.
- [x] prohibir perforaciones en la carcasa exterior del maletín.
- [ ] medir dimensiones interiores reales y obstáculos.
- [ ] cardboard mockup / plantillas 1:1.
- [ ] validar layout físico completo antes de cortar PVC.
- [ ] technical tray PVC 5 mm.
- [ ] instalar standoffs M2.5/M3 y separar PCB 5–10 mm del PVC.
- [ ] smart backplane position.
- [ ] RF/power separation.
- [ ] supervisor switch accessible.
- [ ] master AUX switch protected against accidental toggle.
- [ ] service access.
- [ ] labels.
- [ ] final panel only after real components.

## AUX source transfer / Dell UPS

- [ ] verificar USB PowerShare y el Charging port del Vostro 3405.
- [ ] medir tensión/corriente/potencia disponible desde batería Dell.
- [ ] medir comportamiento Dell ON / suspendido / OFF.
- [ ] definir potencia máxima requerida del dominio AUX completo.
- [ ] decidir tensión del BUS AUX normalizado.
- [ ] seleccionar arquitectura de normalización buck/boost.
- [ ] seleccionar selector/power MUX dimensionado a la corriente real.
- [ ] implementar reverse-current blocking.
- [ ] implementar interbloqueo hardware: jamás LiFePO4 path + Dell path simultáneos.
- [ ] implementar secuencia break-before-make.
- [ ] decidir control físico EMERGENCY NOTEBOOK -> AUX o selector LiFePO4/OFF/NOTEBOOK.
- [ ] impedir cualquier ruta AUX -> DC-IN Dell.
- [ ] validar que los mismos switches controlan módulos con cualquiera de las dos fuentes.
- [ ] ensayar sobrecarga del modo Dell y comprobar corte seguro.
- [ ] comprobar térmicamente convertidores y selector.
