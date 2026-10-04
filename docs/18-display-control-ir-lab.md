# 18 — Wireless Display Control + IR Lab

## Objetivo

Agregar al cyberdeck capacidad para **controlar a distancia, sin tocar físicamente la TV**, pantallas propias o administradas por el usuario.

Caso inicial: una TV propia usada para mostrar anuncios. El objetivo es poder, desde el cyberdeck y a distancia:

- descubrir la pantalla/reproductor en la red;
- cambiar la fuente o sesión cuando la plataforma lo permita;
- enviar una imagen, vídeo, URL o dashboard;
- controlar volumen/entrada/encendido mediante interfaces remotas autorizadas;
- usar IR como fallback sin tocar la TV;
- registrar qué método funciona para cada equipo.

## Principio de diseño

La solución principal es **inalámbrica / por red**. HDMI físico queda sólo como fallback de laboratorio, no como arquitectura principal.

No existe un método universal para "interceptar cualquier TV": depende del sistema operativo, del reproductor de signage y de los protocolos habilitados. Para una pantalla propia primero se identifica cuál de estas superficies de control existe.

## Rutas de control inalámbrico

### 1. Smart TV / signage por LAN o Wi-Fi

~~~text
Cyberdeck Dell
   |
Wi-Fi / Ethernet
   |
LAN propia
   |
TV / signage player
~~~

Capacidades posibles, según modelo:

- descubrimiento por mDNS / SSDP / servicios del fabricante;
- envío de contenido mediante Cast / DLNA / AirPlay cuando esté soportado;
- API o protocolo remoto del fabricante;
- control del reproductor signage por su panel/API;
- Android/Google TV: control remoto de red y ADB sólo cuando el propietario lo habilite;
- control de navegador/dashboard si el signage carga contenido web.

### 2. Signage player separado

Si la TV sólo muestra la salida de un reproductor dedicado, el objetivo preferido es el **reproductor**, no el panel.

~~~text
Cyberdeck -> LAN propia -> signage player -> TV
~~~

Así se puede cambiar el contenido sin tocar físicamente la TV.

### 3. IR remoto como fallback

Si la TV no expone control de red útil:

~~~text
Cyberdeck / ESP32
   -> LED IR 940 nm
   -> TV
~~~

No requiere tocar la TV, sólo línea de vista.

Sirve para:

- POWER;
- INPUT;
- volumen;
- navegación;
- comandos del control remoto propio.

## IR capture/replay

### Hardware

| Pieza | Cant. | Función |
|---|---:|---|
| receptor IR 38 kHz TSOP38238 / VS1838B | 1–2 | aprender comandos |
| LED IR 940 nm | 2–4 | transmitir comandos |
| 2N2222 / 2N3904 | 1 | driver del LED IR |
| resistencias del kit | varias | base/limitación |
| JST/borne | 1 | módulo desmontable |

El kit comprado ya incluye transistores y resistencias.

### Flujo

~~~text
control remoto propio
   -> receptor IR
   -> ESP32 aprende comando
   -> perfil guardado
   -> LED IR
   -> TV propia
~~~

Perfiles posibles:

~~~text
TV_POWER
TV_INPUT
TV_HOME
TV_UP/DOWN/LEFT/RIGHT
TV_OK
VOLUME_UP
VOLUME_DOWN
~~~

## Display takeover autorizado

Para una TV/signage propia, "takeover" significa **obtener el control del contenido mediante una interfaz que el equipo ya expone y que el propietario administra**.

Flujo de laboratorio:

1. identificar marca/modelo/SO o reproductor;
2. descubrir servicios de red;
3. documentar protocolos disponibles;
4. emparejar/autenticar si corresponde;
5. enviar contenido de prueba;
6. verificar retorno al contenido normal;
7. automatizar desde el cyberdeck.

No se presupone que una técnica válida para una marca sirva en otra.

## Herramientas de software previstas

En el Dell:

- navegador + modo fullscreen/kiosk;
- herramientas mDNS/SSDP;
- Wireshark para observar tráfico de **la red propia**;
- clientes Cast/DLNA/AirPlay cuando corresponda;
- SDK/API oficial del fabricante cuando exista;
- scripts Python para automatización;
- dashboard local del cyberdeck;
- ADB para dispositivos Android propios cuando esté explícitamente habilitado.

## Captura de tráfico del dispositivo propio

En laboratorio se puede observar cómo el control remoto/app oficial habla con la TV o player dentro de una red propia y documentar:

- descubrimiento;
- pairing;
- comandos;
- transporte;
- autenticación.

El objetivo es interoperabilidad con equipos propios, no evadir autenticación de terceros.

## RF sub-GHz opcional

Se contempla CC1101 para laboratorio posterior con dispositivos propios compatibles:

- recepción/transmisión sub-GHz;
- análisis de protocolos sencillos;
- reproducción de señales de código fijo de equipos propios cuando sea técnicamente aplicable.

RTL-SDR permanece como receptor de propósito general.

## Integración con Smart Module Manager

Módulos lógicos:

~~~text
DISPLAY_NET
IR_LAB
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

## Uso autorizado

Diseñado para:

- TVs propias;
- signage propio;
- reproductores administrados por el usuario;
- controles remotos propios;
- redes propias o con autorización;
- equipos RF de laboratorio propios.

La primera estrategia siempre es usar una interfaz remota legítima disponible en el equipo; IR queda como fallback físico sin contacto.
