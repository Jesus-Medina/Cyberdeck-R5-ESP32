# Lilith Explorer V2 — explorador físico por capas

**Versión:** 2026-10-17. Sitio independiente sin build ni dependencias JS. GitHub Pages publica solo `site/`.

## Navegación interactiva

- **Maqueta por pisos:** panel superior, electrónica, energía y base Dell. Selección individual de placas; vista explotada / pisos seleccionables; giro con arrastre y zoom con rueda o botones.
- **Banco real a 3,3 V:** diagrama físico ilustrado de la protoboard con ESP32-S3, INA3221, OLED y 3 resistencias 100 Ω; rutas de prueba con identificación de filas y GPIO.
- **Rutas eléctricas:** muestra la arquitectura propuesta 12 V → fusible → SW0 → XL4015 5 V → ramas TPS2553, supervisor e INA. **Líneas discontinuas = pendientes; líneas continuas = relación I²C/masa validada solo durante la prueba de 3,3 V**.
- Filtro por estado, búsqueda, inspector técnico con ficha, voltajes, conexiones, próximos pasos y enlaces a documentación.
- Placas dibujadas con SVG local: representación técnica del hardware conocido, **NO fotografías reales ni CAD 1:1**.

## Estado: no confundir render con instalación

Probado: ESP32-S3 por USB, OLED SH1106, INA3221 0x40 / 3×100 Ω y ~32,4–32,8 mA por canal.

En inventario pero **sin montar/probar en conjunto**: Mean Well, XL4015, chips TPS2553 SOT23-6 en adaptadores vacíos, seis palancas y seis basculantes.

Pendiente futuro: LiFePO4/BMS/cargador, power-path, DC-DC Dell, reparto completo 5V/12V, RF y LAB.

La representación 3D por niveles es **conceptual**: la asignación física de zonas, huecos, conectores y alturas necesita mediciones internas y la verificación del maletín de 40,6×33×17,4 cm exteriores. Los módulos marcados «comprados» todavía pueden necesitar corroboración de recepción y modelo exacto.

## Publicación

El workflow `.github/workflows/lilith-pages.yml` publica `site/` en GitHub Pages al hacer push a `main`.

URL: https://jesus-medina.github.io/Cyberdeck-R5-ESP32/

Archivos: `index.html`, `styles.css`, `app.js`. Sin telemetría ni acceso a hardware.

Documentos fuente: [estado de banco](../docs/22-lilith-build-status-2026-10-17.md), [netlist V0.1](../docs/20-v0.1-wiring-netlist.md), [energía portátil](../docs/21-portable-power-architecture.md).
