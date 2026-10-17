# 19 — Dimensiones físicas maestras y envolventes mecánicas

> **CORRECCIÓN OBLIGATORIA 2026-10-17:** el montaje actual ya NO conserva el Dell Vostro 3405 completo ni su teclado/touchpad, solo placa madre y conjunto de refrigeración. Las dimensiones 328,7×239,5×19,9 mm descritas más abajo corresponden al **portátil original** y NO deben aplicarse al contorno de la motherboard desnuda. El contorno y altura de placa/heatpipe siguen **SIN MEDIR**. Panel principal y tapa (con pantalla) son ambos accesibles durante operación; reserva de 12 interruptores **216×78 mm, no cota para cortar**. Ver [regla y plano preliminar 25](25-lilith-panel-lid-interface.md).


Actualizado: **2026-10-04**.

Este documento reúne las dimensiones físicas del cyberdeck y separa explícitamente:

- **EXACTA**: plano/datasheet del fabricante o modelo inequívoco.
- **CONFIRMADA DE PRODUCTO**: ficha del modelo comercial seleccionado.
- **FAMILIA / CLON**: dimensión habitual del mismo módulo, pero el vendedor no publica plano suficiente.
- **ENVOLVENTE CAD**: espacio conservador recomendado para diseño; no sustituye una medición real.
- **PENDIENTE FÍSICA**: no existe una cota pública defendible o el módulo futuro aún no tiene SKU congelado.

> Regla: **no perforar paneles ni fabricar brackets definitivos usando una medida FAMILIA/CLON**. Primero medir la unidad que llegó.

---

## 1. Arquitectura física actual

La estrategia mecánica de v3/V0.1 sigue siendo:

1. mantener el Dell Vostro 3405 funcional e independiente;
2. conservar inicialmente el conjunto inferior Dell en su estructura original;
3. montar el LCD Dell en la tapa si se separa el display assembly;
4. montar electrónica AUX/V0.1 en bandeja técnica independiente;
5. montar OLED, switches, instrumentación y conectores en paneles separados;
6. no llevar 230 V AC al interior: el MEAN WELL queda como adaptador externo.

Arquitectura eléctrica V0.1:

```text
230 V AC
  -> cable Type-L / IEC C13
  -> MEAN WELL GST60A12-P1J (externo)
  -> 12 V DC / jack 5.5 x 2.1
  -> fusible 2 A 5x20
  -> SW0 MASTER AUX
  -> XL4015 CC/CV
  -> BUS 5 V AUX
      -> SW1 -> ESP32-S3 + OLED
      -> TPS2553 #1 -> INA3221 CH1 -> SMART OUT 1
      -> TPS2553 #2 -> INA3221 CH2 -> SMART OUT 2
      -> INA3221 CH3 -> supervisor / medida auxiliar

Dell original = alimentación independiente
Dell USB -> CP2102 -> ADuM1201 -> ESP32 UART
```

---

## 2. Caja — Robust / MEIJIA MJ-5018

### Exterior

**406 x 330 x 174 mm** — CONFIRMADA DE PRODUCTO / fabricante.

Fuentes:

- MEIJIA MJ-5018: 15.98 x 12.99 x 6.85 in.
- Easy Chile, modelo MJ-5018: 40.6 x 33 x 17.4 cm.

### Interior

Existen pequeñas diferencias entre catálogos del mismo código:

- **371 x 258 x 152 mm** en fichas de MJ-5018 que coinciden con exterior 406 x 330 x 174 mm.
- **372 x 260 x 155 mm** en otro catálogo industrial.

Para CAD preliminar usar la opción conservadora:

**ENVOLVENTE INTERIOR DE TRABAJO = 371 x 258 x 152 mm.**

Antes de cortar ABS, espuma o paneles: medir la caja física porque nervaduras, radio de esquinas, bisagras y cierre reducen el rectángulo realmente aprovechable.

---

## 3. Dell Vostro 3405 completo

Dell publica:

- ancho: **328.70 mm**
- profundidad: **239.50 mm**
- altura frontal: **18.10 mm**
- altura posterior: **19.90 mm**
- touchpad: **105 x 80 mm**
- área activa de panel 14": aprox. **309.35 x 173.99 mm** según variante de display.

Estado: **EXACTA para el chasis Dell**.

Consecuencia mecánica: el Dell completo cabe en planta dentro de la envolvente conservadora del MJ-5018, pero la dimensión de profundidad queda ajustada. Por eso v0.1 conserva el conjunto inferior y resuelve el resto en capas, no alrededor de la motherboard desnuda.

---

## 4. Motherboard Dell

Configuración del proyecto:

- Dell Vostro 3405
- Ryzen 5 3450U
- familia de placa encontrada para esa configuración: **05HPX6 / GDI53 LA-K001P Rev 1.0 (A00)**.
- plataforma documentada: AMD FP5 Picasso/Dali.

Hay schematic de 102 páginas y referencias de boardview/repair para LA-K001P, pero **no encontré una cota pública fiable del contorno completo de PCB**. Los marketplaces que muestran medidas suelen publicar dimensiones del paquete de envío, por lo que no se usarán.

