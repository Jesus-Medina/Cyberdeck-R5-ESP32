# 04 — Lista de materiales (BOM)

Los precios son rangos de planificación, no cotizaciones definitivas.

## Fase 0 — Ya incluido con el notebook

- motherboard Ryzen 5 3450U;
- RAM;
- SSD M.2 256 GB;
- pantalla;
- batería y BMS;
- cargador;
- cooler/heatpipe;
- Wi‑Fi/Bluetooth;
- parlantes;
- botón power/daughterboards;
- webcam/micrófono si se decide reutilizarlos.

## Fase 1 — Supervisor mínimo

| Componente | Cantidad | Uso | Rango aprox. CLP |
|---|---:|---|---:|
| ESP32 DevKit o ESP32-S3 USB-C | 1 | Supervisor/GPIO | 7.000–15.000 |
| OLED 1.3" I²C | 1 | Estado | 3.000–6.000 |
| Switches de panel | 6–10 | Controles | 6.000–15.000 |
| Pulsadores | 2–4 | Power/macros/reset | 3.000–6.000 |
| Optoacoplador/módulo aislado | 1 | Simular power | 2.000–5.000 |
| MOSFET/load switches | 4–8 canales | Control de cargas | 5.000–15.000 |
| Cableado + JST/Dupont | lote | Interconexión | 8.000–15.000 |
| Perfboard/PCB distribución | 1 | Organización | 3.000–8.000 |
| Fusibles/portafusibles | lote | Protección | 3.000–8.000 |

## Fase 2 — USB y panel

| Componente | Uso | Rango aprox. CLP |
|---|---|---:|
| Hub USB 3.x alimentado | Backbone USB | 15.000–35.000 |
| Extensiones USB-A panel | Puertos externos | 8.000–15.000 |
| USB-C panel | Servicio/expansión | 3.000–8.000 |
| RJ45 panel | Ethernet | 5.000–10.000 |
| Audio panel | Auriculares/mic | 2.000–5.000 |
| Conectores SMA panel | SDR/antenas | 4.000–10.000 |

## Fase 3 — Radio / navegación / instrumentación

| Componente | Función | Rango aprox. CLP |
|---|---|---:|
| RTL-SDR | Recepción SDR | 20.000–35.000 |
| Antena SDR | Recepción | 5.000–20.000 |
| GPS | Posición/tiempo | 8.000–20.000 |
| LoRa | Radio digital/telemetría | 15.000–40.000 |
| ESP32 CYD | Pantalla secundaria táctil | 12.000–25.000 |
| Osciloscopio portátil/USB | Medición | 25.000–50.000 |
| GM328A o tester similar | Componentes | 15.000–25.000 |

## Fase 4 — Mecánica

- maleta/carcasa;
- placa frontal;
- separadores M2/M3;
- tornillería;
- rejillas;
- filtros;
- bisagras si aplica;
- impresión 3D o panel CNC/acrílico;
- adhesivos/rotulación.

No comprar la carcasa definitiva hasta medir el notebook desmontado.
