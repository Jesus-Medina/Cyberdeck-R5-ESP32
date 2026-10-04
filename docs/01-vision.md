# 01 — Visión y alcance

## Concepto

El proyecto convierte un **Dell Vostro 3405** en un cyberdeck x86 modular, reutilizando el equipo real en vez de sustituirlo por una Raspberry Pi.

Hardware confirmado:

- Dell Vostro 3405;
- AMD Ryzen 5 3450U;
- 12 GB RAM;
- SSD 256 GB;
- pantalla de 14";
- batería/BMS y cargador Dell;
- teclado, touchpad, Wi‑Fi/Bluetooth, audio y refrigeración originales;
- tamaño aproximado del notebook completo: 33 × 24 cm.

Caja objetivo:

- Robust MJ-5018 / Easy 16";
- exterior aprox. 40,6 × 33 × 17,4 cm;
- interior de referencia aprox. 37,2 × 26 × 15,5 cm;
- verificar medidas reales antes de perforar.

## Qué queremos construir

No será solamente un notebook dentro de una maleta. Debe funcionar como:

- computador x86 portátil;
- estación de programación;
- terminal y laboratorio de redes;
- estación SDR;
- nodo LoRa;
- plataforma GNSS;
- plataforma NFC/RFID;
- laboratorio de microcontroladores;
- banco portátil de pruebas electrónicas;
- fuente DC regulable para prototipos;
- analizador lógico / UART / osciloscopio / tester de componentes;
- sistema modular ampliable.

## Arquitectura humana

### Ryzen = trabajo pesado

Linux/Windows, VMs, contenedores, SDR++, Wireshark, IDEs, toolchains, compilación, dashboards y procesamiento.

### ESP32-S3 = supervisor permanente

Switches, OLED, sensores, ventiladores, telemetría y control de alimentación de módulos.

### ESP32 CYD = herramienta táctil independiente

Pantalla secundaria táctil, microSD y firmware propio. No debe controlar funciones críticas del deck.

### Arduino = laboratorio

Se mantiene reprogramable y sus pines se sacan a bornes para prototipos.

## Filosofía de diseño

1. Modular: cada módulo se puede quitar sin desoldar medio cyberdeck.
2. Reparabilidad: tornillos M3, separadores, JST y extensiones de panel.
3. Dos dominios de energía: Dell y accesorios.
4. Nada crítico depende del CYD.
5. El SDR y RF se mantienen alejados de convertidores DC/DC.
6. El PC debe poder funcionar aunque todo el subsistema auxiliar esté apagado.
7. El supervisor puede mantenerse activo con el PC apagado usando energía auxiliar.
8. Cableado etiquetado y conectores polarizados.
9. La placa frontal definitiva se fabrica después del prototipo.
10. Añadir expansiones sólo si tienen función real, no por decoración.

## Diferencias respecto al cyberdeck de referencia

Se conservan buenas ideas:

- panel de instrumentación;
- ESP32 con pantalla;
- fuente variable;
- tester de componentes;
- osciloscopio;
- GPIO en bornes;
- SDR;
- switches;
- displays auxiliares.

Se mejora:

- no usar Raspberry Pi;
- no soldar USB/HDMI/microSD/RF si existen extensiones adecuadas;
- backplane de distribución;
- módulos desmontables;
- alimentación auxiliar protegida;
- ESP32 supervisor separado del CYD;
- Arduino dedicado al banco de pruebas;
- doble Ethernet;
- Wi‑Fi dedicado de laboratorio;
- LoRa, GNSS, NFC/RFID y analizador lógico.
