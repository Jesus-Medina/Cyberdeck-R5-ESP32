# 13 — Dell Vostro 3405: integración, riesgos y mitigaciones

## Resumen

El Dell Vostro 3405 es una buena plataforma donante porque Dell documenta como módulos separados la system board, I/O board, power-button module, DC-in jack, WLAN, batería, display assembly, touchpad, speakers, fan y heatsink.

Sin embargo, varios enlaces internos usan FFC/FPC y arneses propietarios o de longitud específica. El diseño mecánico debe adaptarse al hardware Dell, no al revés.

## Política de integración

### Conservar siempre

- motherboard;
- heatsink;
- fan original;
- batería/BMS;
- DC-in jack y cargador Dell;
- power-button module;
- display cable original mientras sea posible;
- WLAN y/o sus antenas hasta decidir reemplazo;
- daughterboards necesarias.

### No modificar antes de medir

- cable eDP/display;
- FFC de teclado;
- FFC de touchpad;
- FFC de I/O board;
- FFC power button;
- battery cable;
- DC-in cable;
- fan cable.

## Riesgo 1 — cable de pantalla demasiado corto

El cable de pantalla está diseñado para la geometría original del Vostro.

Plan A:
- ubicar motherboard y LCD para que el cable original alcance;
- conservar margen de flexión;
- no tensionar el conector.

Plan B:
- identificar el DP/N exacto del arnés original y buscar una variante OEM compatible/longer sólo si existe.

Plan C:
- identificar el modelo exacto del panel mediante EDID/etiqueta;
- usar una controladora HDMI/DP -> eDP específicamente compatible con ese panel;
- alimentar la pantalla como módulo independiente.

Evitar:
- empalmar eDP a mano;
- usar una extensión FFC genérica sin verificar pinout;
- alargar pares diferenciales sin controlar impedancia;
- doblar el cable en radios cerrados.

## Riesgo 2 — eliminar todo el plástico original

Es posible retirar la motherboard del palmrest, pero el palmrest original hace trabajo mecánico y de routing.

Problemas:
- la placa queda expuesta a ESD y cortos;
- conectores reciben fuerza mecánica;
- fan/radiator pueden perder ducto;
- cables FFC quedan sin guía;
- batería pierde soporte;
- antenas Wi-Fi pierden posición;
- el equipo puede flexar durante transporte.

Mitigación:
- crear subchasis rígido;
- standoffs M2/M3;
- base aislante FR4/ABS;
- brackets para puertos;
- strain relief para FFC;
- ducto de aire al radiador;
- guardas sobre RAM/SSD;
- espuma no conductora sólo donde no retenga calor.

## Riesgo 3 — peor refrigeración aunque la placa esté "al aire"

Más aire libre no garantiza mejor temperatura.

Conservar:
- heatsink;
- heatpipe;
- fan;
- presión/contacto térmico original.

Construir:
- toma de aire limpia;
- espacio libre alrededor del fan;
- ducto de exhaust desde radiator hacia fuera de la maleta;
- ventilador AUX sólo si las mediciones lo justifican.

Validar con estrés térmico antes y después.

## Riesgo 4 — cargador/identificación Dell

Mantener DC-in jack original y cargador Dell. El sistema especifica 19.5 V / 2.31 A (~45 W) y el conector Dell incorpora identificación en el cargador compatible.

No convertir el PC a USB-C PD en la primera versión.

Si algún día se hace:
- usar un emulador/adapter Dell-ID probado para el modelo;
- conservar reversibilidad.

## Riesgo 5 — antenas WLAN

La tarjeta WLAN usa dos cables Main/Aux.

Si se elimina la tapa/palmrest:
- mantener las antenas originales alejadas de metal;
- o migrar a pigtails MHF4/U.FL apropiados sólo después de identificar el conector real;
- evitar colocar antenas detrás de una placa metálica.

El Wi-Fi LAB USB permanece separado.

## Riesgo 6 — teclado/touchpad

**Cambio de diseño:** el teclado/touchpad internos dejan de ser una dependencia mecánica importante. La interfaz principal será un **teclado Bluetooth externo con trackpad integrado**, colocado sobre el panel del cyberdeck.

Por lo tanto:

- el palmrest Dell puede quedar oculto debajo del panel durante prototipo;
- más adelante se puede retirar por completo si el Dell arranca y funciona estable sin keyboard/touchpad internos;
- los FFC de keyboard/touchpad no necesitan extenderse;
- conservar los conectores de motherboard intactos por reversibilidad;
- probar BIOS/boot, suspensión y wake con ambos FFC desconectados antes de eliminar definitivamente piezas del palmrest.

El **power-button module**, I/O board, DC-in, display cable y refrigeración siguen siendo subsistemas distintos y deben conservarse según necesidad.

Esto libera superficie y permite una bandeja técnica mucho más limpia.

## Riesgo 7 — I/O board y power button

La placa madre conecta a una I/O board y un power-button module por FFC.

Recomendación:
- conservar ambas;
- fijarlas en pequeños brackets;
- usar el botón original Dell;
- el ESP32 sólo podrá simular una pulsación mediante aislamiento en una fase posterior.

## Riesgo 8 — EMI/RF

La carcasa plástica original y los planos de masa del notebook contribuyen a EMC.

En la maleta:
- separar RF de DC/DC;
- usar coaxial corto;
- usar ferritas si las mediciones muestran ruido;
- no montar RTL-SDR junto al buck/boost;
- mantener tierra de señal ordenada;
- probar espectro con cada convertidor ON/OFF.

## Arquitectura mecánica recomendada

No usar motherboard flotando.

```text
LCD en tapa
   |
cable eDP original
   |
motherboard + heatsink + fan
sobre subchasis rígido
   |
batería / daughterboards
   |
bandeja smart modules
```

## Gate de desmontaje

Antes de eliminar el plástico original:

1. arrancar y benchmarkear Dell intacto;
2. registrar temperaturas;
3. abrir y fotografiar;
4. medir cada cable;
5. leer etiquetas/DP-N;
6. identificar modelo panel;
7. crear mockup de subchasis;
8. probar motherboard en subchasis temporal;
9. recién entonces descartar piezas plásticas no necesarias.

## Datos que debemos capturar de la unidad real

- Service Tag (no publicar);
- DP/N del display cable;
- modelo/EDID del panel;
- foto del conector de pantalla en motherboard;
- largo útil del display cable;
- modelo de WLAN;
- conector de antena WLAN;
- modelo/DP-N batería;
- pitch/contactos de FFC de teclado/touchpad/I/O;
- forma del exhaust original;
- puntos de tornillo de motherboard;
- ubicación de sensores térmicos.

## Riesgo 9 — usar la batería Dell como fuente AUX alternativa

El Vostro 3405 dispone de un USB Type-A 2.0 Charging port y BIOS con USB PowerShare. El proyecto evaluará esa salida como **segunda fuente del dominio AUX completo**, no sólo de un rail crítico.

No se conecta en paralelo con la LiFePO4. Ambas entradas llegan a un selector de fuente con **break-before-make, interbloqueo y reverse-current blocking**. Aguas abajo se reutilizan los mismos reguladores, protecciones, medición y switches de módulos.

La fuente Dell no puede retroalimentar el DC-IN del propio notebook. El ramal LiFePO4 -> DC-DC Dell queda separado del selector AUX.

La arquitectura permite encender cualquier módulo en emergencia, pero la potencia simultánea estará limitada por la corriente real disponible desde el Dell. Debe medirse antes de seleccionar convertidores o protecciones definitivas.

Ver `21-portable-power-architecture.md`.
