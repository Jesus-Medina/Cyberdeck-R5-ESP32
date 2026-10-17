# 26 — Lilith: matriz de 12 interruptores y tendido real de antenas a la tapa
**Estado:** propuesta de ingeniería auditada; **NO** equivale a cableado realizado, firmware probado, ni cambio automático de la V0.1 congelada.
**Fecha:** 2026-10-17. Fuentes canónicas: [17 (BOM V0.1)](17-v0.1-final-bom-checklist.md), [20 (netlist V0.1)](20-v0.1-wiring-netlist.md), [22 (estado real)](22-lilith-build-status-2026-10-17.md), [23 (power budget)](23-lilith-power-budget-and-pending-parts.md), [08 (RF)](08-comms-radio.md), [25 (panel/tapa)](25-lilith-panel-lid-interface.md).

## 0. Regla contra el hardware imaginario

* Material registrado: **6 palancas SPST y 6 basculantes ON/OFF** = 12 cuerpos físicos, no 12 de cada tipo. Los doce interruptores **NO** crean doce canales con protección propia. Solo **SW0** y **SW1** tienen funciones y netlist canónicos V0.1. Su asignación a una palanca física concreta es propuesta hasta identificar continuidad y ratings DC.
* V0.1: Mean Well GST60A12-P1J externa 12 V 5 A → fusible 2 A → SW0 → XL4015 regulado a 5 V → SW1 + supervisor ESP32 (INA3221 CH3) y **2 TPS2553DBVR-1** → Smart Out 1 (INA CH1) / 2 (INA CH2). No está instalado ni probado; el banco 3V3 ESP32/OLED/INA sí. **Tres TPS restantes son reserva**, no canales ya habilitados.
* Panel/tapa = interfaz del usuario; niveles inferiores = infraestructura. Dell = **placa madre + refrigeración**, sin teclado/trackpad original. Teclado Bluetooth independiente.
* El pin EN de **TPS2553DBVR-1 es activo ALTO**. EN1 desde GPIO4, EN2 desde GPIO6, con **pulldown 10 kΩ a GND** según netlist 20; FAULT1 GPIO5, FAULT2 GPIO7. A 12 V no se conecta TPS2553 (Vin 2,5–6,5 V). Ante FAULT de la versión -1 (latch-off) se debe revisar la causa; no hacer reset repetido automático.
* Las conexiones de señal no cortan la alimentación de forma segura si falta el circuito de corte. Una palanca ON/OFF física puede pedir una función, pero solo existe esa función cuando haya rail, protección, driver o controlador USB compatible, y prueba de corriente/picos.
* **No perforar maletín**: soportes de antena y conectores van en bisel o subpanel INTERNO protegido; se usan con tapa abierta, se guardan al cerrar.

## 1. Matriz de identificación FÍSICA (12 = 6+6)

Las etiquetas **P1–P6** son seis palancas. **B1–B6** son seis basculantes. Especificaciones como GPIO de lectura, voltaje, fusibles adicionales o SKU de control NO se dan por compradas ni asignadas salvo lo congelado V0.1.

