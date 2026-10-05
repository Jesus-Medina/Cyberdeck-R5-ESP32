# TODO — v3 Smart Modular

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

- [ ] cardboard mockup.
- [ ] technical tray.
- [ ] smart backplane position.
- [ ] RF/power separation.
- [ ] supervisor switch accessible.
- [ ] master AUX switch protected against accidental toggle.
- [ ] service access.
- [ ] labels.
- [ ] final panel only after real components.
