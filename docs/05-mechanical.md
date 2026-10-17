# 05 — Diseño mecánico

> **ACTUALIZACIÓN VIGENTE 2026-10-17:** Lilith funciona desde el **panel superior y la tapa alrededor del LCD**; ninguno de los pisos inferiores debe abrirse para utilizar funciones habituales. En la base va solo **placa madre Dell + disipador/ventilador**, nunca teclado, touchpad ni carcasa inferior del notebook. El teclado plegable Bluetooth es periférico independiente en el panel. Las antenas RF se posicionarán despejadas y accesibles al abrir el maletín; módulo interior + coaxial apropiado hacia tapa/panel, sin perforar la carcasa. Reservar **216×78 mm** en dos filas de seis interruptores como hipótesis (36 mm de paso); **no es medida aprobada**. Ver [documento 25](25-lilith-panel-lid-interface.md). Las representaciones antiguas de Dell completo o panel sin LCD quedan sustituidas por esta actualización.


## Caja

Objetivo actual:

- Robust MJ-5018 / Easy 16";
- dimensiones exteriores confirmadas de referencia: **406 × 330 × 174 mm**;
- interior de referencia previo: aprox. 372 × 260 × 155 mm, **pendiente de medición física**;
- Dell completo aprox. 330 × 240 mm.

> **Regla de diseño:** las dimensiones exteriores NO se usan para cortar la bandeja interna. La bandeja se dimensiona sólo después de medir el interior real con espuma, nervaduras, bisagras y holguras incluidas.

> **Regla de estanqueidad:** no perforar la carcasa exterior del maletín. Antenas, switches, conectores, ventilación auxiliar y paneles deben resolverse dentro del volumen protegido o mediante elementos internos que no atraviesen la carcasa.

El Dell ocupa gran parte del área útil, por lo que el diseño se resuelve **en capas**.

## Estrategia recomendada

No desnudar la motherboard desde el primer día y no fabricar todavía piezas 3D definitivas.

Primera integración:

1. conservar el conjunto inferior Dell funcional;
2. separar el display assembly sólo si hace falta montarlo en la tapa;
3. mantener motherboard, cooler, batería, teclado y touchpad en su estructura original mientras sea posible;
4. construir primero una maqueta de distribución;
5. colocar módulos auxiliares sobre una bandeja técnica removible;
6. montar instrumentación y controles en un panel superior independiente;
7. pasar a ABS, aluminio o impresión 3D sólo cuando las posiciones y medidas reales estén congeladas.

## Material de prototipado V0.1

### Baseline

Para la V0.1 se adopta **PVC espumado (Sintra/Trovicel)** como material principal de prototipado mecánico.

| Material | Uso previsto | Estado |
|---|---|---|
| Cartón / cartón pluma | Plantillas y Tetris inicial | Recomendado antes de cortar |
| PVC espumado 3 mm | Paneles, divisiones y pruebas | Baseline V0.1 |
| PVC espumado 5 mm | Bandeja estructural principal | Baseline V0.1 |
| ABS 2–3 mm | Panel/bandeja más definitiva | Posterior a validación |
| Policarbonato 2–3 mm | Zonas que requieran alta resistencia | Opcional |
| Acrílico | Ventanas o terminaciones estéticas | No estructural |
| Impresión 3D | Brackets, bezels y soportes a medida | Sólo con geometría congelada |

### Por qué PVC espumado

- barato comparado con piezas mecanizadas;
- liviano;
- suficientemente rígido para una bandeja de prototipo;
- fácil de cortar, perforar y volver a trabajar;
- permite mover componentes varias veces sin rehacer un diseño CAD completo;
- adecuado para standoffs, bridas y fijaciones desmontables;
- no absorbe humedad como MDF o cartón.

La combinación recomendada es:

- **5 mm:** base estructural;
- **3 mm:** paneles, separadores, tapas y piezas experimentales.

## Protocolo dimensional

No existe todavía una medida final de bandeja.

Procedimiento:

1. medir ancho, largo y profundidad **interiores** reales;
2. medir obstáculos: espuma, esquinas, bisagras, asa, nervaduras y radios;
3. crear plantilla de cartón;
4. colocar físicamente Dell, power, RF, USB, ESP32, instrumentos, switches y cableado;
5. reservar zonas de mantenimiento y radios de curvatura;
6. transferir la plantilla validada al PVC;
7. perforar el PVC sólo cuando la posición de cada módulo esté confirmada.

La bandeja debe dejar holgura perimetral para entrar y salir sin forzar la caja.

## Capas

~~~text
TAPA
┌────────────────────────────────────┐
│ LCD Dell 14"                       │
│ indicadores / audio opcional       │
└────────────────────────────────────┘

SUPERFICIE / PANEL REMOVIBLE
┌────────────────────────────────────┐
│ FNIRSI | GM328A | CYD | GPIO       │
│ OLED | controles | switches        │
│ teclado Bluetooth/trackpad o Dell  │
└────────────────────────────────────┘

