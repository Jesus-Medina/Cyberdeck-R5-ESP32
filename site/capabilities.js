/* LILITH / Capacidades descriptivas, NO evidencia de montaje ni firmware activo. */
(()=>{
 "use strict";
 const categories={all:"Todos",redes:"Redes y seguridad",radio:"Radio",identidad:"NFC e IR",automatizacion:"Automatización",laboratorio:"Instrumentación",energia:"Energía",interfaces:"Interfaces",sistema:"Host"};
 const profiles={};
 const rows=`dell|sistema|Computador principal Linux|Ejecutar herramientas de diagnóstico, captura, investigación autorizada y scripts; placa Dell aún no integrada al maletín.
hub|interfaces|Concentrar periféricos USB|Conectar varias interfaces; requiere hub adecuado y bloqueo de retorno de 5 V.
fan|energia|Ventilación de módulos|Controlar temperatura durante trabajos de campo; circuito auxiliar aún no dimensionado.
battery|energia|Autonomía LiFePO4|Alimentar módulos fuera de red eléctrica; batería, BMS y cargador son futuros.
xl|energia|Convertir 12 V en 5 V|Alimentar lógica y periféricos; regulador comprado, aún sin ajuste y pruebas bajo carga.
tps1|energia|Proteger salida SMART 1|Limitar corriente y detectar fallo eléctrico; chip sin soldar ni ensayar.
tps2|energia|Proteger salida SMART 2|Segunda salida 5 V con control; chip sin soldar ni ensayar.
fuse|energia|Proteger entrada de 12 V|Fusible y jack DC para protección primaria; montaje y rating por confirmar.
mux|energia|Seleccionar fuentes sin retornos|Evitar que el Dell y la batería se alimenten entre sí; multiplexor inexistente.
dcdell|energia|Regular suministro del Dell|Adaptar una alimentación futura a la entrada original; tensión, corriente e ID por estudiar.
lab|laboratorio|Fuente de laboratorio CC/CV|Probar placas con voltaje/corriente limitados; módulo regulable aún no comprado.
esp32|automatizacion|Supervisor y automatización|Leer sensores, registrar eventos, disparar alarmas y secuencias; solo está probada la lectura de INA/OLED a 3,3 V.
ina|laboratorio|Medir tres canales eléctricos|Detectar cambios de consumo y comparar cargas; verificado solo con tres resistencias de banco.
lora|radio|Comunicaciones LoRa|Telemetría de sensores propios y recepción de paquetes compatibles; no es analizador SDR genérico, banda por definir.
sdr|radio|Explorar y analizar espectro recibido|Detección de señales, identificación de bandas y demodulación compatible; RTL-SDR es SOLO receptor, no transmite ni inyecta RF.
cyd|interfaces|Pantalla táctil secundaria|Elegir herramientas, configurar modos y mostrar estado; hardware/interfaz futuros.
uart|interfaces|Consola USB-UART|Leer logs y depurar placas propias; el aislamiento Dell/AUX requiere un ADuM montado.
tca|automatizacion|Multiplexar buses I²C|Gestionar periféricos y EEPROM con direcciones compartidas; sin montar.
gps|radio|Posición y hora GNSS|Georreferenciar registros de campo propios; falta módulo y antena con vista al cielo.
nfc|identidad|Leer y experimentar con NFC|Inventariar etiquetas propias y estudiar emulación soportada por PN532; leer UID NO implica clonar credenciales protegidas.
keyboard|interfaces|Teclado y trackpad portátiles|Operar Linux sin teclado original Dell; fijación por dimensionar.
switches|interfaces|Doce mandos físicos|Gestionar energía y funciones futuras; solo 2 de 12 tienen función V0.1 definida.
oled|interfaces|Mostrar estado del supervisor|Presentar mediciones del banco y futuros avisos; probado a 3,3 V sin integración mecánica.
ports|interfaces|Accesos a señales y periféricos|Centralizar USB, GPIO y bornes arriba; faltan conectores y trazado final.
antenna|radio|Antenas externas plegables en tapa|Optimizar recepción y enlaces propios; banda, SMA/RP-SMA y pérdidas del coax por verificar.
sw0|energia|Corte general AUX|Desconectar la cadena 12 V auxiliar; definido pero no montado.
sw1|energia|Corte de supervisor|Aislar alimentación supervisor 5 V; resolver doble alimentación USB/AUX.
meanwell|energia|Fuente externa de 12 V|Alimentar el circuito auxiliar en pruebas futuras; NO carga LiFePO4.
r1|laboratorio|Carga resistiva CH1|Comprobar medición de 32,8 mA a 3,3 V; es carga de banco, no salida final.
r2|laboratorio|Carga resistiva CH2|Contrastar lectura de ~32,4 mA; es carga de banco.
r3|laboratorio|Carga resistiva CH3|Verificar tercer canal del INA; no representa tercer SMART OUT.
arduino|automatizacion|Control experimental adicional|Ejecutar programas de sensores, pruebas GPIO o automatización local; placa exacta por confirmar.
ue306|redes|Segunda interfaz Ethernet|Separar red de gestión y red de pruebas; captura/diagnóstico de tráfico propio según configuración.
wifilab|redes|Auditoría inalámbrica 802.11|Detectar redes/canales, capturar tramas y probar inyección de tramas solo en laboratorio autorizado; modo monitor e inyección exigen chipset y drivers compatibles, aún no validados.
adum|interfaces|Aislar datos UART|Separar dominios eléctricos Dell y AUX; no funciona hasta soldar y validar ambas alimentaciones.
eeprom|automatizacion|Identificar módulos de expansión|Leer IDs/configuración y automatizar detección de accesorios; falta firmware.
logic|laboratorio|Inspeccionar buses digitales|Depurar I²C, SPI, UART y temporización de placas propias; analizador sin instalar.
rtc|automatizacion|Programar tareas por hora|Añadir reloj y marcas de tiempo si el host no está activo; requiere RTC y batería.
bme|automatizacion|Monitorear ambiente|Registrar temperatura/humedad/presión y disparar alertas; sensor no integrado.
levelshift|interfaces|Adaptar niveles GPIO|Interconectar 3,3 V y 5 V sin dañar chips; conversor bidireccional apropiado por definir.
temp|energia|Detectar sobretemperatura|Avisar o desactivar una carga si sube la temperatura; sensor/umbrales pendientes.
irctrl|identidad|Aprender y emitir infrarrojo|Automatizar mandos compatibles de dispositivos propios; transistores y receptor por integrar.
backplane|energia|Distribuir energía y señales|Conectar protección, supervisión y bornes de módulos; placa aún por diseñar.
smartports|interfaces|Dos puertos inteligentes|Energizar y reconocer hasta dos periféricos por diseño V0.1; conexiones sin montar.
tpsspares|energia|Repuestos de protección|Reserva de TPS2553 para reparación/expansión; NO son canales operativos.
chargepath|energia|Cargar batería futura con seguridad|Gestionar carga LiFePO4 4S con BMS y cargador adecuados; no existe.
regservo|energia|Alimentar actuadores|Separar picos de corriente de servos; fuente dedicada aún por dimensionar.
reg33|energia|Bus protegido de 3,3 V|Suministrar lógica externa con limitación adecuada; no instalado.
aux12|energia|Bus regulado 12 V|Periféricos que requieren esa tensión; no conectar directamente a TPS2553.
pd|interfaces|Negociar alimentación USB-C PD|Energía y conexión compatibles mediante control PD; conector solo no basta.
power_meter|laboratorio|Medir salida variable V/A/W|Comprobar consumo de prototipos; instrumento futuro, no telemetría en vivo.
pc_sense|automatizacion|Detectar estado de encendido Dell|Automatizar avisos y encendido de periféricos; conexión aislada sin diseñar.
fuses_aux|energia|Separar fallos por ramal|Proteger cableado y conexiones; cálculo de fusibles pendiente.
labout|laboratorio|Bornes CC/CV del laboratorio|Conectar circuitos propios a fuente regulada y protegida; sin hardware definido.
labmeter|laboratorio|Mostrar lecturas de fuente LAB|Consultar V/A/W de pruebas; sin integración.
encoder|automatizacion|Navegar menús y ajustar consignas|Perilla para interfaz futura; no cambia corriente por sí misma.
fnirsi|laboratorio|Visualizar formas de onda|Inspeccionar buses, rizado y señales electrónicas de prototipos; compra/cabida no validadas.
gm328|laboratorio|Comprobar componentes pasivos|Identificar resistencias, transistores y condensadores; no es herramienta de red.
gpio|interfaces|Exponer buses y pines seguros|Conectar sensores y microcontroladores propios; proteger niveles y corriente.
usbpanel|interfaces|Exponer puertos de servicio|Conectar dispositivos sin abrir pisos; ruta física pendiente.
networkpanel|redes|Conectar LAN y video del host|Cablear RJ45/HDMI/audio al panel para redes autorizadas; extensores futuros.
irpanel|identidad|Recepción y repetición IR|Aprender códigos compatibles de mandos propios para automatización; no copia cualquier protocolo.
ledpanel|automatizacion|Señalizar eventos y alarmas|LED/buzzer para fallo de rail, temperatura o tareas; circuitos pendientes.
smartout|energia|Dos salidas de 5 V protegidas|Alimentar módulos de prueba con TPS e INA; no existen 12 salidas protegidas.
lcd|interfaces|Pantalla principal Dell 14 pulgadas|Consultar herramientas y datos en tapa; cable eDP y bisagra por verificar.
lidstatus|automatizacion|Indicadores en bisel de LCD|Mostrar alertas/actividad del supervisor; espacio e instalación pendientes.
lidrf|radio|Soportes RF internos de tapa|Desplegar antenas al abrir maletín sin perforarlo; coax/bisagra por medir.
lid_ir|identidad|Zona IR y GNSS en tapa|Reservar sensores de acceso superior si existe hueco; no validado.
dellcooler|sistema|Disipación original del Dell|Enfriar placa principal sin chasis; conservar flujo de aire.
labreserve|laboratorio|Reserva física instrumentos|Estudiar cabida de LCR, osciloscopio y puertos; NO es módulo instalado.`.trim().split("\n");
 rows.forEach(row=>{
  const [id,category,role,use,...rest]=row.split("|");
  if(!id||!categories[category]||!role||!use||rest.length||profiles[id])throw Error("Perfil inválido: "+id);
  profiles[id]={category,role,use};
 });
 window.LILITH_CAPABILITIES={categories,profiles};
})();
