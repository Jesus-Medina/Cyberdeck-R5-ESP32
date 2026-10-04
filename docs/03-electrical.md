# 03 — Alimentación y protección

## Alimentación principal

Mantener intacto el sistema original:

```text
Cargador Dell -> motherboard/BMS Dell -> batería Dell -> motherboard
```

No se propone abrir el pack ni conectarse directamente a sus celdas.

## Alimentación del supervisor

Hay dos opciones:

### Opción A — ESP32 desde USB del PC

Más simple, pero el supervisor se apaga cuando el PC queda completamente sin energía.

### Opción B — batería auxiliar para supervisor

Una pequeña batería protegida independiente puede mantener:

- ESP32;
- OLED;
- RTC/sensores;
- lógica de switches.

Esta batería debe tener su propio módulo de carga/protección adecuado. No se recomienda improvisar packs multicelda.

## Árbol de alimentación auxiliar propuesto

```text
Entrada auxiliar regulada
        |
      Fusible
        |
    +---+------------------+
    |                      |
   5 V                    3.3 V
    |                      |
  Hub/USB            ESP32/sensores
    |
 +--+-------+-------+
 |          |       |
SDR        GPS     AUX
```

## Control de cargas

Un GPIO del ESP32 no debe alimentar directamente un SDR, GPS, luces o hub.

```text
GPIO ESP32 -> driver -> MOSFET/load switch -> periférico
```

Para cargas USB conviene usar módulos de power-switch o MOSFET high-side pensados para 5 V.

## Protecciones recomendadas

- fusible general de accesorios;
- fusibles o polyfuse por grupos;
- protección contra polaridad en líneas DIY;
- cable con sección adecuada;
- conectores polarizados;
- termorretráctil;
- etiquetas;
- puntos de masa bien definidos.

## Mediciones a realizar antes de integrar

1. tensión nominal del cargador Dell;
2. consumo del notebook en reposo y carga;
3. corriente disponible en USB;
4. consumo del hub;
5. consumo del SDR;
6. consumo del ESP32 + pantallas;
7. temperatura de VRM/CPU dentro de la carcasa.

## Refrigeración

Conservar:

- heatpipe original;
- ventilador original;
- disipadores originales;
- trayectoria de aire.

La carcasa debe incluir entrada y salida de aire equivalentes o mejores que las del notebook original.
