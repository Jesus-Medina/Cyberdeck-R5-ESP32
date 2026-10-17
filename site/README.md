# Lilith Explorer 3.4 — catálogo de módulos por pisos

> **v3.6 / criterio eléctrico:** [matriz de 12 interruptores y arneses RF](../docs/26-lilith-switch-matrix-and-antenna-routing.md). Solo dos interruptores (SW0/SW1) están definidos en la netlist V0.1; diez funciones son propuestas sin cablear (dos requieren cambiar la netlist y ocho necesitan nuevo hardware). Antenas RF: módulo interior + coaxial 50 Ω + bulkhead sobre subpanel interno de la tapa, no pantalla ni carcasa perforada. El render estético anterior no es canónico; no garantiza pérdidas nulas ni 24 V/5 A/12 canales protegidos.


> **Diseño operativo actual, 17-10-2026:** se añade una **quinta zona de visualización: tapa/pantalla**. Tapa y panel son las únicas superficies de operación; electrónica, energía y placa Dell desnuda con cooler son internas y no necesitan abrirse durante el uso normal. Los 12 interruptores tienen una zona reservada de 216×78 mm (6×2, paso orientativo 36 mm), sin validar espacio neto ni profundidad. Wi-Fi/LoRa/SDR se conectan a antenas despejadas en tapa/panel abierto con coax apropiado. Se incluye plano ilustrativo en mm para panel 371×258 y tapa con LCD activo aprox. 309×174; no es plan de corte. Véase [especificación actual](../docs/25-lilith-panel-lid-interface.md).


## Estado de este visor

Actualización de interfaz orientada primero al **celular**, 17-10-2026. Sitio estático HTML/CSS/Canvas, sin dependencias de JavaScript externas.

- Vista adaptativa real, sin lienzos HTML de 980×650 recortados. La geometría espacial se proyecta con cámara y perspectiva en un **Canvas responsivo**, en vez de apilar capas rotadas con CSS.
- Giro con un dedo o ratón, zoom con gesto de pellizcar/dedos, rueda o botones; reinicio de cámara.
- **Cinco zonas de visualización**: tapa/pantalla, panel operativo y tres pisos internos (electrónica, energía, placa Dell). Las reservas del panel se ajustan a milímetros aproximados, no a un CAD de corte.
- Placas ilustradas con volumen (PCB, cobre, chips, puertos, tapas, resistencias y bobina según tipo); selección clic/tap mediante áreas proyectadas y fichas de conexiones.
- Modo banco 3,3 V con ESP32, INA3221, OLED y tres resistencias 100Ω + líneas **ya comprobadas**.
- Modo cableado futuro V0.1 con 12V → fusible → SW0 → XL4015 → TPS2553/SW1/INA; **trazos discontinuos: no montados**. Filtros por energía/I²C/GND.
- Controles de móvil compactados, inventario plegable, inspector debajo del visor y botón para llegar a su ficha.


## Inventario visual ampliado (17-10-2026)

El visor tiene **64 fichas en cinco zonas** (tapa/pantalla, panel, electrónica, energía y base Dell), y accesos separados al adaptador externo y a las cargas de banco. Algunas fichas describen funciones o reservas futuras y no son dispositivos físicos adicionales instalados. SW0 y SW1 son funciones de dos de los doce interruptores, no dispositivos adicionales.

- Panel operativo: doce interruptores, teclado Bluetooth externo al Dell, CYD, OLED, encoder, indicador V/A/W, GPIO y puertos. FNIRSI/GM328A figuran en el inventario pero su cabida simultánea no está comprobada.
- Electrónica: ESP32-S3, INA3221, Arduino, LoRa, RTL-SDR, Wi-Fi LAB, UE306, GNSS, PN532, CP2102, ADuM1201, TCA9548A, EEPROM, analizador lógico, RTC y BME280.
- Energía interna: XL4015, TPS2553, reserva, fusibles, backplane, Smart Module Ports, LiFePO4 futura, fuente LAB, selector AUX, rails y USB-C PD.
- Tapa operativa: pantalla Dell 14 pulgadas, antenas RF con soporte desplegable interno y espacio posible para LEDs/IR/GNSS; falta medir bisel y bisagra. La placa Dell desnuda con sistema de disipación está en base.

La bandeja interna se ilustra como catálogo/rejilla **para encontrar módulos**, no según su posición física definitiva. En el panel solo se dibujan las reservas cuya geometría provisional está explícita; otras fichas de instrumentación siguen sin huella mecánica aprobada. La palabra registrado/comprado no demuestra recepción física, montaje o prueba. El usuario puede buscar, filtrar y pulsar un componente para ir a su piso.

## Límites de fidelidad

El visor contiene **ilustraciones técnicas** de placas, no fotografías originales, escaneos 3D, CAD 1:1 ni posiciones físicas medidas. Hay componentes reales presentes, comprados aún por verificar, y piezas de la V1 Pro **planificadas y no adquiridas**.

No se ha integrado la Mean Well con XL4015, fusible, SW0/SW1 ni TPS2553. No se ha conectado el backup USB Dell ni batería LiFePO4. Los valores mostrados en tarjetas son históricos: 3,17 V multímetro y ~32,8/32,4/32,4 mA de las tres resistencias a 3,3 V. No hay control de hardware ni telemetría en tiempo real.

**Fuentes documentales:** [bitácora real](../docs/22-lilith-build-status-2026-10-17.md), [netlist](../docs/20-v0.1-wiring-netlist.md), [arquitectura de respaldo](../docs/21-portable-power-architecture.md), [plan SMD](../docs/24-lilith-smd-assembly.md).

## Deploy

GitHub Actions `.github/workflows/lilith-pages.yml` publica únicamente `site/` en la misma URL:

https://jesus-medina.github.io/Cyberdeck-R5-ESP32/

Archivos: `site/index.html`, `site/styles.css` y `site/app.js`.