Estado: **PENDIENTE FÍSICA para el contorno de PCB**.

### Cómo cerrar esta medida correctamente

Cuando abramos el Dell:

1. confirmar serigrafía exacta de la unidad: GDI53 / LA-K001P y P/N;
2. retirar/descubrir la board según el manual de servicio;
3. foto cenital sin perspectiva con regla milimetrada;
4. medir X/Y máximos con calibre;
5. medir coordenadas de agujeros y puertos respecto de dos datums;
6. guardar DXF/SVG del contorno.

Hasta entonces **no diseñar un bracket de motherboard desnuda**. Esto no bloquea V0.1 porque se conserva la estructura Dell.

---

## 5. Electrónica V0.1 — módulos

| Pieza | Dimensión física | Estado | Envolvente CAD recomendada |
|---|---:|---|---:|
| ESP32-S3 DevKitC-1 | **62.74 x 25.40 mm** PCB | EXACTA Espressif | 66 x 30 mm + acceso USB |
| OLED SH1106 1.3" | **35.4 x 33.5 x ~4–5 mm** | FAMILIA de módulo | 40 x 38 x 10 mm |
| INA3221 triple-channel breakout | **38 x 32 x ~3 mm** | FAMILIA de breakout común | 43 x 37 x 12 mm |
| XL4015 CC/CV 5 A | **51 x 26.3 x 14 mm** | FAMILIA del módulo seleccionado | 60 x 35 x 22 mm |
| CP2102 USB-UART | vendedor no entrega plano; módulos USB-A 6-pin varían aprox. 31x18 a 50x16 mm | CLON | **55 x 22 mm** hasta medir el comprado |
| perfboard | **120 x 80 mm** | CONFIRMADA, variante 8x12 cm | 122 x 82 mm |
| MB102 830 puntos | familia típica **165 x 55 x 8.5 mm**; algunos vendedores llaman MB102 a bases 172x64 | CLON | **175 x 65 x 12 mm** para prototipo |
| KF301-2P 5 mm | aprox. **10 x 7.6 x 10 mm** | FAMILIA | 12 x 10 x 13 mm |
| KF301-3P 5 mm | aprox. **15 x 7.6 x 10 mm** | FAMILIA | 17 x 10 x 13 mm |
| resistencia cemento 10 W | aprox. **48 x 10 x 10 mm** cuerpo | FAMILIA | separar de plástico; no encajonar |
| fusible | **5 x 20 mm** | EXACTA por especificación | según portafusible |
| portafusible PCB 5x20 | familia cerrada aprox. **24.4 x 9.7 x 11 mm** | CLON | 27 x 14 x 14 mm |
| jack 5.5x2.1 panel | interfaz **5.5 x 2.1 mm**; geometría trasera depende del jack | CLON | medir antes de taladrar |
| KCD1 rocker redondo 12 V / 20 A | corte habitual **Ø20–21 mm**, cuerpo aprox. 25–27 mm | FAMILIA | Ø22 panel + 35 mm profundidad libre |
| mini rocker KCD1 rectangular | marco aprox. 21x15 mm, calado aprox. 19x12–13.2 mm | FAMILIA | medir unidad antes de corte |
| header macho | pitch **2.54 mm** | EXACTA por especificación | depende del número de vías |
| JST-XH kit | vendedor lo anuncia 2.54 mm; XH genuino usa **2.50 mm** | CLON | no congelar PCB final con el anuncio |
| cable potencia | 20 AWG | especificación | radio de curvatura/terminal manda |
| cable señales | 24–28 AWG | especificación | — |

---

## 6. Chips V0.1

Las siguientes cotas sirven para validar footprint/breakout, no para diseñar la caja.

### TPS2553DBVR-1

Encapsulado **DBV / SOT-23-6**:

- cuerpo nominal: aprox. **2.90 x 1.60 mm**
- largo de cuerpo: 2.75–3.05 mm
- ancho de cuerpo: 1.45–1.75 mm
- altura máx.: **1.45 mm**
- pitch: **0.95 mm**
- span con patas: aprox. 2.6–3.0 mm

Estado: **EXACTA TI**.

### ADuM1201BRZ

Encapsulado **R-8 narrow SOIC**:

- cuerpo largo: **4.80–5.00 mm**
- cuerpo ancho: **3.80–4.00 mm**
- span total con patas: **5.80–6.20 mm**
- altura máx.: **1.75 mm**
- pitch: **1.27 mm**

Estado: **EXACTA Analog Devices**.

### 24C02 SOP8

La compra está congelada a **24C02 SOP8**, no a una única marca. En el caso de M24C02-RMN6TP / SO8N:

- largo: aprox. **4.9 mm**
- cuerpo: aprox. **3.9 mm**
- span de patas: aprox. **6.0 mm**
- altura máx.: **1.75 mm**
- pitch: **1.27 mm**

Estado: **EXACTA para el encapsulado ST de referencia**; verificar la marca recibida.

### PC817 THT

Paquete DIP-4 típico/original Sharp:

- cuerpo: aprox. **6.5 x 4.58 mm**
- altura: aprox. **3.5 mm**
- pitch de pines: **2.54 mm**
- separación entre filas: **7.62 mm**

