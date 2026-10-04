# 18 — Display Control + IR Lab

## Objetivo

Agregar al cyberdeck una capacidad de laboratorio para **controlar y reemplazar el contenido mostrado en pantallas propias o autorizadas**, además de capturar/reproducir comandos infrarrojos de controles remotos propios.

El caso de uso inicial es una TV propia utilizada para mostrar anuncios.

## Arquitectura recomendada para la TV

No intentamos "secuestrar" inalámbricamente la imagen de la TV. La forma robusta y controlable es insertar el cyberdeck en la ruta de vídeo:

~~~text
Reproductor de anuncios ---- HDMI IN 1
                              \
                               > HDMI SWITCH 2x1 --> TV
                              /
Cyberdeck Dell HDMI -------- HDMI IN 2
~~~

Con esto:

- modo normal: la TV muestra el reproductor de anuncios;
- modo cyberdeck: cambiamos el switch a HDMI IN 2;
- el Dell muestra una imagen, vídeo, dashboard o mensaje a pantalla completa;
- al terminar, volvemos a HDMI IN 1.

La conmutación puede hacerse:

1. manualmente;
2. enviando al switch el mismo comando IR de su control;
3. en una versión posterior, mediante GPIO/relé sobre los contactos del pulsador del switch;
4. mediante HDMI-CEC si se integra hardware compatible.

## IR capture/replay

Para controles remotos propios se añade un pequeño laboratorio IR.

### Hardware

| Pieza | Cant. | Función |
|---|---:|---|
| receptor IR 38 kHz TSOP38238 / VS1838B | 1–2 | capturar comandos |
| LED IR 940 nm | 2–4 | transmitir comandos |
| transistor 2N2222 / 2N3904 | 1 | driver del LED IR |
| resistencias del kit | varias | base/limitación de corriente |
| conector JST/borne | 1 | módulo desmontable |

El kit ya comprado contiene 2N2222/2N3904 y resistencias, por lo que sólo faltaría comprar el receptor IR y los LED IR si no vienen en otro kit.

### Flujo

~~~text
control remoto propio
    -> receptor IR 38 kHz
    -> ESP32 registra protocolo/comando
    -> comando guardado
    -> ESP32 + transistor
    -> LED IR 940 nm
    -> TV / switch HDMI propio
~~~

El ESP32 puede guardar perfiles como:

~~~text
TV_POWER
TV_INPUT
HDMI_SWITCH_1
HDMI_SWITCH_2
VOLUME_UP
VOLUME_DOWN
~~~

## Cambio de imagen

La imagen no se "clona" por IR. IR sólo controla la TV o el switch.

El contenido se genera en el Dell:

- imagen PNG/JPEG;
- vídeo;
- navegador en fullscreen;
- dashboard web;
- presentación;
- reproductor signage propio.

El Dell entrega esa imagen por HDMI al switch.

## Captura HDMI opcional

Puede añadirse una capturadora USB HDMI para **visualizar/registrar una fuente HDMI propia** dentro del Dell.

~~~text
fuente HDMI propia -> splitter/capture -> USB Dell
~~~

No es necesaria para simplemente sustituir la imagen de la TV.

## RF sub-GHz opcional

Para un laboratorio posterior de señales propias se contempla **CC1101** como módulo P2/P3:

- recepción/transmisión sub-GHz compatible;
- análisis de protocolos sencillos;
- capture/replay de dispositivos propios de código fijo;
- no sustituye a un SDR de transmisión universal.

El RTL-SDR sigue siendo sólo de recepción.

## Integración con Smart Module Manager

Posibles módulos:

~~~text
IR_LAB
DISPLAY_CONTROL
HDMI_CAPTURE
SUBGHZ_LAB
~~~

Estados:

~~~text
ABSENT
PRESENT_OFF
POWERED
ONLINE
ACTIVE
FAULT
~~~

## Seguridad/uso autorizado

Estas funciones se diseñan para:

- TVs propias;
- switches HDMI propios;
- controles remotos propios;
- displays/signage administrados por el usuario;
- dispositivos RF de laboratorio o con autorización.

La vía recomendada para cambiar contenido de una pantalla es controlar su fuente de vídeo o su entrada, no interferir con emisiones de terceros.