| ID | Tipo | Etiqueta frontal propuesta | Función / cadena eléctrica | Evidencia y condición para habilitar |
|---|---|---|---|---|
| **P1 = SW0** | Palanca | MASTER AUX | Mean Well DC 12 V → fusible 2 A → contacto DC 12 V/≥2 A comprobado → XL4015. Corte de AUX, no corta el Dell. | **Definido en V0.1, NO montado.** Comprobar terminales COM/NO por continuidad y rating DC real antes de energizar. |
| **P2 = SW1** | Palanca | SUPERVISOR | +5V_BUS → SW1 → INA3221 CH3 → 5V del ESP32. OLED/INA lógica del supervisor según el diseño. | **Definido en V0.1, NO montado.** USB Dell puede alimentar ESP32 por otra vía: resolver **backfeed/doble alimentación** antes de conectar USB y AUX a la vez. |
| **P3** | Palanca | SMART 1 ARM | Candidato a **inhibidor físico** de TPS2553 #1 (GPIO4 → contacto en serie → EN1, con pulldown 10 kΩ). OFF fuerza EN1 bajo; ON **permite**, pero no obliga, habilitación por ESP32. | **CAMBIO PROPUESTO, NO parte de netlist 20 vigente.** Antes de instalar: esquema revisado, cable corto, rebote, estados arranque/reinicio y FAULT latch-off ensayados. No interrumpir carga de potencia por GPIO. |
| **P4** | Palanca | SMART 2 ARM | Equivalente a P3 para TPS2553 #2 (GPIO6 → contacto en serie → EN2, pulldown 10 kΩ). | **CAMBIO PROPUESTO, NO montado**. Dos Smart Outs de V0.1; no implica más ramas. |
| **P5** | Palanca | RESPALDO DELL ARM | Solo **autorización lógica** de futuro selector break-before-make de respaldo AUX desde USB Dell, con anti-retorno y evaluación de presupuesto; **NO** conmuta directamente 12 V/5 V, ni conecta batería del Dell al BUS. | **BLOQUEADO V1**: aún no existen selector/mux, convertidor/bloqueo anti-backfeed ni validación de energía suficiente desde USB Dell. Puede quedar sin conexión/precinto. |
| **P6** | Palanca | LAB OUTPUT ARM | Señal de habilitación para la salida de una **fuente LAB regulable CC/CV futura**, con interruptor de potencia específico, OCP/OVP y estado; no es el XL4015 fijo del carril V0.1. | **BLOQUEADO V1**: buck-boost, control de salida, medición y protección pendientes. No prometer 0–24 V/5 A: 24V×5A=120W, superior a la Mean Well 60W nominal. |
| **B1** | Basculante | WIFI LAB | Solicitud de encendido de un puerto USB individual del adaptador Wi-Fi de laboratorio (nunca cortar D+/D− a mano). | **BLOQUEADO V1**: definir adaptador, consumo pico, hub/power switch USB por puerto con aislamiento VBUS y sin retorno al Dell. |
| **B2** | Basculante | RTL-SDR | Solicitud de encendido de puerto USB individual para RTL-SDR (receptor, NO transmite). | **BLOQUEADO V1**: mismo requisito de power por puerto, consumo y USB VBUS; no compartir simplemente una salida Smart 5V sin verificar el uso USB. |
| **B3** | Basculante | LoRa | Señal de enable de rail/driver **3,3 V** de la placa LoRa elegida, con corriente pico, controlador y reset validados; separado de RF. | **BLOQUEADO V1**: SKU LoRa, frecuencia legal y alimentación regulada por determinar. No aplicar 5 V directamente a módulo 3V3 ni transmitir sin antena correcta. |
| **B4** | Basculante | GNSS | Señal de enable de GNSS, a nivel de control de su circuito USB o 3,3 V real. | **BLOQUEADO V1**: módulo exacto, antena activa/pasiva, bias LNA y consumo pendientes. |
| **B5** | Basculante | NFC / PN532 | Solicitud de enable de su módulo PN532 y protección de niveles I²C/SPI. | **BLOQUEADO V1**: driver, alimentación, compatibilidad y emplazamiento de bobina NFC pendientes. |
| **B6** | Basculante | IR LAB | Permiso lógico para LED IR 940 nm mediante transistor 2N2222/2N3904 y receptor IR 38 kHz; la palanca NO debe llevar corriente de LED sin driver. | **BLOQUEADO V1**: circuito LED/limitación de corriente/transistor y programa aún no montados. |

### 1.1 Qué SÍ se cablea y qué NO

**Congelado V0.1:** P1 y P2 si sus interruptores físicos cumplen el rating DC y la medición de contactos. El resto **no se cablea todavía**.

**P3/P4 son una propuesta de seguridad distinta a netlist 20**, que hoy conecta GPIO4/6 directamente a EN1/EN2; requieren actualización deliberada de esquema y pruebas antes de pasar a "V0.1". Si no se aprueba el cambio, siguen sin utilizar y la V0.1 conserva sus dos GPIO EN directos.

