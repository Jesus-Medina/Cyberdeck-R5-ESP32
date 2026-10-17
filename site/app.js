(()=>{
"use strict";
/* Lilith Explorer 3.0: 3D projected geometry on Canvas 2D. Board art is conceptual, not CAD.
   Verified bench relations are separated from not-yet-built AUX power connections. */
const $=id=>document.getElementById(id),canvas=$("scene"),g=canvas.getContext("2d");
const capabilityData=window.LILITH_CAPABILITIES||{categories:{all:"Todos"},profiles:{}};
const capabilityProfiles=capabilityData.profiles;
if(!g){$("sceneInfoText").textContent="Este navegador no admite el visor Canvas 2D.";return;}
const colors={tested:"#ca9b7d",owned:"#c1a17b",planned:"#8998a2",power:"#d0a17b",i2c:"#b5a3a1",ground:"#91a8b3"};
const docs="https://github.com/Jesus-Medina/Cyberdeck-R5-ESP32/blob/main/docs/";
const levels=[["base","04 · PLACA DELL + DISIPACIÓN"],["power","03 · ENERGÍA INTERNA"],["electronics","02 · ELECTRÓNICA INTERNA"],["panel","01 · PANEL OPERATIVO"],["lid","TAPA · PANTALLA Y FRANJAS OPERATIVAS"]];
const raw=[
["dell","Placa madre Dell Vostro 3405","base","owned","motherboard",[-3.5,-2.3,6.9,4.4],"Conector original y alimentación independiente","USB/HDMI/red por extensiones de panel","Solo placa madre Dell Ryzen 5 3450U, 12 GB RAM y SSD 256 GB más conjunto disipador/ventilador. No se conserva teclado, touchpad ni carcasa/palmrest del notebook; la placa desnuda debe medirse antes de mecanizar.","Medir contorno, anclajes, aireación y puertos de la placa sin inventar su tamaño.","dellcooler,lcd,keyboard"],
["hub","Hub USB","base","planned","usb",[3.5,-2.3,1.0,1.1],"USB 5 V (por medir)","USB Dell","Hub futuro con protección frente a retorno de corriente. No se ha probado.","Seleccionar hub y validar VBUS.","dell,sdr"],
["fan","Ventilación AUX","base","planned","fan",[3.5,.55,1.0,1.0],"5/12 V según equipo","Control térmico","No existe ventilación auxiliar validada. El ventilador del Dell se conserva.","Ensayar temperatura dentro del maletín sin perforarlo.","dell,esp32"],
["battery","LiFePO4 4S","power","planned","battery",[-4.1,-2.5,3.0,2.0],"12,8 V nominal","BMS / fusible / cargador","Pack futuro no comprado; tamaño, capacidad y ubicación aún por decidir.","Dimensionar Wh, BMS y cargador.","mux,dcdell"],
["xl","XL4015 CC/CV","power","owned","xl",[-.6,-2.3,2.1,1.55],"12 V entrada; 5,00 V objetivo","IN± OUT±","Buck comprado y físicamente disponible, NO probado con la Mean Well ni ajustado todavía.","Ajustar 5 V sin ESP32 conectado; probar con resistencias 10 W.","meanwell,fuse,tps1,tps2"],
["tps1","TPS2553 / Canal 1","power","owned","tps",[1.85,-2.3,1.1,1.05],"5 V protegidos (objetivo)","EN / FAULT / ILIM / CH1","Chip SOT-23-6 aún SIN SOLDAR a su adaptador. No protege todavía una salida real.","Practicar SMD; inspeccionar cortos y probar protección.","xl,ina,tps2"],
["tps2","TPS2553 / Canal 2","power","owned","tps",[3.2,-2.3,1.1,1.05],"5 V protegidos (objetivo)","EN / FAULT / ILIM / CH2","Segundo chip SOT-23-6 sin montar ni ensayar.","Soldar adaptador y validar FAULT y límite de corriente.","xl,ina,tps1"],
["fuse","Fusible / jack DC","power","owned","fuse",[-4.1,.15,1.25,1.05],"12 V / fusible 2 A en V0.1","Fuente externa a SW0","Fusible lento 5×20 y jack registrados. Cadena de seguridad sin ensamblar.","Verificar pinout, polaridad y ratings DC.","meanwell,sw0,xl"],
["mux","Selector AUX seguro","power","planned","generic",[-2.3,.13,1.7,1.2],"Dell USB / LiFePO4 (pendiente)","Selección sin retorno","Se planifica conmutación break-before-make y bloqueo inverso. No está implementada.","Medir salida USB del Dell sin asumir potencia ilimitada.","battery,dcdell"],
["dcdell","DC-DC Dell","power","planned","generic",[-.35,.13,1.6,1.2],"Por verificar con cargador Dell","Conector e ID","Conversor independiente para alimentar la entrada normal del Dell, no comprado.","Identificar V/A/W y pin de identificación.","dell,battery"],
["lab","Fuente LAB variable","power","planned","generic",[2.15,.13,2.0,1.2],"CC/CV variable (por definir)","Bornes / medidor V-A-W","Fuente de laboratorio planificada, distinta del XL4015 fijo a 5 V.","Dimensionar rangos y protección por salida.","ports"],
["esp32","ESP32-S3 N16R8","electronics","tested","esp32",[-3.85,-2.4,2.25,1.38],"3,3 V desde USB (prueba)","GPIO8 SDA / GPIO9 SCL","Placa UICPAL REV1.2 funcionando por USB con OLED e INA3221. Aún no alimentada por el XL4015.","Subir sketch .ino y evitar doble alimentación USB/5 V.","ina,oled,sw1"],
["ina","INA3221 / R100","electronics","tested","ina",[-1.08,-2.42,2.1,1.35],"3,3 V banco real","I²C 0x40 / A0 soldado GND","Placa morada con tres shunts R100. Corrientes ~32,8 mA CH1 y ~32,4 mA CH2 y CH3.","Integrar CH1/CH2 en salidas protegidas de 5 V, CH3 para supervisor.","esp32,oled,tps1"],
["lora","LoRa","electronics","owned","lora",[1.65,-2.38,1.28,1.08],"Según placa","SPI/UART + RF","Módulo previsto en compras, aún no probado; banda y antena específicas pendientes.","Confirmar módulo y banda RF.","antenna,esp32"],
["sdr","RTL-SDR","electronics","planned","usb",[3.23,-2.36,1.12,1.0],"USB 5 V","USB Dell + antena","Receptor SDR planificado, todavía sin integración ni medidas.","Medir consumo y alejamiento de convertidores.","hub,antenna"],
["cyd","Pantalla ESP32 CYD","electronics","planned","screen",[-3.95,-.30,1.8,1.35],"Según placa CYD","Pantalla auxiliar táctil","Sistema secundario previsto; no forma parte del ensayo validado.","Medir modelo y dimensiones.","esp32"],
["uart","CP2102 / ADuM1201","electronics","owned","generic",[-1.9,-.25,1.5,1.2],"Dos dominios aislados","UART Dell↔AUX","Aislador SMD aún no soldado ni probado. No unir GND Dell y GND AUX.","Soldar adaptador SOP8 y comprobar aislamiento.","dell,esp32"],
["tca","TCA9548A / 24C02","electronics","owned","generic",[-.02,-.25,1.5,1.2],"Lógica 3,3 V","I²C IDs de módulos","Multiplexor y EEPROM registrados para identificación, aún sin prueba.","Soldar memorias e identificar direcciones.","esp32"],
["gps","GNSS / GPS","electronics","planned","generic",[1.85,-.24,1.1,1.0],"Por verificar","USB/UART","Módulo de geolocalización por decidir.","Seleccionar conector y antena.","antenna"],
["nfc","NFC PN532","electronics","planned","generic",[3.24,-.24,1.12,1.0],"Según breakout","I²C o SPI","Lector NFC previsto para etiquetas propias, sin montaje.","Comprobar nivel lógico.","esp32"],
["keyboard","Teclado BT + trackpad","panel","owned","keyboard",[-3.32,-.22,6.45,2.3],"Batería del teclado","Bluetooth Dell","Teclado plegable con Ñ previsto. Sus dimensiones exactas dentro del panel no están validadas.","Medir apertura y altura de cierre.","dell,switches"],
["switches","12 interruptores","panel","owned","switches",[-3.9,-2.7,5.3,1.23],"Rating DC pendiente","6 palancas + 6 basculantes","Comprados 6 SPST y 6 basculantes. SW0/SW1 son dos de sus funciones, NO hay 12 canales protegidos.","Identificar contactos/rating y asignar controles.","sw0,sw1,tps1"],
["oled","OLED SH1106 1,3″","panel","tested","oled",[1.72,-2.67,1.25,1.08],"3,3 V","I²C 0x3C, GPIO8/9","Pantalla física probada. En el dibujo se sitúa en el panel futuro, sin instalación mecánica validada.","Mejorar menús y montaje accesible.","esp32,ina"],
["ports","Panel USB / GPIO","panel","planned","ports",[3.28,-2.7,1.28,2.15],"Carriles diversos, por proteger","USB, GPIO, LAB","Conectores futuros; cantidad y posición todavía no definidos.","Dimensionar salidas y separarlas por voltaje.","lab,switches"],
["antenna","Antenas RF","panel","owned","antenna",[-4.02,.75,.80,1.42],"Pasivas","SMA / RP-SMA","Compradas. Deben quedar dentro del maletín cerrado, sin sobresalir.","Verificar conectores y compatibilidad.","lora,sdr"],
["sw0","SW0 MASTER AUX","panel","owned","switch",[0,0,.4,.4],"Corte AUX 12 V","Fusible → SW0 → XL4015","Función de uno de los interruptores comprados. Sin cablear.","Comprobar rating y continuidad antes de montar.","switches,fuse,xl"],
["sw1","SW1 SUPERVISOR","panel","owned","switch",[0,0,.4,.4],"Corte alimentación supervisor","Bus 5 V → SW1 → CH3","Función pendiente de un switch comprado. Sin cablear.","Proteger de doble alimentación USB/AUX.","switches,esp32"],
["meanwell","Mean Well 12 V / 5 A","external","owned","adapter",[0,0,1,.7],"12 V nominal / 5 A","Jack DC de banco","Fuente externa que ya tienes. No va dentro del maletín ni carga la LiFePO4.","Medir la salida antes de conectar XL4015.","fuse,xl"],
["r1","Resistencia CH1 / 100 Ω","bench","tested","resistor",[0,0,.7,.3],"3,17 V / 32,8 mA","VIN1− a GND","Carga independiente de ensayo 3,3 V, resistencia ¼ W.","No usar a 5 V continuo.","ina"],
["r2","Resistencia CH2 / 100 Ω","bench","tested","resistor",[0,0,.7,.3],"3,17 V / 32,4 mA","VIN2− a GND","Segunda carga independiente, retorno por riel GND.","En V0.1 definitiva CH2 medirá Smart Out 2.","ina"],
["r3","Resistencia CH3 / 100 Ω","bench","tested","resistor",[0,0,.7,.3],"3,17 V / 32,4 mA","VIN3− a GND","Tercera carga independiente, fila 45/40.","En V0.1 definitiva CH3 se reserva supervisor.","ina"]
];

// Inventario ampliado según BOM maestra y bitácora. Una ficha por módulo físico o conjunto identificable.
// POSICIONES DEL VISOR SON ILUSTRATIVAS: NO están medidas ni deben utilizarse para fabricar paneles.
const expandedParts=[
["arduino","Arduino de laboratorio","electronics","owned","arduino",[],"USB / 5 V según placa","USB Dell + GPIO","Arduino existente registrado para experimentos; modelo físico por identificar.","Identificar modelo, patillaje y dimensiones.","dell,gpio,levelshift"],
["ue306","TP-Link UE306 / LAN 2","electronics","owned","ethernet",[],"USB 3.0","Ethernet RJ45 / USB","Adaptador LAN2 señalado como disponible en la BOM; integración física por confirmar.","Verificar unidad y enlace Linux.","hub,networkpanel,dell"],
["wifilab","Wi-Fi USB de laboratorio","electronics","planned","wifi",[],"5 V USB por verificar","USB / antenas RP-SMA","Adaptador Wi-Fi independiente para laboratorio autorizado; modelo exacto por elegir, no acreditado como comprado.","Elegir chipset con soporte Linux y medir potencia.","hub,antenna,ue306"],
["adum","ADuM1201 / aislamiento UART","electronics","owned","chip",[],"Dominios Dell y AUX aislados","UART / GND separados","5 IC registrados; uno previsto para aislamiento serial, todavía sin montaje y pruebas.","Montar en adaptador SOIC8 y comprobar aislamiento.","uart,esp32,dell"],
["eeprom","EEPROM 24C02 / IDs","electronics","owned","chip",[],"3,3 V lógica","I²C mediante TCA9548A","Memorias registradas para identificar dos Smart Slots; llegada individual sin verificar.","Verificar dirección I²C y montar en breakout.","tca,smartports"],
["logic","Analizador lógico USB 8 canales","electronics","planned","logic",[],"USB del Dell","GPIO / UART / I²C / SPI","Instrumento de laboratorio previsto, sin referencia de compra confirmada.","Definir referencia y salida accesible de señales.","dell,gpio,arduino"],
["rtc","RTC DS3231","electronics","planned","rtc",[],"3,3/5 V según breakout","I²C","Reloj de tiempo real previsto; no consta prueba ni compra.","Elegir breakout y batería RTC adecuada.","esp32,tca"],
["bme","BME280 ambiental","electronics","planned","sensor",[],"3,3 V","I²C / temperatura / presión / humedad","Sensor ambiental propuesto para el supervisor; no instalado.","Elegir módulo compatible con lógica 3,3 V.","esp32,tca"],
["levelshift","Conversión de niveles GPIO","electronics","planned","chip",[],"3,3 V ↔ 5 V","GPIO / I²C","Conversores de nivel previstos para periféricos externos; no ensamblados.","Definir líneas que realmente requieren conversión.","gpio,arduino,esp32"],
["temp","Sensor térmico de potencia","electronics","planned","sensor",[],"Según referencia","Termometría DC/DC","Sensor previsto cerca del buck y de la potencia, aún sin hardware seleccionado.","Medir temperatura de XL4015 antes de decidir montaje.","xl,fan,esp32"],
["irctrl","Driver IR / transistores","electronics","planned","ir",[],"3,3/5 V según circuito","LED IR y receptor","Transistores del kit disponibles; driver IR todavía no construido.","Probar LED IR y receptor con cargas apropiadas.","irpanel,esp32"],
["backplane","Backplane de distribución AUX","power","planned","backplane",[],"12 V entrada / 5 V salida V0.1","Buses protegidos + señales","PCB de distribución smart pendiente; V0.1 se ensaya antes sobre protoboard y placa perforada.","Validar 2 salidas TPS y las pistas de potencia.","xl,smartports,tps1,tps2"],
["smartports","Smart Module Ports 1 y 2","power","planned","ports",[],"5 V protegidos / 3V3_ID","EN / FAULT / I²C / UART","Dos puertos lógicos de V0.1 pendientes. No son dos dispositivos conectados ni dos salidas adicionales.","Congelar conectores y corriente antes de soldar.","tps1,tps2,eeprom,tca"],
["tpsspares","TPS2553 ×3 / reserva","power","owned","chip",[],"5 V solamente","SOT-23-6 / EN / FAULT","Tres TPS2553 adicionales registrados como repuesto o futura expansión; no están instalados.","Probar cada chip con adaptador y carga segura.","tps1,tps2"],
["chargepath","Cargador LiFePO4 + power-path","power","planned","regulator",[],"Para pack 4S compatible","Carga separada del Dell","Sistema futuro de carga y uso simultáneo, no comprado ni conectado. Mean Well 12 V no es cargador LiFePO4.","Seleccionar BMS y cargador por especificación real.","battery,mux"],
["regservo","Rail servo 5–6 V","power","planned","regulator",[],"5–6 V y corriente por definir","Headers servo / AUX","Regulación dedicada para cargas con picos de corriente; fuera de los TPS de ~1 A.","Dimensionar picos de los servos previstos.","labout,backplane"],
["reg33","Rail 3,3 V protegido","power","planned","regulator",[],"3,3 V","Sensores / GPIO externo","Rail independiente de lógica para expansiones, no ensamblado.","Diseñar protección y margen de corriente.","backplane,levelshift"],
["aux12","Rail 12 V regulado","power","planned","regulator",[],"12 V regulados","Ventiladores / periféricos","Carril final opcional; no se conecta directamente a TPS2553 de 5 V.","Justificar cargas y regular tensión de batería variable.","battery,fan"],
["pd","USB-C Power Delivery","power","planned","usb",[],"Según negociación PD","USB-C PD","Módulo PD propuesto; sin circuito de negociación ni protección validados.","Elegir entrada/salida PD compatible y protegida.","backplane,hub"],
["power_meter","Medición V/A/W de fuente LAB","power","planned","meter",[],"Según módulo regulable","Medición de salida CC/CV","Indicador eléctrico futuro, independiente de los datos históricos del INA3221.","Seleccionar medidor y rango de tensión/corriente.","lab,labmeter"],
["pc_sense","Detección PC_PWR_SENSE","power","planned","sensor",[],"Aislamiento alta impedancia","Estado de energía Dell","Función lógica futura para detectar Dell encendido sin unir masas.","Validar nivel seguro, opto y aislamiento.","adum,dell,esp32"],
["fuses_aux","Fusibles y bornes por salida","power","owned","fuse",[],"Ratings por verificar","5×20 / KF301 / bornes","Portafusibles, fusibles, terminales y borneras registrados; todavía no ensamblados.","Comprobar polaridades y rating DC antes de conexión.","fuse,backplane"],
["labout","Salida CC/CV universal","power","planned","ports",[],"Ajustable, rango sin definir","Bornes + bananas + interruptor","Salida protegida del futuro módulo LAB; no equivale al XL4015 fijo de 5 V.","Definir buck-boost, protección y conector.","lab,smartout"],
["labmeter","Display de fuente LAB","panel","planned","meter",[],"Según medidor","V / A / W","Indicador visible de la fuente regulable variable, aún por seleccionar.","Alinear con la salida LAB y controles.","lab,power_meter"],
["encoder","Encoder y control LAB","panel","planned","encoder",[],"GPIO según placa","Perilla / salida CC/CV","Control giratorio futuro para ajustar la fuente LAB; aún sin montaje.","Seleccionar encoder compatible.","lab,labmeter"],
["fnirsi","Osciloscopio FNIRSI-138 Pro","panel","planned","scope",[],"Según instrumento","Sondas y pantalla","Osciloscopio de laboratorio planificado; sin compra confirmada.","Medir modelo definitivo y reservar acceso a puntas.","gpio,logic"],
["gm328","GM328A / comprobador LCR","panel","planned","tester",[],"Según instrumento","Zócalo ZIF","Medidor de componentes previsto, con zócalo accesible. No hay prueba física confirmada.","Elegir GM328A/LCR-T7 y medir volumen.","gpio,fnirsi"],
["gpio","Panel GPIO / I²C / SPI / UART","panel","planned","ports",[],"3,3/5 V separados","Bornes / headers etiquetados","Panel interno de laboratorio previsto; no hay pinout mecánico definitivo.","Separar los niveles de tensión y proteger señales.","arduino,esp32,logic"],
["usbpanel","Puertos USB-A / USB-C de panel","panel","planned","usb",[],"USB 5 V según puerto","USB 3 / USB-C servicio","Extensiones de servicio internas previstas, sin cantidad final ni backfeed probado.","Definir rutas USB y fijación sin perforar la caja.","hub,ue306,esp32"],
["networkpanel","Panel HDMI / LAN / audio","panel","planned","ethernet",[],"Datos; cada interfaz independiente","HDMI / RJ45 / jack 3,5 mm","Conectores pasivos internos de servicio, pendientes de selección; no son un bus eléctrico común.","Elegir extensores aptos para alta velocidad.","ue306,dell"],
["irpanel","Módulo infrarrojo RX/TX","panel","planned","ir",[],"LED 940 nm / RX 38 kHz","Control de equipos propios","Receptor y emisor IR previstos para laboratorio autorizado, no integrados.","Probar emisor con driver y receptor antes de montar.","irctrl,esp32"],
["ledpanel","LEDs de estado y buzzer","panel","planned","leds",[],"Según GPIO y resistencias","Indicadores / alarmas","LEDs y buzzer propuestos; parte del kit pasivo registrado, sin montaje del panel.","Definir señalización de fault, rail y actividad.","esp32,sw1"],
["smartout","SMART OUT 1 / 2 + bananas LAB","panel","planned","ports",[],"5 V CH1/CH2; LAB separado","Bornes / salidas rotuladas","Salidas futuras separadas: dos canales TPS para V0.1 y bornes de fuente LAB para V1.","No confundir 2 salidas de 5 V con 12 interruptores.","smartports,labout"]
];
raw.push(...expandedParts);
// Mover fichas existentes a la bandeja donde se consultarán (ubicación aún sin validar).
for(const [id,floor] of [["cyd","panel"],["hub","electronics"],["antenna","lid"]]){
 const row=raw.find(r=>r[0]===id);if(row)row[2]=floor;
}
for(const [id,name,details] of [
 ["uart","CP2102 USB-UART","El CP2102 registrado se usa del lado Dell; el aislamiento ADuM1201 se representa por separado, sin ensamblar."],
 ["tca","Multiplexor I²C TCA9548A","TCA9548A registrado para separar dos EEPROM 24C02 por canal; todavía sin montaje/pruebas."],
 ["ports","Panel de interfaces AUX","Conectores futuros de servicio; posición y cantidad sin validar físicamente."]
]){const row=raw.find(r=>r[0]===id);if(row){row[1]=name;row[8]=details;}}
const floorRows={
 electronics:[
 ["esp32","ina","arduino","lora","sdr"],
 ["ue306","wifilab","gps","nfc","uart"],
 ["adum","tca","eeprom","logic","rtc"],
 ["bme","levelshift","hub","temp","irctrl"]
 ],
 power:[
 ["battery","xl","tps1","tps2","fuse"],
 ["mux","dcdell","lab","backplane","smartports"],
 ["tpsspares","chargepath","regservo","reg33","aux12"],
 ["pd","power_meter","pc_sense","fuses_aux","labout"]
 ],
 panel:[
 ["switches","oled","cyd","labmeter","encoder"],
 ["fnirsi","gm328","gpio","ports","antenna"],
 ["usbpanel","networkpanel","irpanel","ledpanel","smartout"]
 ]
};
for(const [floor,rows] of Object.entries(floorRows)){
 rows.forEach((row,ri)=>row.forEach((id,ci)=>{
  const entry=raw.find(r=>r[0]===id);
  if(!entry)throw Error("Ficha sin geometría: "+id);
  entry[2]=floor;
  entry[5]=[-4.70+ci*1.93,-3.04+ri*1.51,1.70,1.17];
 }));
}
raw.find(r=>r[0]==="keyboard")[5]=[-4.50,1.69,8.97,1.27];
raw.find(r=>r[0]==="dell")[5]=[-4.75,-2.68,8.05,5.32];
raw.find(r=>r[0]==="fan")[5]=[3.57,-2.44,1.18,1.12];
// El Dell no tiene chasis/teclado/touchpad en el montaje final: placa + refrigeración en base.

// Arquitectura operativa: tapa/pantalla + panel de mando (únicas superficies de uso normal).
raw.push(
 ["lcd","LCD Dell de 14 pulgadas","lid","owned","lcd",[],"Desde placa madre Dell","Cable LCD/eDP original por verificar","Se conserva la pantalla del Dell como módulo separado, a situar en la tapa. Ubicación y cable por validar; no se considera montada todavía.","Medir marco/panel LCD y comprobar cable y giro de bisagra.","dell,keyboard,lidstatus"],
 ["lidstatus","Indicadores alrededor de la pantalla","lid","planned","leds",[],"Lógica 3,3 V protegida","LED de estado / advertencia","Franja disponible alrededor del LCD reservada para indicadores visibles al abrir la tapa; tamaños y profundidad reales por medir.","No tapar panel LCD ni anclajes de bisagra.","esp32,lcd,ledpanel"],
 ["lidrf","Zona RF accesible junto a la pantalla","lid","planned","antenna",[],"RF pasiva, sin rail de potencia","SMA/RP-SMA independientes; coaxial corto","Bases plegables e interfaces RF orientadas hacia espacio despejado cuando el maletín esté ABIERTO. No perforar carcasa ni encerrar antenas detrás del LCD o masa metálica.","Medir espacio y verificar cable coax, pérdidas, polarización y separación RF.","antenna,lora,sdr,wifilab,gps"],
 ["lid_ir","IR / antena GNSS / ampliación tapa","lid","planned","ir",[],"Según módulo","IR/ventana RF sin metal enfrente","Reserva estrecha en tapa para IR, GNSS u otro indicador pequeño si la profundidad/espesor de LCD lo permiten. NO caben automáticamente instrumentos grandes.","Confirmar holguras de tapa y compatibilidad de señal.","irpanel,gps,lcd"],
 ["dellcooler","Disipador y ventilador Dell","base","owned","fan",[],"Alimentación original Dell","Heatpipe / fan y control térmico Dell","Conjunto de refrigeración original que acompaña la placa Dell desnuda. No añadir refrigeración imaginaria al modelo.","Medir volumen barrido por el ventilador y conductos sin obstruir aire.","dell,fan,temp"],
 ["labreserve","Reserva de instrumentos de panel","panel","planned","zones",[],"Sin circuito asignado","FNIRSI / GM328A / otros por medir","Reserva física provisional para instrumentos. NO indica que FNIRSI y GM328A quepan juntos: aún no hay medidas suficientes.","Medir instrumentos, conectores, calados, espesor y reorganizar superficie real.","fnirsi,gm328,gpio"]
);
const PANEL_W=371,PANEL_D=258;
const mmBox=(x,y,w,d)=>[-5+x*10/PANEL_W,-3.35+y*6.7/PANEL_D,w*10/PANEL_W,d*6.7/PANEL_D];
const panelPlan=[
 ["switches",[12,10,216,78]], // 6 x 36 mm; dos filas, 3 cm por unidad + 6 mm margen aproximado
 ["oled",[235,12,40,38]],["cyd",[281,12,85,60]], // CYD PROVISIONAL, sin cota real
 ["keyboard",[12,116,240,98]], // volumen reservado hasta medir teclado BT desplegado
 ["gpio",[261,101,101,44]],["labmeter",[261,151,54,33]],
 ["encoder",[321,151,41,38]],["usbpanel",[12,221,240,30]],
 ["labreserve",[261,195,101,55]]
];
for(const [id,rect] of panelPlan){const item=raw.find(r=>r[0]===id);if(!item)throw Error("Plano sin elemento "+id);item[2]="panel";item[5]=mmBox(...rect);}
for(const item of raw.filter(r=>r[2]==="panel"&&!panelPlan.some(v=>v[0]===r[0]))){item[5]=[0,0,0,0];}
// Elementos no posicionados: siguen en catálogo con ficha, pero NO se dibujan como si ya cupiesen.
const panelPlanIds=new Set(panelPlan.map(v=>v[0]));
const visualLidIds=new Set(["lcd","lidrf","lidstatus","lid_ir","antenna"]);
raw.find(r=>r[0]==="dell")[5]=[-4.52,-2.57,7.35,4.65]; // ENVOLVENTE CONCEPTUAL, NO MEDIDA REAL PCB
raw.find(r=>r[0]==="dellcooler")[5]=[3.08,-1.80,1.42,1.70];
raw.find(r=>r[0]==="antenna")[8]="Antenas físicas compradas. Se reservan soportes accesibles en la franja de tapa o borde superior, extendidas cuando el maletín está abierto. Los módulos RF pueden quedar dentro de la bandeja técnica con coax a las antenas, sin perforar el maletín.";
raw.find(r=>r[0]==="keyboard")[8]="Teclado Bluetooth plegable con trackpad y Ñ, SEPARADO del Dell. Se usaría sobre el panel; la huella de 240 × 98 mm es solo una reserva, no medida real del teclado.";
raw.find(r=>r[0]==="switches")[8]="6 palancas SPST + 6 basculantes. Reserva de 216 × 78 mm en dos filas de seis, paso orientativo 36 mm por interruptor (30 mm estimados + 6 mm). Verificar profundidad y acceso antes de cortar.";
raw.find(r=>r[0]==="cyd")[8]="Pantalla táctil auxiliar futura en panel. El rectángulo de 85 × 60 mm es solo una reserva a validar con la variante física escogida.";
raw.find(r=>r[0]==="ports")[8]="Conectores y puertos deben estar accesibles en panel o alrededor de pantalla. Por ahora representados mediante zonas reservadas, NO montados.";

// Mapa FUNCIONAL de superficies de operación. No es un packing CAD ni agrega chips duplicados.
// Cada ficha corresponde a un acceso, control, pantalla, conector o capacidad utilizable desde arriba.
// Las huellas físicas conocidas siguen apartadas en panelPlan; NO atribuirles tamaño a estas tarjetas.
const operatingPoints={
 panel:[
  ["switches","12 INTERRUPTORES","6 palancas + 6 basculantes","energia"],
  ["oled","OLED SUPERVISOR","Estado y consumo","pantalla"],
  ["cyd","PANTALLA TÁCTIL","CYD 2,8″ prevista","pantalla"],
  ["keyboard","TECLADO + TRACKPAD","Bluetooth; no es del Dell","control"],
  ["fnirsi","OSCILOSCOPIO","Sondas accesibles","lab"],
  ["gm328","COMPROBADOR LCR","Zócalo ZIF accesible","lab"],
  ["gpio","GPIO / I²C / SPI","Cabeceras de laboratorio","datos"],
  ["usbpanel","USB-A / USB-C","Servicio y conexión","datos"],
  ["networkpanel","RJ45 / HDMI / AUDIO","Extensores dedicados","datos"],
  ["smartout","SMART OUT 1 / 2","Bornes 5 V protegidos","energia"],
  ["labout","FUENTE LAB OUT","Bananas y salida CC/CV","energia"],
  ["labmeter","MEDIDOR V/A/W","Pantalla de energía","pantalla"],
  ["encoder","ENCODER CC/CV","Ajuste fuente LAB","control"],
  ["logic","ANALIZADOR LÓGICO","Conexiones de 8 canales","lab"],
  ["uart","USB ↔ UART","Consola de servicio","datos"],
  ["irpanel","IR RX/TX","Control de equipos propios","rf"],
  ["nfc","NFC / RFID","Área de lectura accesible","rf"],
  ["ledpanel","LED + BUZZER","Alarmas del sistema","control"],
  ["fuse","ENTRADA DC","Jack protegido y fusible","energia"],
  ["pd","USB-C PD","Puerto protegido futuro","datos"],
  ["regservo","SALIDA SERVO","Regulación 5–6 V futura","energia"],
  ["reg33","SALIDA 3,3 V","Lógica protegida futura","energia"]
 ],
 lid:[
  ["lcd","PANTALLA DELL 14″","Interfaz principal del host","pantalla"],
  ["antenna","SOPORTES RF","Antenas internas desplegables","rf"],
  ["wifilab","ANTENA WI-FI LAB","Adaptador en piso técnico","rf"],
  ["lora","ANTENA LORA","Módulo conectado por coaxial","rf"],
  ["sdr","ANTENA SDR","Receptor en bandeja técnica","rf"],
  ["gps","ANTENA GNSS","Vista al cielo con tapa abierta","rf"],
  ["lidstatus","INDICADORES DE TAPA","LED de estado opcionales","control"],
  ["lid_ir","ZONA IR / SENSORES","Solo si hay espacio en marco","control"]
 ]
};
const accessCategories={energia:"ENERGÍA Y SALIDAS",pantalla:"PANTALLAS",control:"CONTROLES",lab:"INSTRUMENTOS",datos:"DATOS Y PUERTOS",rf:"RADIO / SENSORES"};

const items=raw.map(r=>({id:r[0],name:r[1],floor:r[2],status:r[3],kind:r[4],box:r[5],v:r[6],io:r[7],desc:r[8],next:r[9],links:r[10].split(","),doc:["panel","lid","base"].includes(r[2])?"25-lilith-panel-lid-interface.md":r[2]==="power"?"21-portable-power-architecture.md":"22-lilith-build-status-2026-10-17.md"}));
const index=Object.fromEntries(items.map(i=>[i.id,i]));
const bench={esp32:[-3.7,-1.1,2.24,1.32],ina:[-.77,-1.1,2.1,1.35],oled:[2.38,-1.0,1.45,1.1],r1:[-2.55,1.35,.87,.4],r2:[-.32,1.35,.87,.4],r3:[1.91,1.35,.87,.4]};
const circuit={meanwell:[-4.45,-2.1,1.5,.95],fuse:[-2.62,-2.1,1.07,.87],sw0:[-1.18,-2.1,.81,.87],xl:[.08,-2.05,1.58,1.18],tps1:[2.23,-2.14,1.06,.91],tps2:[3.65,-2.14,1.04,.91],sw1:[.14,.27,.80,.79],ina:[-1.05,.59,1.54,1.10],esp32:[-4.0,.70,1.89,1.05],oled:[2.32,.60,1.58,1.02]};
const benchN=[["esp32","ina","power","3V3 fila 5",true],["esp32","oled","power","3V3",true],["esp32","ina","ground","GND fila 2",true],["esp32","ina","i2c","GPIO8 SDA fila 10",true],["esp32","ina","i2c","GPIO9 SCL fila 15",true],["esp32","oled","i2c","I²C GPIO8/9",true],["ina","r1","power","VIN1−",true],["ina","r2","power","VIN2−",true],["ina","r3","power","VIN3−",true]];
const designN=[["meanwell","fuse","power","12 V",false],["fuse","sw0","power","12 V",false],["sw0","xl","power","12 V",false],["xl","tps1","power","5 V",false],["xl","tps2","power","5 V",false],["xl","sw1","power","5 V",false],["tps1","ina","power","CH1",false],["tps2","ina","power","CH2",false],["sw1","ina","power","CH3",false],["ina","esp32","power","SUP 5 V",false],["esp32","ina","i2c","GPIO8/9 probado",true],["esp32","oled","i2c","GPIO8/9 probado",true],["esp32","ina","ground","GND banco",true]];
const S={mode:"model",floor:"all",exploded:true,status:"all",q:"",selected:"esp32",net:"all",yaw:-.55,pitch:.62,zoom:1,panX:0,panY:0};
let W=0,H=0,dpr=1,scale=1,hit=[],lab=[],scheduled=false,drag=false,startDist=0;
const ptr=new Map();
const lim=(v,a,b)=>Math.max(a,Math.min(b,v));
function proj(x,y,z){let co=Math.cos(S.yaw),si=Math.sin(S.yaw),p=Math.sin(S.pitch),q=Math.cos(S.pitch),u=x*co-y*si,v=x*si+y*co,depth=v*q+z*p,f=25/(25-depth);return{x:W*.5+S.panX+u*scale*f,y:H*(S.mode==="model"&&S.floor==="all"?.70:.54)+S.panY+(v*p-z*q)*scale*f};}
function poly(pts,fill,stroke,width=1){let a=pts.map(v=>proj(...v));g.beginPath();g.moveTo(a[0].x,a[0].y);a.slice(1).forEach(v=>g.lineTo(v.x,v.y));g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}return a;}
function path(pts,color="#cdb2be",w=1,dash=[]){let a=pts.map(v=>proj(...v));g.beginPath();g.moveTo(a[0].x,a[0].y);a.slice(1).forEach(v=>g.lineTo(v.x,v.y));g.strokeStyle=color;g.lineWidth=w;g.setLineDash(dash);g.stroke();g.setLineDash([]);}
function block(x,y,z,w,d,h,col){poly([[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]],"#14141b","#4a4251");poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],"#14141b","#4a4251");poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],"#14141b","#4a4251");return poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],col,"#8b7d8b");}
function ring(x,y,z,r,col,fill){let p=[];for(let i=0;i<22;i++){let a=i*Math.PI*2/22;p.push([x+Math.cos(a)*r,y+Math.sin(a)*r,z]);}poly(p,fill,col,1.4);}
function text(x,y,z,t,size=8,color="#e5dce7"){let p=proj(x,y,z);g.font="700 "+size+"px 'Space Grotesk',sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillStyle=color;g.fillText(t,p.x,p.y);g.textAlign="left";}
function light(x,y,z,c){let p=proj(x,y,z);g.beginPath();g.arc(p.x,p.y,Math.max(2.0,scale*.05),0,Math.PI*2);g.fillStyle=c;g.fill();}
function paintBoard(m,b,z){let [x,y,w,d]=b,k=m.kind,base=z+.08;let colorsBoard={esp32:"#173d3b",ina:"#653881",oled:"#1b2a3e",xl:"#1c5d92",tps:"#216a53",laptop:"#474752",motherboard:"#1b554d",zones:"#423747",keyboard:"#33323d",switches:"#33313e",battery:"#42514d",lora:"#235d47",fuse:"#4e4238",usb:"#333b45",resistor:"#725444",antenna:"#36303c",fan:"#343941",screen:"#263d62",ports:"#394053",arduino:"#1c5360",ethernet:"#354b55",wifi:"#315a56",chip:"#385451",logic:"#273b61",rtc:"#395367",sensor:"#37545d",backplane:"#255a50",regulator:"#355c55",meter:"#243e56",encoder:"#4c4254",scope:"#2e3c63",tester:"#385969",ir:"#574148",leds:"#4c4356"};let area=block(x,y,z,w,d,.075,colorsBoard[k]||"#284d58");
let add=(a,b,c,dd,h,color)=>block(x+a*w,y+b*d,base,c*w,dd*d,h,color),loc=(a,b,h=.1)=>[x+a*w,y+b*d,base+h];
if(k==="keyboard"){add(.04,.06,.91,.84,.05,"#343a43");for(let i=0;i<5;i++)for(let j=0;j<13;j++)add(.08+j*.057,.12+i*.116,.044,.086,.018,i+j===15?"#4c3b4f":"#242a34");add(.34,.73,.28,.11,.01,"#929098");}
else if(k==="motherboard"){
 for(let i=0;i<14;i++){add(.02+i*.067,.02,.038,.06,.02,"#c5ad86");add(.02+i*.067,.92,.038,.06,.02,"#c5ad86");}
 add(.10,.14,.28,.33,.14,"#233441");add(.42,.18,.24,.38,.13,"#9fa4a6");
 add(.71,.18,.20,.20,.10,"#343b43");add(.12,.58,.23,.26,.09,"#232a34");
 for(let i=0;i<4;i++)path([loc(.53,.36,.23),loc(.53+i*.055,.72,.18)],"#b97b55",2);
 text(...loc(.50,.81,.25),"PLACA DELL",9,"#f1d3dd");
}
else if(k==="zones"){
 add(.03,.08,.94,.84,.025,"#2a2433");text(...loc(.50,.47,.15),"RESERVA",9,"#dcb9cc");
}
else if(k==="switches"){
 for(let i=0;i<6;i++){
  let xx=x+w*(i+.5)/6,yy=y+d*.26;
  ring(xx,yy,base+.08,Math.min(w/6,d*.48)*.23,"#c1c1c7","#494852");
  path([[xx,yy,base+.12],[xx+.05,yy-.05,base+.29]],"#e1dadf",2.5);
  add((i+.5)/6-.055,.67,.11,.18,.07,"#131927");
 }
 text(...loc(.5,.51,.17),"6 PALANCAS + 6 BASCULANTES",7,"#e9bbd0");
}
else if(k==="esp32"){for(let i=0;i<10;i++){add(.07+i*.082,.00,.047,.07,.01,"#d2ac72");add(.07+i*.082,.93,.047,.07,.01,"#d2ac72");}add(.02,.38,.16,.24,.12,"#bcc7c9");add(.26,.14,.61,.73,.14,"#b6c3c6");add(.38,.32,.38,.35,.10,"#303b45");text(...loc(.56,.49,.28),"S3",9);}
else if(k==="ina"){for(let i=0;i<3;i++){let xx=.10+i*.29;add(xx,.33,.23,.33,.10,"#e6e0dc");text(...loc(xx+.115,.50,.13),"R100",8,"#33313c");}for(let i=0;i<8;i++)add(.07+i*.11,.02,.04,.07,.01,"#d4ab76");text(...loc(.48,.18),"INA3221",8);}
else if(k==="xl"){let xx=x+w*.35,yy=y+d*.54;ring(xx,yy,base+.14,w*.17,"#d5a678","#424b54");ring(xx,yy,base+.16,w*.085,"#bb8856","#2c3541");add(.58,.21,.18,.29,.22,"#283846");add(.79,.20,.14,.37,.26,"#3a4754");add(.58,.67,.13,.18,.13,"#2c7fb8");add(.79,.67,.13,.18,.13,"#2c7fb8");text(...loc(.48,.11),"XL4015",8);}
else if(k==="tps"){for(let i=0;i<3;i++){add(.10+i*.25,.10,.15,.20,.02,"#cfab76");add(.10+i*.25,.70,.15,.20,.02,"#cfab76");}add(.75,.40,.16,.17,.14,"#121620");text(...loc(.43,.51),"SMD",7);}
else if(k==="oled"||k==="screen"){add(.09,.10,.82,.79,.16,"#080e1a");add(.16,.18,.68,.61,.02,"#092036");text(...loc(.5,.42,.21),"LILITH",9,"#d6a6c2");text(...loc(.5,.64,.21),k==="oled"?"0x3C":"CYD",8,"#a6b2d7");}
else if(k==="battery"){add(.04,.06,.92,.87,.22,"#3e5350");for(let i=0;i<4;i++)add(.10+i*.215,.18,.17,.65,.14,i%2?"#83948b":"#6e847a");text(...loc(.50,.49,.32),"4S",8,"#22342e");}
else if(k==="fuse"){add(.11,.25,.62,.45,.13,"#20242c");add(.24,.36,.38,.22,.08,"#d0cccc");ring(...loc(.85,.47,.13),w*.09,"#d0b18b","#22242a");}
else if(k==="antenna"){for(let i=0;i<3;i++){let p=loc(.20+i*.28,.25,.1);path([p,[p[0],p[1],p[2]+.78]],"#c6c4c6",2.6);}}
else if(k==="fan"){add(.06,.08,.88,.84,.07,"#1c2732");ring(...loc(.50,.49,.08),w*.35,"#b3b5bc","#394251");for(let i=0;i<6;i++){let a=i*Math.PI/3;path([loc(.50,.49,.12),loc(.50+.30*Math.cos(a),.49+.30*Math.sin(a),.12)],"#8494a1",3);}}
else if(k==="resistor"){add(.27,.34,.47,.30,.08,"#dbc4a8");for(let i=0;i<3;i++)add(.33+i*.12,.35,.05,.29,.013,i===1?"#24232c":"#815537");}
else if(k==="lora"){add(.13,.18,.60,.64,.12,"#c1c8c6");add(.22,.27,.42,.40,.09,"#38464b");ring(...loc(.82,.50,.11),w*.085,"#ddbc87","#20363a");}
else if(k==="scope"||k==="tester"||k==="meter"||k==="screen"){
add(.07,.09,.86,.82,.11,"#151d2b");add(.13,.16,.73,.59,.025,"#123643");
text(...loc(.5,.45,.25),k==="scope"?"SCOPE":k==="tester"?"LCR":k==="screen"?"CYD":"V/A/W",8,"#b5dfd1");
add(.15,.82,.20,.08,.05,"#d6b18c");add(.65,.82,.20,.08,.05,"#d6b18c");
}
else if(k==="arduino"||k==="backplane"||k==="logic"){
for(let side=0;side<2;side++)for(let i=0;i<8;i++)add(.06+i*.115,side?.88:.04,.053,.06,.02,"#d6ac76");
add(.15,.20,.31,.51,.10,"#243b4b");add(.54,.26,.24,.38,.08,"#151e2d");
text(...loc(.50,.78,.22),k==="arduino"?"ARDUINO":k==="logic"?"LOGIC":"BACKPLANE",7);
}
else if(k==="wifi"||k==="ethernet"){
add(.08,.16,.72,.61,.15,"#b5bbc4");add(.15,.25,.56,.42,.05,"#314050");
if(k==="wifi"){ring(...loc(.85,.34,.13),Math.min(w,d)*.07,"#e0b887","#36404a");ring(...loc(.85,.66,.13),Math.min(w,d)*.07,"#e0b887","#36404a");}
else add(.80,.32,.19,.36,.08,"#a8adae");
text(...loc(.42,.76,.24),k==="wifi"?"WI-FI":"LAN",8,"#eee0ed");
}
else if(k==="chip"||k==="rtc"||k==="sensor"||k==="regulator"){
add(.21,.20,.58,.53,.12,k==="regulator"?"#427b77":"#242d3b");
for(let i=0;i<4;i++){add(.10+i*.235,.09,.09,.06,.025,"#d5b17c");add(.10+i*.235,.84,.09,.06,.025,"#d5b17c");}
text(...loc(.5,.48,.24),k==="rtc"?"RTC":k==="sensor"?"SENSOR":k==="regulator"?"DC/DC":"IC",7);
}
else if(k==="encoder"){
ring(...loc(.50,.47,.24),Math.min(w,d)*.27,"#d5c0be","#3d414c");ring(...loc(.50,.47,.26),Math.min(w,d)*.15,"#e9c8aa","#202631");
for(let i=0;i<3;i++)add(.22+i*.23,.83,.11,.07,.04,"#d6b28a");
}
else if(k==="ir"||k==="leds"){
for(let i=0;i<4;i++){let xx=.17+i*.21;ring(...loc(xx,.42,.15),Math.min(w,d)*.09,k==="ir"?"#d88b88":"#e2b989",k==="ir"?"#492838":i%2?"#383c47":"#6b4059");}
add(.13,.77,.75,.10,.06,"#242b38");
}
else if(k==="usb"){add(.08,.19,.80,.60,.13,"#242b36");add(.82,.37,.17,.24,.11,"#d2d1d1");}
else if(k==="ports"){for(let i=0;i<3;i++){add(.13,.10+i*.27,.57,.18,.12,"#141e2b");ring(...loc(.84,.20+i*.27,.09),w*.09,"#d5b38a","#1d202a");}}
else{add(.10,.14,.81,.74,.045,"#203443");add(.29,.30,.41,.39,.12,"#141b25");for(let i=0;i<5;i++)add(.10+i*.17,.03,.06,.09,.015,"#dab27e");}
light(x+w*.88,y+d*.13,base+.20,colors[m.status]);
if((S.floor!=="all"||S.mode!=="model")&&W>580)text(...loc(.5,.90,.26),m.name.length>20?m.name.slice(0,18)+"…":m.name,7,"#f2e4eb");
if(S.selected===m.id)poly([[x,y,base+.2],[x+w,y,base+.2],[x+w,y+d,base+.2],[x,y+d,base+.2]],null,"#f8cee2",2.4);
hit.push({id:m.id,poly:area});let q=proj(x+w/2,y+d/2,base+.22);lab.push({id:m.id,x:q.x,y:q.y,t:m.name,c:colors[m.status],selected:S.selected===m.id});
}
function floor(f,z){block(-5,-3.35,z,10,6.7,.15,"#332b3d99");for(let i=-4;i<=4;i++)path([[i,-3.3,z+.16],[i,3.3,z+.16]],"#d9a8bc16",.5);let a=proj(-4.4,-3.5,z+.23);lab.push({id:"floor",x:a.x,y:a.y,t:f[1],c:"#ab8fa2",selected:false});}
function drawLid(z){
 const rearY=3.45,frontY=3.36;
 poly([[-5,rearY,z],[5,rearY,z],[5,rearY,z+6.7],[-5,rearY,z+6.7]],"#342b38","#a47791",1.8);
 // La tapa se muestra abierta; huecos disponibles brutos, pendiente bisagras/marco/eDP.
 const rects=[
  ["lcd",-4.17,1.08,8.34,4.52],
  ["antenna",-4.57,5.76,1.15,.60],
  ["lidrf",-3.22,5.76,1.65,.60],
  ["lidstatus",-.95,5.76,2.05,.60],
  ["lid_ir",2.15,5.76,1.75,.60]
 ];
 // Las franjas superiores e inferiores solo ilustran espacio potencial.
 const a=poly([[-4.25,frontY,z+1.04],[4.25,frontY,z+1.04],[4.25,frontY,z+5.65],[-4.25,frontY,z+5.65]],"#11131d","#8b7287",1.3);
 poly([[-4.03,frontY-.01,z+1.20],[4.03,frontY-.01,z+1.20],[4.03,frontY-.01,z+5.49],[-4.03,frontY-.01,z+5.49]],"#102235","#536675",.9);
 for(const [id,x,y,w,h] of rects){
  const m=index[id];if(!m)continue;
  if(S.status!=="all"&&S.status!==m.status)continue;
  if(S.q&&!(m.name+" "+m.desc+" "+m.io+" "+(capabilityProfiles[m.id]?.role||"")+" "+(capabilityProfiles[m.id]?.use||"")).toLowerCase().includes(S.q))continue;
  const isScreen=id==="lcd",isSelected=S.selected===id;
  const polygon=poly([[x,frontY-.02,z+y],[x+w,frontY-.02,z+y],[x+w,frontY-.02,z+y+h],[x,frontY-.02,z+y+h]],
    isScreen?"#122538":id==="antenna"?"#34414e":id==="lidrf"?"#333848":id==="lidstatus"?"#493044":"#4d3442",
    isSelected?"#f8cee2":"#b58aa2",isSelected?2.6:1);
  hit.push({id,poly:polygon});
  const centre=proj(x+w/2,frontY-.06,z+y+h/2);
  lab.push({id,x:centre.x,y:centre.y,t:m.name,c:colors[m.status],selected:isSelected});
  if(isScreen){text(0,frontY-.07,z+3.43,"LCD DELL 14″",Math.min(11,7+W/240),"#f0d9e7");}
  else if(id==="lidstatus"){text(x+w/2,frontY-.08,z+y+h/2,"LED",8,"#ffe0ee");}
  else if(id==="lidrf"){text(x+w/2,frontY-.08,z+y+h/2,"RF",8,"#edc4d9");}
  else if(id==="antenna"){text(x+w/2,frontY-.08,z+y+h/2,"ANT",8,"#e0c29a");}
  else{text(x+w/2,frontY-.08,z+y+h/2,"IR",8,"#ecd3e1");}
 }
 const position=proj(-4.8,rearY,z+6.73);
 lab.push({id:"floor",x:position.x,y:position.y,t:"TAPA · MARCO DEL LCD / ACCESO SUPERIOR",c:"#e9bdd3",selected:false});
}
function drawingModel(){
 for(const f of levels){
  if(S.floor!=="all"&&S.floor!==f[0])continue;
  const idx=levels.indexOf(f),z=S.floor==="all"?.11+Math.min(idx,3)*(S.exploded?.98:.18):.60;
  if(f[0]==="lid"){drawLid(z+.28);continue;}
  floor(f,z);
  const group=items.filter(m=>m.floor===f[0]&&!["sw0","sw1"].includes(m.id)
   &&(f[0]!=="panel"||panelPlanIds.has(m.id))
   &&(S.status==="all"||m.status===S.status)
   &&(!S.q||(m.name+" "+m.desc+" "+m.io).toLowerCase().includes(S.q)));
  group.sort((a,b)=>(a.box[0]+a.box[2]/2)*Math.sin(S.yaw)+(a.box[1]+a.box[3]/2)*Math.cos(S.yaw)-(b.box[0]+b.box[2]/2)*Math.sin(S.yaw)-(b.box[1]+b.box[3]/2)*Math.cos(S.yaw));
  group.forEach(m=>paintBoard(m,m.box,z+.19));
  if(f[0]==="panel"&&(!S.q||"interruptor sw0 sw1".includes(S.q))){
   const p=index.switches.box;
   for(let i=0;i<2;i++){
    const x=p[0]+p[2]*(i+.5)/6-p[2]/12,y=p[1]+p[3]*.08,z1=z+.40;
    hit.push({id:i?"sw1":"sw0",poly:[[x,y,z1],[x+p[2]/6,y,z1],[x+p[2]/6,y+p[3]*.39,z1],[x,y+p[3]*.39,z1]].map(q=>proj(...q))});
   }
  }
 }
}
function wires(nets,placement,z){nets.forEach(([aa,bb,kind,label,ok],i)=>{if(S.net!=="all"&&kind!==S.net)return;let a=placement[aa],b=placement[bb];if(!a||!b)return;const p=[a[0]+a[2]/2,a[1]+a[3]/2,z],q=[b[0]+b[2]/2,b[1]+b[3]/2,z],mid=[(p[0]+q[0])/2,(p[1]+q[1])/2,z+.11+(i%4)*.11];
 path([p,[(p[0]+mid[0])/2,(p[1]+mid[1])/2,mid[2]],mid,[(q[0]+mid[0])/2,(q[1]+mid[1])/2,mid[2]],q],colors[kind],S.selected===aa||S.selected===bb?3.6:2.4,ok?[]:[6,5]);
 if(S.selected===aa||S.selected===bb||S.net!=="all"){let sp=proj(...mid);g.font="600 9px 'DM Sans'";g.fillStyle="#201828ee";g.fillRect(sp.x-56,sp.y-15,112,18);g.fillStyle="#f4e2ed";g.textAlign="center";g.fillText(label.slice(0,26),sp.x,sp.y-3);g.textAlign="left";}
});}
function diagram(which){let p=which==="bench"?bench:circuit,z=.19;floor(["bench",which==="bench"?"BANCO REAL 3,3 V":"ARQUITECTURA V0.1"],z);for(const [id,b] of Object.entries(p))paintBoard(index[id],b,z+.15);wires(which==="bench"?benchN:designN,p,z+.40);}
function labels(){let used=[];const small=W<560;let arr=lab.slice().sort((a,b)=>Number(b.selected)-Number(a.selected));for(const t of arr){if(S.mode==="model"&&S.floor==="all"&&!t.selected&&!["esp32","ina","xl","oled","dell","battery","switches","tps1","lora","arduino","fnirsi","wifilab"].includes(t.id))continue;let w=Math.min(small?145:200,18+t.t.length*(small?5.4:6)),h=22,x=lim(t.x-w/2,4,W-w-4),y=lim(t.y-36,42,H-92);
 if(!t.selected&&used.some(r=>x<r.x+r.w+4&&x+w>r.x-4&&y<r.y+r.h+4&&y+h>r.y-4))continue;used.push({x,y,w,h});g.fillStyle=t.selected?"#3d3530f2":"#20282eee";g.strokeStyle=t.selected?"#c4a48c":"#49545b";g.beginPath();g.roundRect(x,y,w,h,6);g.fill();g.lineWidth=1;g.stroke();g.fillStyle=t.c;g.beginPath();g.arc(x+9,y+11,3,0,Math.PI*2);g.fill();g.fillStyle="#f6e9f0";g.font="600 "+(small?9:10)+"px 'DM Sans'";g.textAlign="left";g.textBaseline="middle";g.fillText(t.t.length>(small?22:30)?t.t.slice(0,small?20:28)+"…":t.t,x+17,y+11);}g.textBaseline="alphabetic";}
function draw(){scheduled=false;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);let bg=g.createRadialGradient(W*.52,H*.50,10,W*.5,H*.49,Math.max(W,H)*.8);bg.addColorStop(0,"#293039");bg.addColorStop(.6,"#161d24");bg.addColorStop(1,"#0e1319");g.fillStyle=bg;g.fillRect(0,0,W,H);g.strokeStyle="#a9b2b412";for(let x=0;x<W;x+=30){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}for(let y=0;y<H;y+=30){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
 scale=Math.min(W/14.8,H/(S.mode==="model"&&S.floor==="all"?15.8:11.5))*1.17*S.zoom;hit=[];lab=[];if(S.mode==="model")drawingModel();else diagram(S.mode);labels();}
function render(){if(!scheduled){scheduled=true;requestAnimationFrame(draw);}}
function resize(){let r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;W=r.width;H=r.height;dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);render();}
function inside(v,a){let ok=false;for(let i=0,j=a.length-1;i<a.length;j=i++){let p=a[i],q=a[j];if((p.y>v.y)!==(q.y>v.y)&&v.x<(q.x-p.x)*(v.y-p.y)/(q.y-p.y)+p.x)ok=!ok;}return ok;}
function pick(v){for(let i=hit.length-1;i>=0;i--)if(inside(v,hit[i].poly))return hit[i].id;for(let i=hit.length-1;i>=0;i--){let a=hit[i].poly,p={x:a.reduce((s,v)=>s+v.x,0)/4,y:a.reduce((s,v)=>s+v.y,0)/4};if(Math.hypot(v.x-p.x,v.y-p.y)<(W<600?21:13))return hit[i].id;}return null;}
function statusText(s){return s==="tested"?"PROBADO EN BANCO":s==="owned"?"REGISTRADO / COMPRADO, RECEPCIÓN POR VERIFICAR":"PLANIFICADO / SIN PROBAR";}
function select(id){if(!index[id])return;S.selected=id;if(id==="meanwell")S.mode="circuit";if(["r1","r2","r3"].includes(id))S.mode="bench";if(S.mode==="model"&&S.floor!=="all"&&index[id].floor!=="external")S.floor=index[id].floor;update();}
function renderOperatingPoints(){
 for(const surface of ["panel","lid"]){
  const wrap=$(surface==="panel"?"panelAccessGrid":"lidAccessGrid");
  if(!wrap)continue;
  wrap.replaceChildren();
  let lastCategory="";
  for(const [id,label,detail,group] of operatingPoints[surface]){
   const m=index[id];if(!m)throw Error("Punto operativo sin módulo: "+id);
   if(group!==lastCategory){
    lastCategory=group;
    const category=document.createElement("div");category.className="access-group-label";
    category.textContent=accessCategories[group];wrap.append(category);
   }
   const b=document.createElement("button");b.className="access-point";
   b.dataset.part=id;b.dataset.surface=surface;
   const header=document.createElement("span");header.className="access-point-header";
   const name=document.createElement("strong");name.textContent=label;
   const state=document.createElement("i");state.className="state-dot "+m.status;
   header.append(state,name);
   const desc=document.createElement("small");desc.textContent=detail;
   const location=document.createElement("em");location.textContent=m.floor===surface?"Reserva en "+(surface==="panel"?"panel":"tapa"):"Módulo interno · acceso arriba";
   b.append(header,desc,location);
   b.addEventListener("click",()=>{
    S.mode="model";S.floor=surface;S.selected=id;update();
    $("inspector").scrollIntoView({behavior:"smooth",block:"start"});
   });
   wrap.append(b);
  }
 }
 const n=$("operatingCount");if(n)n.textContent=operatingPoints.panel.length+operatingPoints.lid.length;
 const p=$("panelAccessCount");if(p)p.textContent=operatingPoints.panel.length;
 const l=$("lidAccessCount");if(l)l.textContent=operatingPoints.lid.length;
}