Estado: **EXACTA de familia PC817 Sharp**.

---

## 7. Breakouts de chips

### TPS2553 — SOT23 0.95 -> 2.54

El adaptador final de V0.1 es el artículo:

- AliExpress **1005006760768759**
- requisito: SOT23 / 0.95 mm -> 2.54 mm.

El vendedor no expone un plano mecánico fiable indexable. Como referencia, placas SOT23->DIP6 comparables miden alrededor de **10.16 x 7.62 mm**, pero **NO se congela esa medida como la del artículo comprado**.

Estado: **PENDIENTE MEDIR AL LLEGAR**.

### ADuM1201 / EEPROM — SOIC8/SOP8 -> DIP8

Adaptador final:

- AliExpress **1005006048077119**
- pitch de salida 2.54 mm.

Sin plano mecánico fiable del SKU comprado.

Estado: **PENDIENTE MEDIR AL LLEGAR**.

---

## 8. Fuente externa

### MEAN WELL GST60A12-P1J

- cuerpo: **125 x 50 x 31.5 mm**
- salida: **12 V / 5 A / 60 W**
- plug P1J: **5.5 x 2.1 mm**, centro positivo
- entrada: IEC C14
- cable DC 12 V de la familia: ~1000 ± 50 mm según plano del fabricante.

Estado: **EXACTA**.

La fuente queda **fuera** del MJ-5018. Sólo entra 12 V DC al cyberdeck.

---

## 9. Espacios térmicos / de servicio que no son dimensiones de pieza

No dibujar los módulos “a ras”. Para el CAD preliminar:

- conectores USB: dejar al menos espacio para cuerpo del conector y curva del cable;
- KF301: acceso vertical al tornillo;
- XL4015: dejar circulación de aire y acceso a potenciómetros;
- resistencia 10 W: mantener lejos de ABS, espuma y cableado;
- ESP32: acceso al USB-C y a BOOT/RESET;
- OLED: el corte visual debe basarse en área visible real, no en el PCB completo;
- switches: la profundidad detrás del panel es tan importante como el agujero frontal.

---

## 10. Partes de la BOM maestra que aún NO tienen geometría congelable

Existen en la arquitectura, pero todavía no tienen SKU/modelo mecánico final. No se debe inventar una medida:

- hub USB 3 alimentado anti-backfeed;
- hub USB por puerto;
- encoder;
- buzzer;
- DS3231 breakout;
- BME280 breakout;
- eFuse/backplane PCB final;
- TCA9548A (no requerido V0.1);
- ESP32 CYD 2.8" hasta congelar variante física;
- Arduino existente: registrar modelo exacto al inventariarlo;
- panel I2C/SPI/UART;
- level shifters;
- Wi-Fi USB LAB;
- RTL-SDR;
- LoRa;
- GNSS;
- PN532;
- FNIRSI;
- GM328A/LCR-T7;
- logic analyzer;
- buck-boost LAB definitivo;
- V/A/W meter;
- fan(es) de caja;
- bulkheads SMA/RP-SMA/USB/HDMI/RJ45 definitivos.

**Regla:** una función en el BOM no equivale a una geometría. La geometría se congela al seleccionar SKU.

---

## 11. Qué ya podemos modelar en CAD sin esperar compras

Se puede crear ya el ensamblaje maestro con:

1. volumen interior conservador MJ-5018: **371 x 258 x 152 mm**;
2. volumen Dell completo: **328.70 x 239.50 x 19.90 mm**;
3. ESP32-S3: **62.74 x 25.40 mm**;
4. OLED: envolvente **40 x 38 x 10 mm**;
5. INA3221: envolvente **43 x 37 x 12 mm**;
6. XL4015: envolvente **60 x 35 x 22 mm**;
7. CP2102: envolvente temporal **55 x 22 mm**;
8. dos perfboards: **120 x 80 mm** cada una;
9. MB102 temporal: **175 x 65 x 12 mm**;
10. zonas de cableado y conectores.

La motherboard desnuda se incorpora sólo después del levantamiento físico.

---

## 12. Fuentes técnicas principales

- Dell Vostro 3405 manuals: https://www.dell.com/support/product-details/product/vostro-14-3405-laptop/resources/manuals
- Dell Vostro 3405 service manual / system-board procedure.
- MEIJIA MJ-5018 manufacturer page: https://www.meijiacase.com/product-page/portable-waterproof-hard-case-5
- Easy Chile MJ-5018 product page.
- Espressif ESP32-S3-DevKitC-1 dimensions: https://dl.espressif.com/dl/PCB_ESP32-S3-DevKitC-1_V1_20210312CB.pdf
- TI TPS2553-1 datasheet: https://www.ti.com/lit/ds/symlink/tps2553-1.pdf
- Analog Devices ADuM1200/ADuM1201 datasheet.
- ST M24C02 datasheet/package drawing.
- Sharp PC817 datasheet.
- Mean Well GST60A series mechanical specification.
- Newegg / repair references for 05HPX6, GDI53 LA-K001P.
- Dell/Compal LA-K001P schematic references.
