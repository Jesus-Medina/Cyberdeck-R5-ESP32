# 21 — Arquitectura de energía portátil y carga única

Actualizado: **2026-10-08**.

Este documento define la arquitectura energética objetivo del cyberdeck terminado. No reemplaza el montaje de banco de la V0.1: durante desarrollo, el **Mean Well GST60A12-P1J** sigue siendo una fuente segura y estable de 12 V para probar la electrónica. En el equipo portátil terminado, la fuente primaria será una **batería LiFePO4 4S**.

## 1. Objetivo de diseño

El cyberdeck debe:

- funcionar sin conexión a la red;
- tener una batería principal para los sistemas añadidos;
- alimentar también al Dell por su entrada normal de cargador, sin modificar su batería/BMS;
- conservar la batería interna del Dell como respaldo;
- alimentar al ESP32 desde el sistema AUX, no desde USB del notebook;
- permitir como objetivo final cargar el cyberdeck mediante **una sola entrada externa de carga**;
- mantener 230 V AC fuera del interior del maletín;
- conservar la carcasa impermeable sin perforaciones exteriores.

## 2. Fuente principal

Objetivo inicial:

- química: **LiFePO4**;
- configuración: **4S**;
- tensión nominal: **12,8 V**;
- capacidad objetivo: **10 Ah (~128 Wh)**;
- pack comercial con **BMS integrado**;
- cargador específicamente compatible con el pack seleccionado.

La capacidad exacta queda condicionada a medidas, peso, corriente máxima continua y espacio real disponible. No se construirá un pack de celdas sueltas para la primera versión portátil.

## 3. Arquitectura general

~~~text
                 BATERÍA PRINCIPAL LiFePO4 4S
                       12,8 V nominal
                              |
                       FUSIBLE GENERAL
                              |
                        CORTE GENERAL
                              |
                      +BAT_RAW / GND_AUX
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
  DC-DC PARA DELL       DC-DC 12 V         DC-DC 5 V
  (buck/boost según      REGULADO            REGULADO
   cargador original)        |                   |
          |                  |              +5V_BUS
          v                  |                   |
 Entrada normal Dell         |         +---------+---------+
          |                  |         |                   |
 Circuito Dell/BMS           |      supervisor         TPS2553
          |                  |         |                   |
 Batería interna Dell        |       ESP32            salidas 5 V
~~~

## 4. El Dell conserva su batería interna

No se modifica el pack Dell ni su BMS.

La alimentación desde la batería principal del cyberdeck entra por la **entrada normal de cargador del Dell** mediante un convertidor DC-DC correctamente dimensionado.

~~~text
LiFePO4 -> DC-DC -> entrada de cargador Dell -> electrónica original Dell
~~~

La salida exacta del DC-DC no se fija hasta medir/copiar los datos del cargador original del Dell:

- tensión de salida;
- corriente/potencia;
- polaridad;
- tipo de conector;
- posible pin de identificación del cargador.

La batería interna del Dell queda como una segunda reserva. Si la alimentación externa del cyberdeck desaparece, el notebook puede continuar con su propia batería.

## 5. Política normal de energía del Dell

Mientras exista energía suficiente en la batería principal:

~~~text
Batería cyberdeck
       |
       v
DC-DC Dell
       |
       v
Notebook Dell
       |
       +--> opera el PC
       +--> mantiene/carga su batería interna según la lógica original del Dell
~~~

Por eso, en uso normal **no esperamos descargar deliberadamente ambas baterías a la vez**.

La batería Dell se usa principalmente como:

- respaldo;
- transición ante desconexión;
- reserva si se agota o desconecta el dominio principal.

## 6. Objetivo de carga única

El objetivo de producción es que el usuario conecte **un solo cargador externo** al cyberdeck.

~~~text
230 V AC
   |
CARGADOR LiFePO4 EXTERNO
   |
POWER-PATH / SISTEMA DE CARGA
   +-------------------------> BUS DEL CYBERDECK
   |
   +-------------------------> BATERÍA LiFePO4
~~~

Si el Dell necesita recuperar carga en su batería interna mientras el cyberdeck está conectado:

~~~text
cargador externo
      |
power-path / batería principal
      |
DC-DC Dell
      |
Dell carga su propia batería usando su electrónica original
~~~

Así no se necesitan normalmente dos cargadores externos.