**B1/B2 no se pueden improvisar con interruptores de alimentación** sobre un cable USB conectado al Dell: riesgo de backfeed, desconexión incompleta y estado USB incoherente. Exigir hub compatible/port-power y ensayo.

**P5 no representa una fuente adicional**, ni transforma 5V USB del Dell a 12V ni multiplica amperes. LiFePO4 no recibe carga del Dell ni de Mean Well 12 V sin cargador adecuado. P6 no activa una fuente inexistente.

**Regla para los diez no canónicos:** en maqueta pueden rotularse como **PROPUESTA / DESHABILITADO**; en prototipo real, cubrir su terminal o dejarlos eléctricamente abiertos y rotular `SIN CABLEAR` hasta cerrar circuitos específicos.

### 1.2 Modo de implementación cuando se compre V1

Cada interruptor futuro B1–B6 se puede leer por GPIO o expansor digital y solicitar a un **driver/power switch protegido de su propia rama**, con estados seguros por defecto, medida y telemetría. Para P3/P4, si se aprueba el contacto de inhibición, su función es hardware OFF dominante y el ESP sigue habilitando por software. **No hay 12 eFuses ni doce canales de INA3221 disponibles.**

## 2. Arneses de RF: los módulos NO se montan sobre la pantalla

La tapa aloja **antenas, conectores y soportes** sobre un bisel/subpanel mecánico interno, no sobre la superficie eléctrica del LCD ni la electrónica eDP. La placa radio, sus reguladores, datos y protecciones van en bandeja técnica. El **coaxial es solo línea RF** (salvo sesgo DC para LNA de GNSS activo diseñado expresamente).

```text
TAPA (abierta, superficie superior interna)
  Antena elegida y despejada
    │ SMA o RP-SMA compatible (ver pin/hembra, no solo rosca)
  bulkhead fijado al SUBPANEL INTERNO (no al case impermeable)
    │ pigtail coaxial 50 Ω flexible y corto, calculado en mm reales
    │ tramo seguro por bisagra, holgura, funda, abrazaderas/strain relief
    ▼
BANDEJA ELECTRÓNICA
  conector RF del módulo (SMA, U.FL/I-PEX, etc., según referencia)
  módulo Wi-Fi / RTL-SDR / LoRa / GNSS
    ├── datos: USB → Dell, o UART/SPI → ESP32 según módulo
    └── energía: USB 5V Dell o rail protegido + regulación local
PISO ENERGÍA
  fuente + regulador/protecciones del módulo (según tensión y corriente)
```

**Nunca soldar RF a la pantalla, bisagra o cable eDP**. No quitar ni modificar pista de antena PCB del ESP32, Wi-Fi o LoRa si no existe punto RF documentado: preferir versión del módulo con **conector RF externo**. Si no lo tiene, no se puede prometer este recorrido con un adaptador mágico; habrá que optar por cambiar la placa o colocar la antena integrada lejos del LCD.

### 2.1 Una ruta real para cada radio

| Radio | Trayectoria señal/control | Coax en tapa | Requisito pendiente |
|---|---|---|---|
| **Wi-Fi LAB** | Dell USB → adaptador Wi-Fi; alimentación 5V desde el USB compatible | **1 o 2** extensiones independientes hacia antenas **2,4/5GHz**; **dos si el adaptador tiene dos salidas/diversidad/MIMO**, sin unir por splitter | Modelo y conectores reales: algunos traen RP-SMA, otros U.FL/mini coax, y algunos **NO** admiten antena externa. Verificar el adaptador comprado/seleccionado. |
| **RTL-SDR** | Dell USB → dongle SDR (solo RX); alimentación por USB | Un coax de 50Ω a SMA/antena **de la banda que se desea recibir** | Modelo, tipo SMA y antena adecuados a banda; nunca asumir antena de Wi-Fi apta para todo SDR. |
| **LoRa** | ESP32 GPIO UART/SPI según placa → radio; alimentación regulada local **según datasheet** | Un coax 50Ω, U.FL→SMA o SMA→SMA según módulo, antena de **frecuencia LoRa concreta** | Elegir SX1262/SX127x y banda permitida en Chile, pinout, corrientes TX, conector y adaptación. **Prohibido transmitir sin antena correcta montada.** |
| **GNSS** | Receptor GPS USB al Dell o UART al ESP32 | Antena GNSS apropiada con vista al cielo; coax solo si módulo tiene RF externo; antena activa exige bias/LNA compatible | Elegir GNSS; patch integrado puede exigir montar el *receptor/patch* completo arriba, en lugar de llevar coax desde abajo. |
| **Wi-Fi Dell y ESP32 integrado** | Dell y ESP32 usan sus radios propios | **No tienen asignación de coax adicional canónica** | No modificar antena PCB del ESP32. Si se retira marco original Dell, comprobar cómo queda antena Wi-Fi del Dell; su montaje se estudia por separado. |

