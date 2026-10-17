# 25 — Lilith: interfaz operativa, tapa/pantalla y distribución física preliminar
Fecha: 2026-10-17. Prevalece sobre esquemas anteriores donde el Dell aparecía como notebook completo o las antenas/puertos requerían abrir pisos.

> **Cierre lógico complementario:** los 12 interruptores son seis SPST + seis basculantes, pero solo SW0/SW1 tienen cableado V0.1 definido. La matriz completa con bloqueantes está en [26 — interruptores y cableado RF de tapa](26-lilith-switch-matrix-and-antenna-routing.md). La ubicación RF no es una promesa de 100% de señal ni una instrucción para soldar al LCD. No cortar material según renders.

## Reglas NO negociables
1. **Operación normal desde arriba:** al abrir el maletín, el panel principal y los marcos/espacios alrededor de la pantalla en la tapa son las dos superficies de operación. Toda conexión, interruptor, ajuste, entrada/salida, instrumento y acceso previsto de antena debe poder utilizarse sin levantar una bandeja interna.
2. **Pisos inferiores = infraestructura de servicio:** placa madre Dell, disipación, electrónica AUX, convertidores, protección, cables, buses, módulos RF con antenas remotas. Levantar pisos sólo para instalación, mantenimiento y reparación. La necesidad ocasional de programar por USB también requiere puerto de servicio accesible arriba.
3. **Dell = placa madre y disipación**, sin teclado, touchpad ni palmrest del Dell. El teclado Bluetooth plegable con Ñ y trackpad es un periférico separado, accesible en el panel; no dibujar teclas sobre la motherboard.
4. **No perforar la carcasa impermeable**. Puertos y antenas quedan dentro del volumen protegido al cerrar; se operan con el maletín ABIERTO. Las antenas pueden levantarse/plegarse dentro de su zona despejada, nunca atravesar la tapa externa.
5. **No fingir un montaje validado**. Diferenciar presente/probado, registrado por comprar/recibir, planificado. Dibujo conceptual ≠ CAD mecánico 1:1. No asignar dimensiones inventadas a PCB Dell desnuda ni a instrumentos sin SKU congelado.
6. **Separación de RF y ruido**: módulo Wi-Fi/LoRa/RTL-SDR en bandeja técnica según cableado; llevar antenas por coax apropiado a la tapa o borde operativo, apartadas de metal, plano de masa, USB3, DC/DC, batería y LCD. Conectores SMA/RP-SMA no se intercambian; LoRa solo transmite con antena correcta. GNSS idealmente con vista del cielo en posición abierta. No prometer señal en maletín cerrado ni atribuir protección RF al plástico sin ensayos.
7. **No confundir accesos con módulos**: la ficha de una placa interna debe indicar su controlador/indicador/puerto accesible en el panel/tapa. El 3D puede mostrar ambos, pero eso no duplica piezas compradas.

## Envolvente y cálculo dimensional (NO equivale a espacio neto garantizado)
- Maletín exterior 406 × 330 × 174 mm, interior de referencia conservadora **371 × 258 × 152 mm**; medir la unidad descontando bisagras, nervios, paredes, radios, espuma, cierre y espesor de bandejas.
- Panel visible de referencia `371 × 258 mm` (máximo bruto, no corte validado).
- 6 interruptores de palanca SPST + 6 basculantes ON/OFF comprados. Para la **reserva** de dos filas de seis, asumir provisoriamente una celda de **36 mm** por interruptor (30 mm de envolvente aproximada informada + 6 mm para separación): ancho 6 × 36 = **216 mm**; altura de dos filas con separación y borde, reservar **78 mm**. Una única hilera de 12 ocuparía **432 mm** con ese paso, imposible en 371 mm brutos. La compatibilidad real depende de orientación, calado y holgura posterior de cada modelo; medir ancho, largo, rosca, vástago, profundidad y acceso del dedo.
- Reserva de panel sugerida (coordenadas en mm sobre 371 × 258, **solo para comprobar áreas**): interruptores x=12..228, y=10..88; OLED x=235..275, y=12..50; CYD provisional x=281..366, y=12..72, **modelo físico y hueco pendientes**; teclado BT provisional x=12..252, y=116..214, **medir desplegado**; pasillo de interfaces x=12..252, y=221..252; reserva instrumentos/conectores x=261..362, y=101..250. No atribuir que FNIRSI, GM328A y todas las demás piezas entren simultáneamente en esta última reserva: se deben seleccionar y medir físicamente; pueden sustituir elementos o trasladar indicadores a la tapa. Diseñar para cables, calor, fijación y recorrido de dedos.
- **Zona tapa/pantalla**: pantalla Dell 14" con zona activa aprox. 309.35 × 173.99 mm, de acuerdo con variante, dentro de una envolvente de referencia 371 × 258 mm. Si se centrase geométricamente, quedarían a lo sumo ~30.8 mm a cada lado y ~42 mm arriba/abajo, **sin descontar bisagras, bisel, placa del panel, cable eDP ni refuerzos**. Es una oportunidad para LED de estado, antenas plegables/interiores, pequeños indicadores o puertos estrechos; **no se afirma** que quepa un OLED 40x38 ni instrumentos grandes en los márgenes.
- Los corredores de cable y coax deben librar cierre y bisagra; reservar alivio de tensión, radio mínimo del coax y acceso a reparación. Confirmar que el LCD sea realmente desmontable, cable compatible y seguro con la motherboard antes de fijarlo en la tapa.

