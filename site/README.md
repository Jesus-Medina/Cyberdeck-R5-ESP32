# Lilith Explorer 3.3 — catálogo de módulos por pisos

## Estado de este visor

Actualización de interfaz orientada primero al **celular**, 17-10-2026. Sitio estático HTML/CSS/Canvas, sin dependencias de JavaScript externas.

- Vista adaptativa real, sin lienzos HTML de 980×650 recortados. La geometría espacial se proyecta con cámara y perspectiva en un **Canvas responsivo**, en vez de apilar capas rotadas con CSS.
- Giro con un dedo o ratón, zoom con gesto de pellizcar/dedos, rueda o botones; reinicio de cámara.
- Cuatro estratos visibles en vista explotada o ensamblada: base Dell, energía, electrónica y panel superior; selección aislada por nivel.
- Placas ilustradas con volumen (PCB, cobre, chips, puertos, tapas, resistencias y bobina según tipo); selección clic/tap mediante áreas proyectadas y fichas de conexiones.
- Modo banco 3,3 V con ESP32, INA3221, OLED y tres resistencias 100Ω + líneas **ya comprobadas**.
- Modo cableado futuro V0.1 con 12V → fusible → SW0 → XL4015 → TPS2553/SW1/INA; **trazos discontinuos: no montados**. Filtros por energía/I²C/GND.
- Controles de móvil compactados, inventario plegable, inspector debajo del visor y botón para llegar a su ficha.


## Inventario visual ampliado (17-10-2026)

El visor muestra **58 fichas distribuidas en cuatro niveles ilustrativos** (panel, electrónica/RF/redes, energía y base Dell), y accesos separados al adaptador externo y a las cargas de banco. SW0 y SW1 son funciones de dos de los doce interruptores, no dispositivos adicionales.

- Panel: FNIRSI, GM328A, CYD, OLED, interruptores, encoder, display V/A/W, antenas, IR, GPIO y puertos de servicio.
- Electrónica: ESP32-S3, INA3221, Arduino, LoRa, RTL-SDR, Wi-Fi LAB, UE306, GNSS, PN532, CP2102, ADuM1201, TCA9548A, EEPROM, analizador lógico, RTC y BME280.
- Energía: XL4015, TPS2553, reserva, fusibles, backplane, Smart Module Ports, LiFePO4 futura, fuente LAB, selector AUX, rails y USB-C PD.

Los módulos están distribuidos en una rejilla **para encontrarlos e inspeccionarlos**, no según su posición física definitiva. La palabra registrado/comprado no demuestra recepción física, montaje o prueba. El usuario puede buscar, filtrar y pulsar un componente para ir a su piso.

## Límites de fidelidad

El visor contiene **ilustraciones técnicas** de placas, no fotografías originales, escaneos 3D, CAD 1:1 ni posiciones físicas medidas. Hay componentes reales presentes, comprados aún por verificar, y piezas de la V1 Pro **planificadas y no adquiridas**.

No se ha integrado la Mean Well con XL4015, fusible, SW0/SW1 ni TPS2553. No se ha conectado el backup USB Dell ni batería LiFePO4. Los valores mostrados en tarjetas son históricos: 3,17 V multímetro y ~32,8/32,4/32,4 mA de las tres resistencias a 3,3 V. No hay control de hardware ni telemetría en tiempo real.

**Fuentes documentales:** [bitácora real](../docs/22-lilith-build-status-2026-10-17.md), [netlist](../docs/20-v0.1-wiring-netlist.md), [arquitectura de respaldo](../docs/21-portable-power-architecture.md), [plan SMD](../docs/24-lilith-smd-assembly.md).

## Deploy

GitHub Actions `.github/workflows/lilith-pages.yml` publica únicamente `site/` en la misma URL:

https://jesus-medina.github.io/Cyberdeck-R5-ESP32/

Archivos: `site/index.html`, `site/styles.css` y `site/app.js`.
