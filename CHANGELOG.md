# Registro de cambios de Lilith

## 2026-10-17 — Estado real del hardware y plan de avance

- Documentado prototipo ESP32-S3 + OLED SH1106 + INA3221 estable en 0x40 (A0→GND soldado).
- Tres resistencias independientes 100Ω medidas a ~3,17V y ~32,4–32,8mA por canal; registradas filas/pines reales de protoboard y el contraste con la netlist 5V aún pendiente.
- Aclarados SW0/ SW1 no instalados, 6 palancas + 6 basculantes comprados, y 2 salidas TPS2553 previstas para la V0.1.
- Detectada dificultad de soldadura SMD de chips SOT23-6 y SOP8: adaptadores sin integrar; añadido plan de herramientas, práctica y comprobación de puentes.
- Separados inventario V0.1 y elementos **NO** adquiridos/validados para V1 Pro: LiFePO4, power-path, respaldo Dell, DC-DC y rails extra.
- Registrada divergencia de firmware: `main.cpp` es una demo histórica, **no** la versión cargada y probada en Arduino.
- Creados documentos `docs/22`, `23` y `24` y README del firmware; revisados documentos de planificación, BOM y cableado.

> Las notas del 08-10 sobre rutas de emergencia Dell contienen etapas históricas contradictorias. La arquitectura vigente **sigue siendo un objetivo no instalado** y está en `docs/21-portable-power-architecture.md`.

---

## 2026-10-08 — Arquitectura portátil y carga única

- El respaldo Dell deja de ser un rail crítico limitado: pasa a ser una fuente alternativa del dominio AUX completo mediante selector interbloqueado, break-before-make y bloqueo de corriente inversa; los módulos siguen controlados por sus switches y la potencia queda limitada por la fuente Dell real.

- Se añade respaldo AUX de emergencia desde USB PowerShare del Dell mediante DC-DC aislado, power mux y `EMERGENCY_ARM`; sólo alimentará el rail crítico y no las cargas de potencia hasta validar mediciones.

- Se define LiFePO4 4S como arquitectura de batería principal objetivo (12,8 V nominal, ~10 Ah como objetivo inicial).
- El Dell conserva batería/BMS original y recibe energía por su entrada normal mediante DC-DC a especificar tras verificar su cargador.
- El ESP32 pasa a estar explícitamente alimentado por AUX 5 V desde la batería principal; USB Dell se reserva para comunicación aislada.
- El Mean Well GST60A12-P1J queda clasificado como fuente de banco V0.1, no como fuente primaria ni cargador LiFePO4.
- Se establece como objetivo de producción una sola entrada externa de carga mediante cargador LiFePO4 + power-path compatible.
- Se documenta la corrección: TPS2553 sólo en rail de 5 V (Vin 2,5–6,5 V), nunca directo al bus de batería/12 V.

# Changelog

## 0.1.5 — Estrategia mecánica de prototipado

- adoptado PVC espumado (Sintra/Trovicel) como baseline mecánica V0.1;
- definido 3 mm para paneles/pruebas y 5 mm para bandeja estructural;
- añadidas fases cartón -> PVC 3 mm -> PVC 5 mm -> piezas definitivas;
- impresión 3D postergada hasta congelar layout y medidas reales;
- añadidos standoffs M2.5/M3 y separación de PCB de 5–10 mm;
- añadidas reglas térmicas para power sobre PVC;
- corregido el protocolo dimensional: no inferir bandeja desde las medidas exteriores;
- fijada regla de no perforar la carcasa exterior para conservar el sellado;
- panel de comunicaciones redefinido como panel interno de servicio.

## 0.1.4 — Arquitectura V0.1 pin-a-pin

- documentada arquitectura completa de power, supervisor, medición e aislamiento;
- congelada asignación GPIO del ESP32 para V0.1;
- añadido netlist con colores de cable, conectores y puntos de prueba;
- documentado pinout/conexión de TPS2553, ADuM1201 y 24C02;
- reincorporado TCA9548A a la baseline de dos slots para evitar conflicto entre EEPROM 24C02;
- separado explícitamente GND_DELL de GND_AUX;
- añadido checklist VERIFY-ON-ARRIVAL para breakouts genéricos.


## 0.1.3 — Wireless display control

- corregida arquitectura: control de TV/signage sin tocar físicamente el equipo;
- prioridad a LAN/Wi-Fi, Cast/DLNA/AirPlay/API/vendor control según el dispositivo;
- IR pasa a fallback remoto sin contacto;
- HDMI switch deja de ser la solución principal.


## 0.1.2 — Display Control / IR Lab

- añadido módulo IR 38 kHz + emisor 940 nm;
- añadida arquitectura HDMI switch para sustituir contenido en TV/signage propio;
- contemplada capturadora HDMI opcional;
- añadido CC1101 opcional para laboratorio sub-GHz autorizado;
- documentado uso del kit existente 2N2222/2N3904 como driver IR.


## 0.1.1 — BOM V0.1 cerrada

- reconciliadas compras reales de Smart Power + Supervisor;
- V0.1 usa 1 INA3221 y 2 TPS2553 activos (5 comprados);
- TCA9548A pasa a expansión y deja de ser requisito de V0.1;
- corregidos adaptadores SOT23 0.95 mm y SOIC8/SOP8;
- RILIM resuelto con 20 kΩ + 6.8 kΩ = 26.8 kΩ;
- confirmados 100 nF, 10 µF y 470 µF en el kit comprado;
- añadido procedimiento de bring-up y validación de ICs AliExpress;
- documentado aislamiento ADuM1201 sin unión de masas.

## 0.1.0 — Diseño inicial

- arquitectura Ryzen + ESP32;
- plan eléctrico preliminar;
- BOM por fases;
- distribución mecánica conceptual;
- protocolo serial MVP;
- firmware ESP32 mínimo;
- bridge de telemetría host mínimo.