function inventory(){
 const el=$("inventory");el.replaceChildren();
 const order=["lid","panel","electronics","power","base","external","bench"];
 const title={lid:"TAPA · PANTALLA Y ANTENAS",panel:"01 · INTERFAZ DE USUARIO",electronics:"02 · ELECTRÓNICA INTERNA",power:"03 · ENERGÍA INTERNA",base:"04 · PLACA DELL",external:"EXTERIOR / BANCO",bench:"CARGAS DE PRUEBA"};
 const visible=items.filter(m=>(S.status==="all"||m.status===S.status)&&(!S.q||(m.name+" "+m.desc+" "+m.io).toLowerCase().includes(S.q))&&(!["r1","r2","r3"].includes(m.id)||S.mode==="bench"));
 visible.sort((a,b)=>order.indexOf(a.floor)-order.indexOf(b.floor)||a.name.localeCompare(b.name,"es"));
 $("resultCount").textContent=visible.length;
 let current="";
 visible.forEach(m=>{
  if(m.floor!==current){
   current=m.floor;
   const header=document.createElement("div");header.className="inventory-group";
   header.textContent=title[current]||current.toUpperCase();el.append(header);
  }
  const b=document.createElement("button"),dot=document.createElement("i"),wrap=document.createElement("span"),n=document.createElement("b"),sub=document.createElement("small");
  b.className="inv-item"+(S.selected===m.id?" active":"");
  dot.className="state-dot "+m.status;n.textContent=m.name;
  sub.textContent=m.status==="tested"?"PROBADO":m.status==="owned"?"REGISTRADO / VERIFICAR":"PLANIFICADO";
  wrap.append(n,sub);b.append(dot,wrap);
  b.addEventListener("click",()=>{
   if(["lid","panel","electronics","power","base"].includes(m.floor)){S.mode="model";S.floor=m.floor;}
   else if(m.floor==="bench")S.mode="bench";
   else if(m.floor==="external")S.mode="circuit";
   select(m.id);
  });
  el.append(b);
 });
}
const operatingAccess={
 dell:"LCD Dell en tapa; teclado BT plegable separado sobre panel; conectores e interruptor Dell mediante extensiones/actuadores accesibles (sin integración todavía)",
 dellcooler:"Diagnóstico y control térmico desde interfaz superior; limpieza/reparación en mantenimiento",
 esp32:"OLED/indicadores, SW1 y puerto USB de servicio en panel",
 ina:"Lecturas de corriente en OLED/pantallas del panel cuando se implemente",
 xl:"SW0, medición y salida protegida desde el panel; potenciómetros internos del XL4015 sólo en mantenimiento",
 tps1:"Control/estado FAULT y bornes 5 V SMART OUT 1 en panel",tps2:"Control/estado FAULT y bornes 5 V SMART OUT 2 en panel",
 tca:"Identificación de módulos y diagnóstico por pantalla supervisor",eeprom:"ID de Smart Ports visible desde interfaz del supervisor",
 adum:"Enlace serial al Dell; conector de servicio en panel, masas Dell/AUX aisladas",
 uart:"Puerto USB/UART de servicio disponible en panel",
 battery:"Conmutador/estado de energía, protección y entrada de carga diseñada en panel; SIN montaje",
 mux:"Selector AUX OFF y estado en panel; sin retorno Dell/LiFePO4",
 chargepath:"Indicador y conector seguro de carga en el panel; no usar Mean Well como cargador",
 dcdell:"Conector/control de alimentación Dell visible en panel, sujeto a medir tensión e ID",
 fan:"Indicador de ventilación/temperatura y acceso de servicio arriba",
 temp:"Lecturas térmicas por pantalla del supervisor",
 wifilab:"Antenas por coaxial hacia zona RF de tapa/panel abierto; switch y estado arriba",
 lora:"Antena correcta en tapa/panel abierto mediante coax; control y estado arriba",
 sdr:"Antena despejada y acceso USB desde el panel; coaxial apropiado",
 gps:"Antena GNSS con vista al cielo junto a la pantalla/panel abierto",
 nfc:"Área de acercamiento de tarjeta identificada en tapa/panel sin metal encima",
 irctrl:"Receptor/LED IR visibles en el marco de pantalla o panel",
 rtc:"Hora y configuración mediante pantalla de supervisión",
 bme:"Mediciones de temperatura/humedad/ambiente visibles arriba; posición de sensor ventilada",
 ard‌uino:"GPIO y USB de servicio desde panel",arduino:"GPIO/I²C/SPI/UART con protección en panel",
 logic:"Cabeceras y USB para instrumentos de laboratorio en panel",
 levelshift:"Interfaces 3V3/5V rotuladas y protegidas arriba",
 ue306:"RJ45 LAN2 accesible en el panel; adaptador debajo",
 hub:"USB-A/USB-C accesibles desde panel, sin retorno de 5 V a Dell",
 backplane:"Puertos SMART OUT / LEDs/FAULT / SW0 desde panel",
 smartports:"Bornes de Smart Output 1 y 2 en panel con límites señalados",
 lab:"Perilla, pantalla V/A/W, OUTPUT y bornes desde panel (fuente LAB futura)",
 labout:"Bananas/bornes de salida regulable, OUTPUT y fusible operable desde panel",
 labmeter:"V/A/W en panel, módulo LAB todavía no integrado",
 power_meter:"Display V/A/W montado en panel",
 pd:"USB-C PD protegido y rotulado en panel",
 regservo:"Bornes servo 5–6 V / GPIO control desde panel",
 reg33:"Bornes 3,3 V protegidos y rotulados en panel",
 aux12:"Bornes 12 V regulados, solo si se valida la necesidad, desde panel",
 fnirsi:"Pantalla y conexiones de sonda en panel o zona auxiliar alrededor del LCD, según medidas; no aprobado",
 gm328:"Zócalo ZIF totalmente accesible sobre panel o zona auxiliar de tapa, según medidas; no aprobado",
 keyboard:"Teclado BT con trackpad independiente, ubicado SOBRE panel accesible",
 switches:"6 palancas + 6 basculantes en dos filas sobre panel (reserva 216×78 mm)",
 antenna:"Soportes plegables/expuestos al abrir la tapa, separados de electrónica ruidosa; coax a módulos interiores",
 oled:"Pantalla SH1106 accesible desde el panel",
 cyd:"Pantalla táctil accesible en el panel",
 usbpanel:"Puertos USB de servicio en franja de panel",
 networkpanel:"Conectores HDMI/RJ45/audio accesibles en panel",
 ports:"Interfaz de alimentación y datos accesible en superficie operativa",
 gpio:"Headers y bornes GPIO, I²C, SPI y UART accesibles en panel",
 irpanel:"Emisor y receptor IR visibles en tapa/panel",
 ledpanel:"Alarmas visuales/acústicas desde la superficie operativa",
 lcd:"LCD en la tapa abierta; cableado eDP y bisagra por comprobar",
 lidrf:"Conectores de antena y soportes RF utilizables con el maletín abierto",
 lidstatus:"Indicadores junto al LCD, sin tapar la zona activa",
 lid_ir:"Franja libre alrededor de pantalla para IR/GNSS o indicadores tras medir",
 meanwell:"Conexión de 12 V DC en panel/borde interno; adaptador Mean Well fuera del maletín"
};
const accessFor=m=>operatingAccess[m.id]||"Operación/control/estado a través de interfaz superior o tapa; asignación exacta y calado pendiente de definir y medir. No hace falta abrir los pisos durante uso normal.";