Es **imposible** prometer una única longitud, pigtail o tipo de antena universal sin los SKU de radio y antenas. La cantidad teórica para Wi-Fi LAB (dos) + LoRa (uno) + SDR (uno) + GNSS (uno) es **hasta cinco arneses RF**, pero no es una lista de compra aprobada.

### 2.2 Montaje mecánico y cableado

1. Medir el **bisel LCD real** y soportes (no la resolución ni solo el área activa). Confirmar espacio útil y bisagras, sin presionar LCD, backlight, eDP o tornillos del panel.
2. Elegir **subpanel desmontable** de plástico FR4 no conductor estructural o PVC correctamente fijado, dentro de la tapa: los bulkheads se fijan al subpanel y soportan el torque de roscar antenas, no el display. Si es incompatible con las antenas compradas, rediseñar soporte.
3. Pasar coaxial **por dentro del maletín desde bandeja RF a zona de bisagra** con la tapa abierta/cerrada; no atravesar las paredes exteriores. Evitar pinzamiento, pliegues, tracción y radio de curvatura inferior al del cable escogido. Abrazaderas para que el movimiento recaiga en el bucle flexible, no en U.FL.
4. Separar coax de buck XL4015, alimentación conmutada, hub USB3, motores/ventiladores, disipador Dell y eDP; reducir cruces en paralelo y exposición a planos metálicos. Evitar que una antena quede **justo detrás del LCD**, pegada a bisagra/metales o frente a la otra.
5. Antenas de varilla **plegables y contenidas dentro del maletín al cerrar**; para usar RF, abrir y levantar. GNSS necesita orientación favorable al cielo; NFC necesita área de lectura sin blindaje metálico.
6. Etiquetar **Wi-Fi A**, **Wi-Fi B** (si aplica), **LoRa (frecuencia)**, **SDR (banda/antena)**, **GNSS (activo/pasivo)**. No intercambiar SMA/RP-SMA, ni antenas solo por rosca compatible.
7. Montar solo después de comprobar cierre con **plantilla física a escala 1:1**, fijación, holguras y que el cable eDP mantiene su curva y protección.

### 2.3 Pérdidas: la antena NO queda al "100%"

La extensión coaxial introduce pérdida de inserción, sus conectores añaden pérdida, y el entorno cambia patrón y eficiencia. Ejemplo de **referencia de fabricante (Digi)**: RG-316 típico ~139 dB/100m a **2,4 GHz**, un tramo de 0,30m resulta ~0,42 dB **solo de cable** (0,30×1,39 dB/m). La potencia resultante del tramo sería ~10^(-0,42/10) = **0,91**, ~91% de la potencia antes del tramo, **sin** contar conectores, VSWR, polarización, metal ni interferencias. Esto NO significa 91% de alcance o velocidad. A 5 GHz suele empeorar y la cifra precisa depende del modelo de cable.

Una antena que ve un espacio despejado puede funcionar **mejor en conjunto** que la misma antena enterrada al lado de ruido/pantalla, aunque exista pérdida de coax. Pero jamás podemos asegurar un porcentaje absoluto antes de medir. Preferir cable corto, adecuado a frecuencia, impedancia RF (habitualmente 50 Ω) y conectores correctos, no el más fino de cualquier longitud.

