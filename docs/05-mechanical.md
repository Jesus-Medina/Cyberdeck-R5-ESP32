# 05 — Diseño mecánico

## Principio

La carcasa se diseña **después** de desmontar y medir el notebook real.

Medir y registrar:

- ancho/alto de motherboard;
- posición de puertos;
- volumen del cooler;
- tamaño de batería;
- tamaño de pantalla y marco;
- recorrido del cable eDP;
- daughterboards;
- botón power;
- parlantes;
- antenas Wi‑Fi.

## Distribución conceptual

### Tapa

```text
+------------------------------------------+
|                                          |
|             LCD DELL 14"                 |
|                                          |
+------------------------------------------+
```

### Base

```text
+------------------------------------------+
| OLED | AUX DISPLAY | VOLT | SDR STATUS  |
|------------------------------------------|
|                                          |
|         teclado / zona de trabajo        |
|                                          |
|------------------------------------------|
| MASTER  SDR  GPS  RADIO  GPIO  AUX      |
|                                          |
| USB-A USB-A USB-C RJ45 AUDIO SMA        |
+------------------------------------------+
```

## Interior

Separar físicamente:

1. zona PC y refrigeración;
2. zona batería original;
3. zona señal/radio;
4. zona alimentación auxiliar;
5. zona microcontroladores.

Evitar colocar convertidores DC ruidosos pegados al RTL-SDR y a la antena.

## Refrigeración

El aire debe entrar por una zona limpia y salir directamente por el radiador original. No recircular aire caliente dentro de la caja.

## Panel frontal

Cada conector debe estar etiquetado. Recomendación de grupos:

- COMPUTE: USB-A / USB-C / RJ45;
- RADIO: SMA / SDR;
- CONTROL: MASTER / AUX / GPIO;
- SERVICE: programación ESP32 / reset;
- POWER: carga original Dell y entrada auxiliar si existe.