### Excepción

Durante desarrollo, mantenimiento o si la batería principal está desconectada, el cargador original del Dell puede seguir utilizándose directamente. Eso es un modo de servicio, no el flujo normal objetivo.

## 7. Power-path y uso mientras carga

No se conectará un cargador LiFePO4 cualquiera a la batería suponiendo que automáticamente soporta carga y consumo simultáneos.

Antes de habilitar "usar mientras carga" se debe seleccionar una solución compatible con:

- corriente de carga del pack;
- consumo simultáneo del cyberdeck;
- BMS del pack;
- temperatura;
- protecciones;
- potencia necesaria para el Dell y los módulos AUX.

El cargador/power-path definitivo se seleccionará después de medir el consumo real del Dell y del sistema AUX.

## 8. Alimentación del ESP32

El ESP32 pertenece al dominio AUX y **se alimenta desde la batería principal del cyberdeck**, no desde el notebook.

Ruta de producción:

~~~text
Batería LiFePO4
      |
      v
DC-DC 5 V
      |
    +5V_BUS
      |
SW1 SUPERVISOR ENABLE
      |
   +5V_SUP
      |
ESP32-S3 DevKitC-1 (pin 5V + GND)
~~~

Esto permite que el supervisor:

- funcione aunque el notebook esté apagado;
- encienda/apague módulos independientemente;
- supervise el estado del sistema;
- no dependa de un puerto USB del Dell.

La documentación oficial de Espressif permite alimentar la DevKitC-1 por 5V/GND, pero los métodos de alimentación son mutuamente excluyentes. Por ello no se alimentará simultáneamente desde USB y +5V_SUP.

## 9. USB Dell ↔ ESP32

El USB del Dell **no es la fuente de energía del ESP32** en operación normal.

La comunicación Dell ↔ supervisor se mantiene aislada:

~~~text
Dell USB
   |
CP2102 / UART
   |
aislador digital
   |
ESP32
~~~

No debe existir una ruta accidental:

~~~text
Dell USB VBUS -> +5V_SUP
~~~

ni una ruta de backfeed desde AUX hacia el Dell.

El USB directo de la DevKit se reserva para SERVICE/FLASH cuando corresponda.

## 10. Riel de 5 V y TPS2553

Los TPS2553DBVR-1 no se conectan al bus de batería.

~~~text
LiFePO4
   |
DC-DC 5 V
   |
+5V_BUS
   +--> supervisor / ESP32
   +--> TPS2553 #1 -> salida protegida 5 V
   +--> TPS2553 #2 -> salida protegida 5 V
   +--> futuros canales protegidos
~~~

El TPS2553 trabaja en el rango de entrada 2,5–6,5 V, por lo que pertenece al dominio de 5 V.

## 11. Rieles del sistema

Arquitectura prevista:

| Rail | Origen | Uso |
|---|---|---|
| +BAT_RAW | LiFePO4 4S | entrada energética principal |
| +12V_REG | DC-DC desde BAT_RAW | cargas que realmente necesiten 12 V estable |
| +5V_BUS | DC-DC desde BAT_RAW | USB, supervisor y módulos |
| +5V_SUP | +5V_BUS a través de SW1/medición | ESP32 supervisor |
| +3V3_SUP | regulación local del supervisor | lógica, I2C y sensores |
| DELL_DC | DC-DC desde BAT_RAW | entrada normal de alimentación del Dell |

No se asumirá que +BAT_RAW equivale siempre a 12,0 V.

## 12. Papel del Mean Well GST60A12-P1J

El Mean Well permanece en el proyecto, pero su función queda definida como **fuente de banco/desarrollo V0.1**.

~~~text
230 V AC
   |
Mean Well 12 V / 5 A
   |
prototipo V0.1
~~~

Permite validar:

- XL4015/reguladores;
- TPS2553;
- INA3221;
- ESP32;
- switches;
- fusibles;
- cableado;
- firmware;
- fallas y sobrecorriente;

antes de conectar la batería principal.

En el cyberdeck portátil terminado no es la fuente primaria y no se utiliza como cargador directo de LiFePO4.

## 13. Modos de operación

### PORTABLE

~~~text
LiFePO4 -> Dell + AUX
sin conexión a pared
~~~

### CHARGING / DOCKED

~~~text
cargador LiFePO4 -> power-path -> batería + sistema
~~~

