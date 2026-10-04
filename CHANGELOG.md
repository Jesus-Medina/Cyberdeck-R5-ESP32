# Changelog

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