BANDEJA TÉCNICA — PVC ESPUMADO 5 mm
┌────────────────────────────────────┐
│ ESP32-S3 | HUB | Arduino | UE306   │
│ Smart Power | logic | UART         │
│ Wi-Fi LAB | RTL-SDR | LoRa | GNSS │
└────────────────────────────────────┘

NIVEL INFERIOR / CABLEADO
┌────────────────────────────────────┐
│ distribución de potencia           │
│ arneses / fusibles / DC-DC         │
│ puntos de prueba / canalización    │
└────────────────────────────────────┘
~~~

La arquitectura puede utilizar dos niveles removibles si la altura real lo permite. El objetivo es poder retirar la electrónica superior para acceder a potencia y cableado sin desarmar todo el cyberdeck.

## Distribución por zonas

### Zona RF

- RTL-SDR;
- Wi‑Fi USB;
- LoRa;
- GNSS;
- coaxiales y antenas internas/plegables.

Ubicar lejos de:

- buck/boost;
- convertidores USB-C PD;
- amplificadores;
- cableado de potencia;
- motores/ventiladores ruidosos eléctricamente.

### Zona power

- fusibles;
- TPS2553 / protección por canal;
- INA3221;
- DC/DC;
- entrada AUX;
- distribución;
- fuente variable.

### Zona control

- ESP32-S3;
- backplane;
- RTC;
- sensores;
- TCA9548A;
- EEPROM;
- conectores.

### Zona lab

- Arduino;
- USB-UART;
- logic analyzer;
- bornes GPIO.

## Fijación de PCB y módulos

Las PCB **no se apoyan directamente sobre el PVC**.

Baseline de montaje:

~~~text
PCB
 │
tornillo M2.5/M3
 │
separador 5–10 mm
 │
PVC espumado 5 mm
~~~

Preferir:

- separadores M2.5/M3 de nylon o latón;
- tornillos, tuercas y golillas;
- bases adhesivas para bridas;
- bridas reutilizables;
- 3M Dual Lock / velcro industrial para módulos removibles;
- espuma fina antivibración sólo donde corresponda;
- brackets atornillados.

Evitar:

- silicona caliente como fijación estructural;
- PCB suspendidas por cables;
- PCB apoyadas directamente sobre plástico;
- conectores sometidos a esfuerzo mecánico;
- cables RF doblados agresivamente.

## Seguridad térmica y eléctrica

El PVC espumado sirve como estructura de prototipo, pero no debe actuar como disipador ni quedar pegado a componentes calientes.

Para power:

- mantener convertidores y componentes calientes elevados con separadores;
- conservar ventilación alrededor de inductores, MOSFET y reguladores;
- usar FR-4, placa metálica o soporte dedicado si una zona necesita gestionar calor;
- mantener fusibles y puntos de prueba accesibles;
- separar físicamente potencia de RF y señales sensibles;
- verificar temperatura bajo carga antes de cerrar.

No cortar ni perforar PVC quemándolo con cautín. Usar cutter, broca, mini sierra o herramienta rotativa y trabajar con ventilación adecuada.

## Panel de comunicaciones

Mientras se mantenga la regla de no perforar la caja, este panel se considera **panel interno de servicio**:

~~~text
[DC] [AUX] [USB3] [USB-C]
[LAN1] [LAN2] [HDMI] [AUDIO]
[WIFI] [SDR] [LORA] [GNSS]
[GPIO/I2C/SPI/UART] [+ LAB -]
~~~

Los conectores y antenas se acomodarán dentro del maletín y deben quedar protegidos al cerrarlo.

## Acceso de mantenimiento

La bandeja superior debe poder levantarse sin desconectar todo.

Cada arnés debe llevar etiqueta:

- PWR-01;
- USB-01;
- RF-SDR;
- RF-LORA;
- FAN-01;
- I2C-01;
- GPIO-LAB.

Debe existir holgura de cable suficiente para abrir cada nivel como una bandeja de servicio.

## Fases mecánicas

### V0.1-A — maqueta

- cartón/cartón pluma;
- componentes o plantillas 1:1;
- probar distribución;
- comprobar cierre;
- comprobar recorrido de cables y antenas.

### V0.1-B — prototipo PVC 3 mm

- paneles provisionales;
- divisiones;
- prueba de posiciones;
- iteración barata.

### V0.1-C — bandeja PVC 5 mm

- base estructural;
- standoffs;
- cableado real;
- montaje removible;
- validación térmica y de servicio.

### V0.2 / V1.0 — piezas definitivas

Sólo cuando el layout esté congelado:

- brackets impresos en 3D;
- bezels de displays;
- soportes de antenas;
- canaletas;
- paneles ABS/aluminio;
- piezas específicas de cada módulo.

## Ventilación

Mantener libres las entradas y salidas originales del Dell.

Como la carcasa exterior **no se perforará**, la estrategia térmica debe validarse con el equipo abierto/cerrado y resolverse primero mediante:

- flujo interno;
- separación entre niveles;
- ventiladores internos si son necesarios;
- conducción del aire sin modificar el sellado exterior.

Si la temperatura cerrada resulta inaceptable, se deberá replantear la arquitectura antes de comprometer la estanqueidad del maletín.