Sujeto a que el hardware seleccionado soporte operación simultánea.

### DELL BACKUP

~~~text
batería principal agotada/desconectada
             |
             v
Dell continúa temporalmente con su batería interna
~~~

### LAB / V0.1

~~~text
Mean Well -> electrónica AUX de prueba
~~~

## 14. Decisiones congeladas

- El ESP32 se alimenta normalmente desde **AUX 5 V proveniente de la batería principal**; en emergencia puede recibir +5V_CRITICAL desde el Dell mediante una ruta aislada y protegida.
- El ESP32 no depende de USB del Dell para alimentación normal.
- La batería/BMS original Dell no se modifica.
- El Dell recibe energía externa por su entrada normal.
- El Mean Well es fuente de banco, no batería ni cargador LiFePO4.
- Los TPS2553 están en el rail de 5 V, nunca directamente en 12 V/BAT_RAW.
- El objetivo final es **una sola conexión externa de carga**.
- No se perfora el maletín para instalar conectores exteriores.
- No entra 230 V AC al interior del montaje de baja tensión.

## 15. Pendientes antes de comprar la batería

1. Leer la etiqueta del cargador original Dell y documentar V/A/W/polaridad/conector.
2. Medir consumo del Dell en reposo, carga normal y carga alta.
3. Medir consumo AUX esperado.
4. Calcular corriente continua y pico requerida al pack.
5. Medir espacio físico disponible.
6. Seleccionar pack LiFePO4 comercial con BMS.
7. Seleccionar cargador compatible.
8. Diseñar/seleccionar power-path para carga única y uso simultáneo.
9. Dimensionar fusible general, conductores, conectores y DC-DC.
10. Validar térmicamente antes de integrar al maletín.

## 16. Relación con la V0.1 actual

Los documentos V0.1 siguen describiendo el banco de pruebas. Para esa fase:

~~~text
Mean Well 12 V -> V0.1 Smart Power + Supervisor
~~~

En la versión portátil, la batería principal sustituye a la fuente de banco como origen energético, pero se mantienen las reglas de protección y los rails regulados.

## 17. Selector de fuente AUX con interbloqueo

El respaldo desde el Dell **no se limita a un rail crítico**. Tanto la LiFePO4 como el Dell pueden alimentar el **mismo dominio AUX completo**. Los switches normales del panel siguen decidiendo qué módulos están encendidos.

La limitación en modo Dell será únicamente el presupuesto de potencia que realmente pueda entregar la salida de emergencia del notebook. Ningún módulo queda prohibido por arquitectura: cualquier combinación puede encenderse mientras la suma de consumo permanezca dentro del límite de la fuente seleccionada.

### Arquitectura

~~~text
                         FUENTES AUX
                            |
          +-----------------+-----------------+
          |                                   |
          v                                   v
   LiFePO4 principal                 Batería interna Dell
          |                                   |
 protección/fusible                  motherboard Dell
          |                                   |
          |                          USB PowerShare / salida
          |                                   |
          |                         protección + aislamiento
          |                                   |
          +--------------+   +----------------+
                         |   |
                         v   v
                SELECTOR DE FUENTE
          break-before-make + reverse blocking
                         |
                         v
                    AUX_RAW_SELECTED
                         |
             wide-input buck/boost
                         |
              BUS AUX NORMALIZADO
                         |
            protecciones / medición
                         |
       +-----------------+------------------+
       |                 |                  |
     ESP32              USB               RF/etc.
       |                 |                  |
     switches normales de cada rama/módulo
~~~

El mismo backplane, fusibles secundarios, medición, TPS2553 y control de módulos se usan independientemente de la fuente elegida.

### No conectar fuentes en paralelo

El objetivo no es sumar la LiFePO4 y el Dell. Debe existir **una sola fuente conductora a la vez**.

El concepto electrónico se llama **power-source selector / power MUX / transfer switch con interbloqueo**. La conmutación debe ser **break-before-make**: primero se abre la fuente actual y sólo después se conecta la otra.

No se implementará un simple empalme de diodos que permita compartir corriente entre fuentes.

### Lógica de seguridad

La lógica deseada a nivel de habilitación es:

| LiFePO4 path | Dell emergency path | Resultado |
|---:|---:|---|
| 0 | 0 | AUX OFF |
| 1 | 0 | AUX desde LiFePO4 |
| 0 | 1 | AUX desde Dell |
| 1 | 1 | ESTADO INVÁLIDO: hardware fuerza ambos OFF |

Esto equivale a una exclusión mutua tipo XOR para los **comandos de los paths**, no necesariamente para la mera presencia física de tensión en ambas entradas.

Ambas fuentes pueden estar físicamente disponibles. El selector/power MUX mantiene sólo un camino conductor y bloquea corriente inversa.

### Control EMERGENCY NOTEBOOK -> AUX

El panel tendrá un control físico protegido, rotulado por ejemplo:

~~~text
EMERGENCY
NOTEBOOK -> AUX
~~~

Estado normal:

~~~text
LiFePO4 path = ON
Dell AUX path = OFF
~~~

Al activar emergencia:

~~~text
1. LiFePO4 AUX path OFF
2. dead-time / confirmación path abierto
3. Dell AUX path ON
4. BUS AUX vuelve a energizarse desde Dell
~~~

Al desactivar emergencia se realiza la secuencia inversa.

La función de exclusión debe existir en hardware; el ESP32 puede supervisar y reportar el estado, pero no será la única protección contra conexión simultánea.

Un selector mecánico 3 posiciones **LiFePO4 / OFF / NOTEBOOK** con contactos break-before-make es una opción muy robusta. Otra opción es implementar el mismo comportamiento con MOSFETs/load switches y un power MUX con control manual e interbloqueo.

### Power MUX

Dispositivos como el TI TPS2121 son referencias útiles porque aceptan dos entradas, incorporan reverse-current blocking, protección y selección manual/automática. El componente definitivo no queda congelado todavía: el TPS2121 llega a unos 4,5 A y debemos dimensionar el selector según la potencia AUX real.

Referencia:
https://www.ti.com/product/TPS2121

## 18. Normalización de tensión

La LiFePO4 y la salida de emergencia del Dell no tienen por qué entregar la misma tensión.

Por tanto, después del selector se utilizará una etapa **buck/boost de amplio rango de entrada**, o se acondicionará cada fuente antes del selector, según resulte más eficiente tras medir el hardware real.

Objetivo conceptual:

~~~text
SOURCE_SELECTED
      |
wide-input DC-DC
      |
BUS AUX estable
      |
protecciones comunes
      |
módulos
~~~

Así las protecciones y la distribución aguas abajo no cambian al cambiar de fuente.

La tensión definitiva del BUS AUX intermedio (5 V, 12 V u otra) queda pendiente del presupuesto de potencia y de los módulos finales.

## 19. Todos los módulos siguen disponibles en emergencia

El modo NOTEBOOK -> AUX no crea una lista fija de cargas permitidas. El usuario decide qué encender con los mismos switches del cyberdeck.

Si se supera la corriente que puede entregar la fuente Dell, la protección de entrada debe limitar/cortar de forma segura. El diseño no prometerá potencia ilimitada.

El Vostro 3405 tiene un USB Type-A 2.0 identificado por Dell como **Charging port** y BIOS con USB PowerShare, pero Dell no documenta en la guía una potencia suficiente para asumir que podrá sostener simultáneamente todas las cargas AUX. Esto se medirá en la unidad real.

## 20. Separación del ramal Dell DC-IN

El ramal que alimenta al propio notebook desde la LiFePO4 queda **fuera del selector AUX**:

~~~text
LiFePO4
   |
   +----> DC-DC 19,5 V / Dell-ID -> DC-IN Dell
   |
   +----> SOURCE A del selector AUX

Dell battery
   |
motherboard / USB PowerShare
   |
SOURCE B del selector AUX
~~~

En modo de emergencia, la salida AUX jamás puede volver hacia el DC-IN del Dell.

Prohibido:

~~~text
Dell battery -> USB -> AUX -> boost 19,5 V -> DC-IN Dell
~~~

## 21. Objetivo de la arquitectura de respaldo

~~~text
NORMAL
LiFePO4 -> Dell
        -> AUX selector -> sistema completo

EMERGENCY
Dell battery -> salida de emergencia
             -> AUX selector
             -> mismo sistema completo
             -> usuario decide módulos con switches
~~~

La diferencia entre NORMAL y EMERGENCY es la **fuente disponible y su potencia máxima**, no qué módulos existen en el bus.