## Mapa de accesos operativos completo (visualización v3.5)

El panel 3D anterior mostraba solamente nueve reservas dimensionadas o de envolvente provisional, ocultando múltiples módulos registrados en el inventario. Se mantiene esa precaución mecánica, pero ahora se acompaña de un **mapa funcional explícito**: 22 puntos de operación en panel y 8 en tapa. **30 puntos NO significa 30 PCB físicas ni confirma 30 posiciones que caben simultáneamente.** Cada ficha se conecta con el módulo real/interior correspondiente.

**22 accesos planificados del panel** (puntos de control, medición o conexión, no 22 agujeros aprobados):

1. 12 interruptores en conjunto (6 palancas SPST + 6 basculantes).
2. OLED SH1106 del supervisor.
3. Pantalla táctil CYD.
4. Teclado Bluetooth con trackpad y Ñ, separado del Dell.
5. Osciloscopio FNIRSI y sondas.
6. Comprobador GM328A / LCR con zócalo ZIF.
7. Conectores GPIO, I²C y SPI.
8. USB-A / USB-C de servicio.
9. Red RJ45, HDMI y audio.
10. Salidas Smart Out 1/2 protegidas.
11. Fuente variable LAB con salida/bananas.
12. Display V/A/W.
13. Encoder de fuente LAB.
14. Analizador lógico, entradas en panel.
15. USB-UART de servicio.
16. IR RX/TX para dispositivos propios.
17. Zona lectora NFC/RFID.
18. LEDs y buzzer de estado.
19. Entrada DC y fusible de acceso seguro, según circuito final.
20. USB-C PD futuro.
21. Salida servo 5–6 V futura.
22. Salida de 3,3 V protegida futura.

**8 accesos/funciones de tapa**: LCD Dell, soportes de antenas, Wi-Fi LAB, LoRa, SDR, GNSS, indicadores y zona IR/sensores. **La tapa es un área muy limitada**, especialmente alrededor del LCD: estas son *alternativas/capacidades previstas*, no ocho módulos grandes que se afirme caben a la vez. Wi-Fi/LoRa/SDR se representan mediante antenas/coax accesibles, no por placas enterradas detrás de la pantalla.

Se conservan por separado los planos proporcionales de **reservas físicas (panel 371×258 mm bruto y pantalla activa 309×174 mm aprox.)**. FNIRSI/GM328A y otras piezas sin medidas reales pueden compartir la reserva como *alternativas de diseño*, no ocupaciones simultáneas. El usuario debe decidir distribución final con medidas reales y/o sustituir módulos por puertos de extensión, sin levantar pisos para utilizarlos.

## Mapa de acceso funcional previsto
| Módulo interior | Acceso operativo desde panel o marco de tapa (sin abrir pisos) |
|---|---|
| Dell motherboard/cooling | LCD en tapa, teclado BT externo en panel, botón de encendido/puertos Dell ext. con prolongadores aptos; monitorización térmica desde panel |
| ESP32-S3/INA3221 | OLED/LED/buzzer y SW1 del panel; puerto USB de servicio arriba; telemetría (cuando se implemente) |
| XL4015/TPS2553/Smart Ports | SW0 y controles de salida, indicadores de fallo, bornes 5 V protegidos accesibles arriba; ajuste interno del XL4015 sólo durante mantenimiento de V0.1, no uso rutinario |
| Fuente LAB buck-boost futura | encoder, pantalla V/A/W, OUTPUT, fusible de salida reemplazable seguro, bananas/bornes arriba |
| Arduino/analizador lógico/UART | headers GPIO/I²C/SPI/UART y USB/terminales arriba; protección 3V3/5V |
| LAN/USB/HDMI/audio | conectores de servicio en panel o franja libre de tapa; extensiones adecuadas para cada estándar; nada de compartir buses arbitrariamente |
| Wi-Fi LAB / LoRa / SDR | switches/estado y antenas por coax a zona RF despejada junto a pantalla o panel; conectores adecuados, accesibles abierto |
| GNSS/NFC/IR | antena/área de lectura o emisor/receptor accesible en panel/tapa, sin metal por encima; comprobar compatibilidad RF y mecánica |
| RTC/BME280/temp | lecturas y alarmas por pantalla, sin abrir pisos |
| LiFePO4/protección futura | indicadores/switches y entrada de carga diseñada arriba; la Mean Well de 12V no es cargador LiFePO4, Dell no la carga |

## Condiciones para aprobar un diseño de corte
Fotos cenitales con regla de placa Dell, LCD y teclado BT desplegado, medidas del interior y profundidad libre en tapa/panel, medidas reales de los doce interruptores, pantallas e instrumentos, conectores + radios de curvatura, perfiles de temperatura y ubicación de bisagra. Hasta entonces es **reserva de espacio aproximada**, no plantilla de perforación.

## Prioridad V0.1 y límites
La única supervisión probada: ESP32-S3 + OLED SH1106 + INA3221 + resistencias 100 ohm en banco 3V3. No están montados/validados en conjunto Mean Well → fusible → SW0 → XL4015 → TPS2553 → 5V, ni LiFePO4, fuente LAB, respaldo Dell o módulos RF. Mantener esa distinción en la web.