**Referencias externas revisadas:**
- Digi, tablas coax e impedancia 50 Ω: https://www.digi.com/support/knowledge-base/antenna-and-cable-impedance (también https://d1kffspu3izrbr.cloudfront.net/support/knowledge-base/antenna-and-cable-impedance)
- Digi, placement/extension attenuation: https://www.digi.com/support/knowledge-base/cellular-antennas-for-your-dal-device
- u-blox, antenas GNSS: https://content.u-blox.com/sites/default/files/products/documents/GNSS-Antennas_AppNote_%28UBX-15030289%29.pdf
- TI, EN activo-alto TPS2553DBVR-1: https://www.ti.com/product/TPS2553-1

### 2.4 Pruebas de aceptación ANTES de energizar o transmitir

1. Fotografiar ambos extremos de CADA antena y CADA módulo, registrar SMA/RP-SMA/U.FL exacto, banda, ganancia si conocida y cable. No comprar pigtails sin esto.
2. Medir trayecto real por bisagra **con cuerda o cable sacrificial**, incluyendo movimiento completo de apertura; crear foto de posición y curvas. Ensayar cerrado para asegurar que no toca pantalla.
3. Revisar continuidad/cortos/aislamiento de los **arneses coax desconectados**, según tipo de antena y fabricante (algunas antenas presentan continuidad DC intencional; no diagnosticar a ciegas); no usar ohmímetro sobre radio energizada. Inspeccionar y fijar conectores.
4. Verificar cada rama DC con voltímetro, corrientes de arranque y protección antes de radio, y que no existe retorno USB/energía.
5. Radio EN REPOSO: comparar antes/después, mismo lugar/orientación/banda. Wi-Fi: RSSI, link rate y transferencia; LoRa: RSSI/SNR y tasa de paquetes entre nodos **autorizados**; SDR: ruido y señal de referencia; GNSS: C/N0 y número/calidad de satélites, tapa abierta.
6. Si falla la recepción: comprobar antena y banda, retorno de masa, saturación/ruido de convertidores, conectores, ruta junto a USB3/eDP y longitud del coax. **Si no pasa, la antena NO queda aprobada en la tapa.**

## 3. Desfase de la imagen generada frente a hardware canónico

La infografía anterior es **solo concepto de estética**: aparecen 12 palancas + 12 basculantes, pero tenemos 6+6; inventa cámara térmica/webcam IR, DisplayPort y HDMI-IN, pantalla de espectro independiente, y valores 0–24 V/5 A o Smart Out 5V/3A no validados. No fabricar ni rotular el panel según esa foto.

## 4. Bloqueantes concretos y próximo hardware

* Medidas reales del Dell desnudo, LCD, interior, bisagra y teclado.
* Rating real de los 12 interruptores y continuidad de terminales. Solo SW0/1 tienen ruta congelada.
* LoRa y Wi-Fi LAB: modelos concretos/fotos RF/antenas; RTL-SDR y GNSS: elegir SKU y conectores antes de cablear tapa.
* Radio V1: medición Wh, corriente normal/pico, rails 5V/3V3, canal protegido asignado, administración VBUS USB, driver y GPIO antes de poner etiqueta ON.
* Fotos y especificaciones de antenas realmente compradas para comprobar SMA/RP-SMA, banda, impedancia, largo. No asignar 100% de rendimiento.
* V0.1 primero: completar y aprobar protección/INA/SW0/1; V1 después, sin energizar radio caro durante pruebas de regulador.

**Criterio de aprobación:** un interruptor se habilita solamente cuando exista en GitHub una línea `ID → contacto/GPIO → circuito de control/protección → potencia real → carga → corriente pico → prueba`; y una antena se aprueba cuando exista `radio/puerto RF → pigtail SKU → mm reales + pérdida → conector tapa → antena/frecuencia → prueba abierta/cerrada`.