function setupCapabilityExplorer(){
 const cards=$("capabilityCards"),tabs=$("capabilityFilters"),search=$("capabilitySearch"),more=$("capabilityMore");
 if(!cards||!tabs||!search||!more)return;
 let category="all",expanded=false;
 const names=capabilityData.categories;
 function show(){
  const query=search.value.trim().toLocaleLowerCase("es");
  const found=items.filter(m=>{
   const p=capabilityProfiles[m.id];if(!p)return false;
   return (category==="all"||p.category===category)&&(!query||[m.name,p.role,p.use,names[p.category]].join(" ").toLocaleLowerCase("es").includes(query));
  });
  const visible=expanded?found:found.slice(0,12);
  $("capabilityResults").textContent=found.length+" de "+items.length+" elementos · estado según bitácora";
  cards.replaceChildren();
  for(const m of visible){
   const p=capabilityProfiles[m.id],box=document.createElement("article");box.className="capability-card";
   const meta=document.createElement("div");meta.className="capability-card-top";
   const group=document.createElement("small");group.className="capability-domain";group.textContent=names[p.category];
   const status=document.createElement("small");status.className="capability-status "+m.status;
   status.textContent=m.status==="tested"?"Banco probado":m.status==="owned"?"Registrado / no integrado":"Planificado";
   meta.append(group,status);
   const title=document.createElement("h4");title.textContent=m.name;
   const purpose=document.createElement("p");purpose.className="capability-role";purpose.textContent=p.role;
   const application=document.createElement("p");application.className="capability-application";application.textContent=p.use;
   const detail=document.createElement("button");detail.type="button";detail.className="capability-open";detail.textContent="Ver ficha técnica ↗";
   detail.setAttribute("aria-label","Ver ficha técnica de "+m.name);
   detail.addEventListener("click",()=>{
    S.mode=m.floor==="bench"?"bench":m.floor==="external"?"circuit":"model";
    if(S.mode==="model")S.floor=["lid","panel","electronics","power","base"].includes(m.floor)?m.floor:"all";
    select(m.id);
    $("inspector").scrollIntoView({behavior:"smooth",block:"start"});
   });
   box.append(meta,title,purpose,application,detail);cards.append(box);
  }
  more.hidden=found.length<=visible.length;
  if(!more.hidden)more.textContent="Mostrar "+(found.length-visible.length)+" módulos restantes ↓";
 }
 tabs.replaceChildren();
 for(const [key,name] of Object.entries(names)){
  const button=document.createElement("button");button.type="button";button.className="capability-filter"+(key===category?" active":"");
  button.textContent=name;button.dataset.category=key;button.setAttribute("aria-pressed",String(key===category));
  button.addEventListener("click",()=>{
   category=key;expanded=false;
   tabs.querySelectorAll("button").forEach(b=>{const active=b.dataset.category===category;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
   show();
  });
  tabs.append(button);
 }
 search.addEventListener("input",()=>{expanded=false;show();});
 more.addEventListener("click",()=>{expanded=true;show();});
 $("capabilitiesTotal").textContent=Object.keys(capabilityProfiles).length;
 show();
}
function inspector(){let m=index[S.selected];if(!m)return;let el=$("inspectorBody");el.replaceChildren();let top=document.createElement("div");top.className="inspector-topblock";let p=document.createElement("div");p.className="inspect-code";p.textContent="LILITH / "+m.floor.toUpperCase()+" / "+m.id.toUpperCase();top.append(p);
 let fig=document.createElement("div");fig.className="inspect-picture";let tile=document.createElement("div");tile.style.cssText="width:78%;height:60%;border:1px solid #617078;border-radius:3px;background:"+({ina:"#3b4d53",xl:"#364b57",esp32:"#36534a",tps:"#344e44",oled:"#2d4151"}[m.kind]||"#343f46")+";box-shadow:none;transform:none;display:grid;place-items:center;text-align:center;font:600 14px 'Space Grotesk';padding:9px";tile.textContent=({ina:"INA3221 · R100 ×3",xl:"XL4015 · CC/CV",esp32:"ESP32-S3 · USB-C",tps:"TPS2553 · SOT-23-6",oled:"OLED · SH1106"}[m.kind]||m.name);fig.append(tile);top.append(fig);
 let title=document.createElement("h3");title.className="inspect-title";title.textContent=m.name;top.append(title);
 let badge=document.createElement("div");badge.className="inspect-state "+m.status;badge.textContent=statusText(m.status);top.append(badge);
 let desc=document.createElement("p");desc.className="inspect-desc";desc.textContent=m.desc;top.append(desc);el.append(top);
 const purpose=capabilityProfiles[m.id];
 if(purpose){
  let section=document.createElement("section");section.className="detail-section inspector-purpose";
  let heading=document.createElement("h4");heading.textContent="FUNCIÓN Y APLICACIÓN";section.append(heading);
  let sub=document.createElement("strong");sub.textContent=purpose.role;section.append(sub);
  let explanation=document.createElement("p");explanation.textContent=purpose.use;section.append(explanation);el.append(section);
 }
 let sect=document.createElement("section");sect.className="detail-section";let h=document.createElement("h4");h.textContent="ESPECIFICACIONES";sect.append(h);
 [["TENSIÓN",m.v],["CONECTORES / DATOS",m.io],["UBICACIÓN INTERNA",m.floor.toUpperCase()],["ACCESO OPERATIVO ARRIBA",accessFor(m)]].forEach(([k,v])=>{let row=document.createElement("div");row.className="spec";let a=document.createElement("span"),b=document.createElement("b");a.textContent=k;b.textContent=v;row.append(a,b);sect.append(row);});el.append(sect);
 sect=document.createElement("section");sect.className="detail-section";h=document.createElement("h4");h.textContent="SIGUIENTE PASO";sect.append(h);p=document.createElement("div");p.className="nextstep";p.textContent=m.next;sect.append(p);el.append(sect);
 sect=document.createElement("section");sect.className="detail-section";h=document.createElement("h4");h.textContent="MÓDULOS RELACIONADOS";sect.append(h);let group=document.createElement("div");group.className="related-list";m.links.forEach(id=>{if(!index[id])return;let b=document.createElement("button");b.textContent=index[id].name;b.addEventListener("click",()=>select(id));group.append(b);});sect.append(group);el.append(sect);
 p=document.createElement("div");p.className="detail-warning";p.textContent="En uso normal se opera desde PANEL o TAPA, sin levantar pisos. El visor solo reserva superficies; posiciones, separación RF y huellas reales requieren medición antes de fabricar.";el.append(p);$("inspectorDoc").href=docs+m.doc;}
function update(){
 $("modeCrumb").textContent=S.mode==="model"?"MODELO 3D":S.mode==="bench"?"BANCO REAL":"CABLEADO";
 $("viewTitle").innerHTML=(S.mode==="model"?"Panel, pantalla e interior":S.mode==="bench"?"Lo que ya funciona":"Conexiones y seguridad")+"<span>.</span>";
 $("viewSubtitle").textContent=S.mode==="model"?"Panel y marco del LCD son accesibles; los otros pisos son solo infraestructura. Selecciona un nivel para revisar detalles.":S.mode==="bench"?"ESP32, OLED, INA3221 y tres resistencias independientes de 100 Ω.":"Las líneas discontinuas son rutas aún sin montar ni probar.";
 $("floorCaption").innerHTML=(S.mode==="model"?(S.floor==="all"?"PANEL + TAPA + TRES NIVELES INTERNOS":levels.find(x=>x[0]===S.floor)?.[1]||"PISO"):(S.mode==="bench"?"BANCO REAL 3,3 V":"V0.1 PENDIENTE"))+"<small>"+(S.mode==="model"?(S.exploded?"DESPIECE · MEDIDAS ILUSTRATIVAS":"ENSAMBLADO · MEDIDAS ILUSTRATIVAS"):S.mode==="bench"?"ENSAYO COMPROBADO":"12 V → 5 V NO CONECTADOS")+"</small>";
 $("sceneInfoText").textContent=S.mode==="model"?"ARRASTRAR: GIRAR · 2 DEDOS: ZOOM/MOVER":S.mode==="bench"?"I²C 0x40 / 0x3C · GPIO8/9":"RUTAS FUTURAS Y DATOS PROBADOS";
 const jump=$("accessJump");if(jump){
  jump.hidden=S.mode!=="model";
  jump.textContent=S.floor==="panel"?"22 accesos del panel ↓":S.floor==="lid"?"8 accesos de tapa ↓":"30 accesos operativos ↓";
 }
 $("netFilter").hidden=S.mode==="model";$("explodeControls").style.display=S.mode==="model"&&S.floor==="all"?"flex":"none";
 $("modeNav").querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===S.mode));
 $("floorNav").querySelectorAll("[data-floor]").forEach(b=>{b.classList.toggle("active",b.dataset.floor===S.floor);b.disabled=S.mode!=="model";const c=b.querySelector("small");if(c)c.textContent=b.dataset.floor==="panel"?operatingPoints.panel.length+" accesos":b.dataset.floor==="lid"?operatingPoints.lid.length+" accesos":b.dataset.floor==="all"?items.filter(m=>["lid","panel","electronics","power","base"].includes(m.floor)&&!["sw0","sw1"].includes(m.id)).length:items.filter(m=>m.floor===b.dataset.floor&&!["sw0","sw1"].includes(m.id)).length;});
 $("statusFilters").querySelectorAll("[data-status]").forEach(b=>b.classList.toggle("active",b.dataset.status===S.status));
 $("netFilter").querySelectorAll("[data-net]").forEach(b=>b.classList.toggle("active",b.dataset.net===S.net));
 $("assembledBtn").classList.toggle("active",!S.exploded);$("explodedBtn").classList.toggle("active",S.exploded);
 $("selectedMiniText").textContent=index[S.selected]?.name||"";$("selectedMini").hidden=!(W<760);
 inventory();inspector();render();
}
// Controles tipo visor CAD: arrastrar = orbitar en dirección natural;
// Shift/ratón derecho = desplazar; dos dedos = pellizcar y desplazar.
// Los gestos multitáctiles no deben activar selección accidental.
const activePointers=new Map();
let moved=false,hadMultiTouch=false,pinchDistance=0,pinchCenter=null;
const at=e=>{const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const midpoint=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
const sensitivity=()=>2.9/Math.max(380,Math.min(W,900));
const verticalSensitivity=()=>1.5/Math.max(400,Math.min(H,850));
function resetView(){S.yaw=-.55;S.pitch=.62;S.zoom=1;S.panX=0;S.panY=0;render();}
function endPointer(e){
  if(!activePointers.has(e.pointerId))return;
  const point=activePointers.get(e.pointerId);
  const canSelect=activePointers.size===1&&!moved&&!hadMultiTouch&&point.mode==="orbit";
  activePointers.delete(e.pointerId);
  if(canSelect){const id=pick(at(e));if(id)select(id);}
  if(activePointers.size<2){pinchDistance=0;pinchCenter=null;}
  if(activePointers.size===0){
    moved=false;hadMultiTouch=false;
    canvas.classList.remove("dragging");
  }
}
canvas.addEventListener("pointerdown",e=>{
  if(e.pointerType==="mouse"&&e.button!==0&&e.button!==2)return;
  const p=at(e);
  if(activePointers.size===0){moved=false;hadMultiTouch=false;}
  activePointers.set(e.pointerId,{x:p.x,y:p.y,start:p,mode:e.button===2||e.shiftKey?"pan":"orbit"});
  if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId);
  canvas.classList.add("dragging");
  if(activePointers.size>=2){
    hadMultiTouch=true;moved=true;
    const two=[...activePointers.values()].slice(0,2);
    pinchDistance=distance(two[0],two[1]);
    pinchCenter=midpoint(two[0],two[1]);
  }
});
canvas.addEventListener("pointermove",e=>{
  const previous=activePointers.get(e.pointerId);
  if(!previous)return;
  const now=at(e),dx=now.x-previous.x,dy=now.y-previous.y;
  previous.x=now.x;previous.y=now.y;
  if(distance(now,previous.start)>6)moved=true;
  if(activePointers.size>=2){
    hadMultiTouch=true;moved=true;
    const two=[...activePointers.values()].slice(0,2);
    const center=midpoint(two[0],two[1]),d=distance(two[0],two[1]);
    if(pinchCenter){
      S.panX+=center.x-pinchCenter.x;
      S.panY+=center.y-pinchCenter.y;
    }
    if(pinchDistance>10&&d>10)S.zoom=lim(S.zoom*d/pinchDistance,.55,2.5);
    pinchCenter=center;pinchDistance=d;
  }else if(!hadMultiTouch&&moved){
    if(previous.mode==="pan"){
      S.panX+=dx;S.panY+=dy;
    }else{
      // La implementación anterior sumaba dx y restaba dy: sensación invertida.
      S.yaw-=dx*sensitivity();
      S.pitch=lim(S.pitch+dy*verticalSensitivity(),.16,1.38);
    }
  }
  render();
});
canvas.addEventListener("pointerup",endPointer);
canvas.addEventListener("pointercancel",e=>{
  if(!activePointers.has(e.pointerId))return;
  activePointers.delete(e.pointerId);
  if(activePointers.size<2){pinchDistance=0;pinchCenter=null;}
  if(!activePointers.size){moved=false;hadMultiTouch=false;canvas.classList.remove("dragging");}
});
canvas.addEventListener("lostpointercapture",e=>{
  if(!activePointers.has(e.pointerId))return;
  activePointers.delete(e.pointerId);
  if(activePointers.size<2){pinchDistance=0;pinchCenter=null;}
  if(!activePointers.size){moved=false;hadMultiTouch=false;canvas.classList.remove("dragging");}
});
canvas.addEventListener("contextmenu",e=>e.preventDefault());
canvas.addEventListener("wheel",e=>{
  e.preventDefault();
  const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?H:1);
  S.zoom=lim(S.zoom*Math.exp(-pixels*.0011),.55,2.5);
  render();
},{passive:false});
canvas.addEventListener("keydown",e=>{
  let handled=true;
  switch(e.key){
    case "ArrowLeft":S.yaw+=.12;break;
    case "ArrowRight":S.yaw-=.12;break;
    case "ArrowUp":S.pitch=lim(S.pitch-.10,.16,1.38);break;
    case "ArrowDown":S.pitch=lim(S.pitch+.10,.16,1.38);break;
    case "+":case "=":S.zoom=lim(S.zoom*1.12,.55,2.5);break;
    case "-":case "_":S.zoom=lim(S.zoom/1.12,.55,2.5);break;
    case "Home":case "0":resetView();break;
    default:handled=false;
  }
  if(handled){e.preventDefault();render();}
});
$("modeNav").addEventListener("click",e=>{let b=e.target.closest("[data-mode]");if(!b)return;S.mode=b.dataset.mode;S.selected=S.mode==="bench"?"ina":S.mode==="circuit"?"xl":"esp32";update();});
$("floorNav").addEventListener("click",e=>{let b=e.target.closest("[data-floor]");if(!b||S.mode!=="model")return;S.floor=b.dataset.floor;update();});
$("statusFilters").addEventListener("click",e=>{let b=e.target.closest("[data-status]");if(!b)return;S.status=b.dataset.status;update();});
$("netFilter").addEventListener("click",e=>{let b=e.target.closest("[data-net]");if(!b)return;S.net=b.dataset.net;update();});
$("searchInput").addEventListener("input",e=>{S.q=e.target.value.trim().toLowerCase();inventory();render();});
$("assembledBtn").addEventListener("click",()=>{S.exploded=false;update();});$("explodedBtn").addEventListener("click",()=>{S.exploded=true;update();});
$("zoomIn").addEventListener("click",()=>{S.zoom=lim(S.zoom+.13,.55,2.4);render();});$("zoomOut").addEventListener("click",()=>{S.zoom=lim(S.zoom-.13,.55,2.4);render();});
$("resetCamera").addEventListener("click",resetView);
$("openBench").addEventListener("click",()=>{S.mode="bench";S.selected="ina";update();$("viewer").scrollIntoView({behavior:"smooth",block:"center"});});
$("mobileInventoryToggle").addEventListener("click",()=>{let yes=$("inventorySection").classList.toggle("open");$("mobileInventoryToggle").setAttribute("aria-expanded",String(yes));});
$("openInspector").addEventListener("click",()=>$("inspector").scrollIntoView({behavior:"smooth",block:"start"}));
// Los dos planos de reserva en milímetros son interactivos: abren la ficha del componente.
// Su presencia en plano no equivale a compra, montaje, corte ni validación de espacio.
if(typeof document.querySelectorAll==="function"){
 document.querySelectorAll(".plan-hit[data-part]").forEach(node=>{
  const open=()=>{
   const m=index[node.getAttribute("data-part")];if(!m)return;
   S.mode="model";S.floor=m.floor;S.selected=m.id;update();
   $("inspector").scrollIntoView({behavior:"smooth",block:"start"});
  };
  node.addEventListener("click",open);
  node.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
 });
}
renderOperatingPoints();
setupCapabilityExplorer();
const accessJump=$("accessJump");
if(accessJump)accessJump.addEventListener("click",()=>{$("operatingOverview").scrollIntoView({behavior:"smooth",block:"start"});});
$("moduleTotal").textContent=items.filter(m=>["lid","panel","electronics","power","base"].includes(m.floor)&&!["sw0","sw1"].includes(m.id)).length;
if(typeof ResizeObserver==="function"){new ResizeObserver(resize).observe(canvas);}else{window.addEventListener("resize",resize);}update();resize();
})();