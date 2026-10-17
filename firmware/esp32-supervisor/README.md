# Firmware Lilith — estado real (17-10-2026)

**Aviso:** `src/main.cpp` es una **demo histórica provisional** de lectura de switches y comunicación serie. **NO** corresponde al sketch cargado actualmente en Lilith. Contiene GPIO19 como entrada de switch, pin reservado para USB nativo en ESP32-S3; **no cargarlo sobre el montaje de banco actual** sin revisar pinout.

El programa probado **localmente** en el ESP32-S3 (Arduino IDE: ESP32S3 Dev Module) usa Wire GPIO8/SDA y GPIO9/SCL, OLED SH1106/U8g2 a 0x3C e INA3221 a 0x40 tras puente A0-GND; registra CH1, CH2, CH3 y muestra datos por OLED y serial. Ver [bitácora y conexiones](../../docs/22-lilith-build-status-2026-10-17.md).

**Pendiente:** subir el archivo `.ino` exacto del usuario para que GitHub refleje el firmware probado. No reconstruirlo sin corroborarlo ni afirmar que `main.cpp` ya está verificado. En versión definitiva faltan EN/FAULT, estados seguros y control de energía de los TPS2553.
