/* Lilith Explorer V2 | 2026-10-17
   Physical boards are carefully drawn illustrative vectors, NOT 1:1 CAD;
   bench wires correspond to verified breadboard NETS, not photogrammetry.
   No connection to hardware is implemented. */
(function(){
"use strict";

var DOC="https://github.com/Jesus-Medina/Cyberdeck-R5-ESP32/blob/main/docs/";
var LAYERS=[
 {id:"base",title:"04 · BASE ESTRUCTURAL",subtitle:"DELL / REFRIGERACIÓN"},
 {id:"power",title:"03 · ENERGÍA Y SEGURIDAD",subtitle:"FUENTES / REGULACIÓN / PROTECCIÓN"},
 {id:"modules",title:"02 · ELECTRÓNICA",subtitle:"CONTROL / RADIO / INSTRUMENTOS"},
 {id:"panel",title:"01 · PANEL SUPERIOR",subtitle:"INTERFACES / ACCESIBILIDAD"}
];
var layerIndex={base:0,power:1,modules:2,panel:3};
var items=[
 {id:"dell",name:"Dell Vostro 3405",kind:"laptop",floor:"base",status:"owned",x:140,y:106,w:660,h:385,tag:"EQUIPO PRINCIPAL",supply:"Batería/cargador Dell original",io:"USB y periféricos Dell",summary:"Computador principal Ryzen 5 3450U, 12 GB de RAM, SSD de 256 GB. Ya comprado y operativo como notebook. Su integración mecánica con el maletín y la batería principal sigue pendiente.",next:"Medir volumen interior, cargador Dell e interferencias con la ventilación.",related:["usbhub","dcdc","case"],doc:"22-lilith-build-status-2026-10-17.md"},
 {id:"case",name:"Maletín Easy 16″",kind:"case",floor:"base",status:"owned",x:12,y:12,w:190,h:100,tag:"40,6 × 33 × 17,4 CM EXTERIORES",supply:"No aplica",io:"Estructura sin perforaciones",summary:"El maletín define el espacio, alturas, bandejas y ubicación de antenas. Sus medidas exteriores están documentadas; las cotas interiores aún deben levantarse.",next:"Medir el interior real, hacer plantillas de cartón y validar paneles de PVC espumado.",related:["dell","keyboard","antenna"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"cool",name:"Ventilación y térmica",kind:"fan",floor:"base",status:"planned",x:800,y:155,w:147,h:115,tag:"PENDIENTE DE DISEÑO",supply:"5 V o 12 V según ventilador",io:"Sensor térmico/ESP32 previsto",summary:"Refrigeración auxiliar independiente de la del Dell. Sin perforar la carcasa no se puede asumir que habrá suficiente renovación de aire.",next:"Hacer ensayos térmicos con potencia real antes de fijar ventiladores y convertidores.",related:["dell","esp"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"usbhub",name:"Hub USB",kind:"usb",floor:"base",status:"planned",x:56,y:508,w:240,h:103,tag:"BACKBONE USB",supply:"5 V según modelo",io:"USB al Dell",summary:"Distribuidor USB que deberá evitar realimentación hacia el notebook. Los puertos con control individual requieren hardware compatible.",next:"Seleccionar modelo y comprobar consumo y aislamiento de VBUS.",related:["dell","sdr","wifi"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"lifepo",name:"LiFePO4 4S",kind:"battery",floor:"power",status:"planned",x:68,y:150,w:300,h:170,tag:"BATERÍA PRINCIPAL V1 PRO",supply:"12,8 V nominal · 10 Ah objetivo",io:"BMS / cargador / fusible por seleccionar",summary:"Batería principal futura. Aún no consta adquirida. La capacidad y la ubicación no están aprobadas hasta medir autonomía, masa y medidas interiores.",next:"Elegir pack comercial con BMS integrado, fusible próximo a batería y cargador compatible.",related:["dcdc","mux","buck"],doc:"21-portable-power-architecture.md"},
 {id:"meanwell",name:"Mean Well 12 V",kind:"adapter",floor:"power",status:"owned",x:32,y:363,w:218,h:132,tag:"FUENTE EXTERNA · BANCO",supply:"12 V DC / 5 A nominal",io:"Jack 5,5 × 2,1 mm, centro + previsto",summary:"Fuente GST60A12-P1J físicamente disponible. Solo se usa para pruebas de banco; no estará montada como batería dentro del Cyberdeck ni sirve para cargar LiFePO4.",next:"Medir polaridad y tensión antes de conectar XL4015. La fuente AC permanece cerrada.",related:["fuse","sw0","buck"],doc:"17-v0.1-final-bom-checklist.md"},
 {id:"fuse",name:"Fusible y entrada",kind:"fuse",floor:"power",status:"owned",x:286,y:367,w:145,h:97,tag:"5×20 · 2 A LENTO",supply:"12 V, protección de banco",io:"Jack y portafusible",summary:"Jack DC y portafusibles registrados en compras. El fusible lento de 2 A solo está dimensionado para el banco V0.1, no para toda la V1 Pro.",next:"Confirmar valor del fusible, terminales jack y ratings de cables/conectores.",related:["meanwell","sw0","buck"],doc:"17-v0.1-final-bom-checklist.md"},
 {id:"buck",name:"XL4015 CC/CV",kind:"xl4015",floor:"power",status:"owned",x:468,y:115,w:226,h:149,tag:"BUCK 12 V → 5,00 V",supply:"Entrada 12 V de banco",io:"Bus AUX 5 V",summary:"Convertidor reductor comprado y físicamente presente, todavía no integrado en el circuito. No puede elevar directamente los 5 V del USB de emergencia Dell.",next:"Identificar terminales y ajustar 5,00 V sin conectar ESP32; ensayar cargas de potencia y temperatura.",related:["meanwell","fuse","tps1","tps2"],doc:"22-lilith-build-status-2026-10-17.md"},
 {id:"tps1",name:"TPS2553 · salida 1",kind:"tps",floor:"power",status:"owned",x:742,y:102,w:165,h:113,tag:"SOT-23-6 / ADAPTADOR VACÍO",supply:"Rama protegida prevista de 5 V",io:"EN · FAULT · ILIM · INA CH1",summary:"El IC minúsculo fue comprado SUELTO. El dibujo muestra el chip junto al adaptador, no un componente ya soldado. La limitación/corte aún no está validada.",next:"Practicar soldadura SMD y montar el chip, inspeccionar pin 1/puentes y probar EN/FAULT con carga resistiva.",related:["buck","ina","tps2"],doc:"24-lilith-smd-assembly.md"},
 {id:"tps2",name:"TPS2553 · salida 2",kind:"tps",floor:"power",status:"owned",x:742,y:255,w:165,h:113,tag:"SOT-23-6 / SIN SOLDAR",supply:"Rama protegida prevista de 5 V",io:"EN · FAULT · ILIM · INA CH2",summary:"Segundo canal protegido de la V0.1. Tenemos cinco TPS2553 en el inventario de compras, pero ninguna salida final está montada o probada todavía.",next:"Montar y probar individualmente el segundo TPS2553; no conectar RF/SDR antes de verificar las protecciones.",related:["buck","ina","tps1"],doc:"24-lilith-smd-assembly.md"},
 {id:"mux",name:"Selector AUX / respaldo",kind:"mux",floor:"power",status:"planned",x:437,y:445,w:185,h:109,tag:"DOS FUENTES / SIN RETORNO",supply:"LiFePO4 / USB Dell (potencia por medir)",io:"Break-before-make + bloqueo inverso",summary:"Selector futuro para respaldar AUX con el Dell sin paralelizar baterías ni permitir que Dell cargue LiFePO4. La corriente real disponible en USB Dell sigue sin medirse.",next:"Medir presupuesto USB, diseñar selector con interbloqueo hardware y conversión apropiada.",related:["lifepo","dcdc","buck"],doc:"21-portable-power-architecture.md"},
 {id:"dcdc",name:"DC-DC del Dell",kind:"dcdc",floor:"power",status:"planned",x:686,y:456,w:197,h:99,tag:"ENTRADA NORMAL DELL",supply:"LiFePO4 4S → valor por medir",io:"Conector, potencia y pin de ID Dell",summary:"Convertidor independiente que alimentará al notebook por su entrada normal y no por su puerto USB. No está comprado ni configurado.",next:"Leer el cargador original Dell: V/A/W, polaridad, conector e identificación antes de comprar.",related:["dell","lifepo","mux"],doc:"21-portable-power-architecture.md"},
 {id:"esp",name:"ESP32-S3 N16R8",kind:"esp32",floor:"modules",status:"tested",x:120,y:148,w:240,h:153,tag:"SUPERVISOR REV1.2 · PROBADO",supply:"3,3 V por regulador USB, solo prueba",io:"SDA GPIO8 · SCL GPIO9",summary:"Supervisor UICPAL ESP32-S3 N16R8 REV1.2 funcionando. Alimenta/consulta OLED e INA en un montaje USB a 3,3 V. El regulador de la placa no está identificado por su marcación.",next:"Exportar sketch Arduino exacto; después diseñar la alimentación externa segura y salidas EN/FAULT.",related:["oled","ina","sw1"],doc:"22-lilith-build-status-2026-10-17.md"},
 {id:"ina",name:"INA3221 · R100",kind:"ina",floor:"modules",status:"tested",x:427,y:151,w:202,h:144,tag:"MONITOR 3 CANALES · 0x40",supply:"VS 3,3 V en banco probado",io:"I²C 0x40, A0 soldado a GND",summary:"Breakout morado con tres shunts R100. Comprobado con tres resistencias separadas a ~32,4–32,8 mA/canal y 3,17 V bajo carga. Todavía no mide salidas TPS de 5 V.",next:"Reutilizar CH1/CH2 para Smart Out 1/2 y CH3 para supervisor tras validar el rail y las corrientes reales.",related:["esp","oled","tps1","tps2"],doc:"22-lilith-build-status-2026-10-17.md"},
 {id:"oled",name:"OLED SH1106 1,3″",kind:"oled",floor:"modules",status:"tested",x:672,y:139,w:216,h:135,tag:"128×64 I²C · 0x3C",supply:"3,3 V desde ESP32",io:"I²C GPIO8/GPIO9",summary:"Pantalla real de prueba, controlada desde ESP32 usando U8g2. Dirección I²C confirmada 0x3C.",next:"Mantener cableado probado mientras incorporamos estados, errores y control del futuro power manager.",related:["esp","ina"],doc:"22-lilith-build-status-2026-10-17.md"},
 {id:"lora",name:"Módulo LoRa",kind:"lora",floor:"modules",status:"owned",x:90,y:368,w:168,h:112,tag:"RF / FRECUENCIA POR VERIFICAR",supply:"Según breakout real",io:"SPI/UART por verificar",summary:"LoRa y antenas constan en componentes del proyecto, pero no se ha validado una conexión definitiva, banda ni lectura real de hardware en Lilith.",next:"Identificar referencia exacta, frecuencia, tipo de conector y tensión; no asumir compatibilidad de antena.",related:["antenna","esp"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"cyd",name:"ESP32 CYD táctil",kind:"display",floor:"modules",status:"planned",x:298,y:362,w:204,h:137,tag:"DISPLAY DE LABORATORIO",supply:"5 V/3,3 V según placa elegida",io:"USB/SPI internos según modelo",summary:"Pantalla táctil de experimentos independiente del supervisor. No hay montaje del CYD validado en la protoboard actual.",next:"Confirmar modelo, medidas y espacio junto al panel principal.",related:["esp","panel"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"sdr",name:"RTL-SDR",kind:"sdr",floor:"modules",status:"planned",x:583,y:389,w:176,h:87,tag:"RECEPCIÓN RF · USB",supply:"5 V por USB según modelo",io:"USB al Dell / antena",summary:"Receptor SDR previsto para radio/mediciones. Modelo y montaje no verificados; posición mostrada es ilustrativa.",next:"Elegir hardware, medir consumo y planificar conectores/ruido RF.",related:["antenna","dell"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"antenna",name:"Antenas RF",kind:"antenna",floor:"modules",status:"owned",x:775,y:389,w:154,h:105,tag:"SMA / RP-SMA · SIN SALIENTES",supply:"Sin alimentación directa",io:"Radiofrecuencia LoRa/Wi-Fi/SDR",summary:"Se compraron antenas. Deben quedar alojadas al cerrar el maletín impermeable, sin sobresalir ni perforar la carcasa.",next:"Inspeccionar conectores, longitudes, frecuencias y distribución RF real.",related:["lora","sdr","case"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"keyboard",name:"Teclado Bluetooth",kind:"keyboard",floor:"panel",status:"owned",x:100,y:248,w:606,h:259,tag:"TECLADO PLEGABLE + TRACKPAD",supply:"Batería interna del teclado",io:"Bluetooth al Dell",summary:"Teclado plegable con Ñ y trackpad para el plano de trabajo. El modelo dibujado es referencial; aún falta medirlo para asegurar el cierre.",next:"Medir teclado abierto/cerrado y definir guardado sin sobresalir.",related:["dell","case"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"sws",name:"6 palancas + 6 basculantes",kind:"switches",floor:"panel",status:"owned",x:116,y:80,w:430,h:124,tag:"PANEL MANUAL · 12 SWITCHES",supply:"Corte/control DC; rating por verificar",io:"SW0 MASTER / SW1 SUP / canales",summary:"Doce interruptores físicos comprados: 6 de palanca SPST y 6 basculantes ON/OFF. Todavía no se han asignado ni cableado; no equivalen a doce canales protegidos.",next:"Verificar contactos y rating DC de cada switch; luego reservar SW0/SW1 y asignar controles restantes.",related:["sw0","sw1","tps1"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"ports",name:"Panel de conexiones",kind:"ports",floor:"panel",status:"planned",x:733,y:90,w:173,h:282,tag:"USB / GPIO / DC / LAB",supply:"Varios rails protegidos, por diseñar",io:"USB, GPIO, fuente LAB",summary:"Puertos de laboratorio previstos. No hay pinout/posición final validada. Evitaremos perforaciones en el cuerpo impermeable del maletín.",next:"Diseñar espaciado y cargas de cada puerto después de levantar medidas reales.",related:["case","sws","esp"],doc:"23-lilith-power-budget-and-pending-parts.md"},
 {id:"sw0",name:"SW0 MASTER AUX",kind:"toggle",floor:"panel",status:"owned",x:741,y:414,w:75,h:81,tag:"FUNCIÓN POR CABLEAR",supply:"Corte 12 V AUX",io:"Fusible → SW0 → XL4015",summary:"La función SW0 NO se montó aún. Deberá realizar corte físico de todo AUX, con rating DC comprobado.",next:"Verificar continuidad con multímetro sin alimentación y cablear tras fusible.",related:["fuse","buck","sws"],doc:"20-v0.1-wiring-netlist.md"},
 {id:"sw1",name:"SW1 SUPERVISOR",kind:"toggle",floor:"panel",status:"owned",x:835,y:414,w:75,h:81,tag:"FUNCIÓN POR CABLEAR",supply:"Corte rail supervisor 5 V",io:"Bus 5 V → SW1 → INA CH3",summary:"SW1 tampoco se ha instalado. Debe permitir cortar físicamente ESP32/OLED/INA (según arquitectura) sin intervenir el Dell.",next:"Definir fuente del supervisor y evitar USB + 5 V externo simultáneo.",related:["esp","ina","sws"],doc:"20-v0.1-wiring-netlist.md"}
];
var part={};items.forEach(function(m){part[m.id]=m;});
var benchItems=[
 {id:"esp",x:97,y:164,w:245,h:155},
 {id:"ina",x:418,y:153,w:223,h:156},
 {id:"oled",x:709,y:150,w:205,h:142},
 {id:"r1",x:198,y:385,w:132,h:66},
 {id:"r2",x:429,y:385,w:132,h:66},
 {id:"r3",x:656,y:385,w:132,h:66}
];
var diagramItems=[
 {id:"meanwell",x:32,y:153,w:180,h:108},
 {id:"fuse",x:251,y:158,w:126,h:94},
 {id:"sw0",x:410,y:163,w:87,h:91},
 {id:"buck",x:538,y:144,w:185,h:128},
 {id:"tps1",x:740,y:130,w:133,h:99},
 {id:"tps2",x:744,y:293,w:133,h:99},
 {id:"sw1",x:534,y:368,w:87,h:86},
 {id:"ina",x:376,y:466,w:195,h:127},
 {id:"esp",x:115,y:439,w:203,h:123},
 {id:"oled",x:670,y:473,w:190,h:109}
];
// Records: from,to,type,verified,label.
// Verified means the corresponding electrical relationship was checked at 3V3 bench.
var benchNets=[
 ["esp","ina","power",true,"3V3 → FILA 5"],["esp","oled","power",true,"3V3 · 0x3C"],
 ["esp","ina","ground",true,"GND · FILA 2"],["esp","oled","ground",true,"GND"],
 ["esp","ina","i2c",true,"SDA GPIO8 / FILA 10"],["esp","ina","i2c",true,"SCL GPIO9 / FILA 15"],
 ["esp","oled","i2c",true,"I²C 8/9"],["ina","r1","power",true,"VIN1− → R1"],["ina","r2","power",true,"VIN2− → R2"],["ina","r3","power",true,"VIN3− → R3"]
];
var designNets=[
 ["meanwell","fuse","power",false,"12 V"],["fuse","sw0","power",false,"12 V / FUSIBLE"],
 ["sw0","buck","power",false,"12 V DC"],["buck","tps1","power",false,"5 V"],
 ["buck","tps2","power",false,"5 V"],["buck","sw1","power",false,"5 V"],
 ["tps1","ina","power",false,"CH1"],["tps2","ina","power",false,"CH2"],
 ["sw1","ina","power",false,"CH3"],["ina","esp","power",false,"5 V SUP."],
 ["esp","ina","i2c",true,"I²C · PROBADO A 3,3 V"],["esp","oled","i2c",true,"I²C · PROBADO"],
 ["esp","ina","ground",true,"GND · BANCO"]
];
var MODE_LABEL={physical:"MAQUETA FÍSICA",bench:"BANCO PROBADO",wiring:"CABLEADO OBJETIVO"};
var COLORS={power:"#e7ac84",i2c:"#dca0d3",ground:"#a6a4c7"};
var state={mode:"physical",layer:"modules",status:"all",query:"",selected:"esp",rx:54,rz:-25,zoom:1,net:"all"};
var $=function(id){return document.getElementById(id);};
var stack=$("stack"),stage=$("stage"),viewport=$("viewport"),camera=$("camera"),overlay=$("netOverlay");
function esc(v){return String(v).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];});}
function srect(x,y,w,h,color,stroke,r){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r||3)+'" fill="'+color+'"'+(stroke?' stroke="'+stroke+'" stroke-width="1.8"':'')+'/>';}
function stxt(x,y,str,size,color,weight){return '<text x="'+x+'" y="'+y+'" fill="'+(color||"#e8e1e8")+'" font-family="monospace" font-weight="'+(weight||"600")+'" font-size="'+(size||10)+'">'+esc(str)+'</text>';}
function circles(x,y,num,dx,dy,color){var o="";for(var i=0;i<num;i++)o+='<circle cx="'+(x+dx*i)+'" cy="'+(y+dy*i)+'" r="3.5" fill="'+(color||"#d7a678")+'" stroke="#372831" stroke-width="1"/>';return o;}
function pinsTop(bottom){var o="";for(var i=0;i<12;i++){o+=srect(25+i*23,bottom?158:11,12,13,"#c2a17b","#74513d",2);}return o;}
function traceLines(){var p="";for(var i=0;i<8;i++){p+='<path d="M '+(40+i*25)+' 27 V '+(50+i*4)+' H '+(72+i*22)+' V 143" stroke="#a5b978" opacity=".19" stroke-width="1.4" fill="none"/>';}return p;}
function centralChip(x,y,w,h,label){var r=srect(x,y,w,h,"#171a20","#6a6d76",3);for(var k=0;k<6;k++){var yy=y+5+k*((h-10)/6);r+=srect(x-6,yy,6,3,"#c3b9ad")+" "+srect(x+w,yy,6,3,"#c3b9ad");}return r+stxt(x+5,y+h/2,label,Math.max(7,Math.min(11,w/7)),"#d3d8df");}
function pcb(col,stroke){return srect(6,6,308,168,col,stroke,9)+'<rect x="14" y="14" width="292" height="152" rx="7" fill="none" stroke="#ffffff" stroke-opacity=".10"/>'+traceLines()+circles(18,18,1,0,0,"#e4cc91")+circles(299,18,1,0,0,"#e4cc91")+circles(18,161,1,0,0,"#e4cc91")+circles(299,161,1,0,0,"#e4cc91");}
function boardSVG(kind,id){
 var a="",base="",body="",label="",palette="#16292a";
 if(kind==="esp32"){base=pcb("#152123","#557a77")+pinsTop(false)+pinsTop(true);body=srect(73,33,167,112,"#bec6c6","#dfe3e1",7)+srect(83,44,148,87,"#a7afb3","#58666d",5)+centralChip(114,65,77,44,"ESP32-S3")+stxt(96,53,"ESPRESSIF",10,"#262f39")+stxt(99,122,"N16R8 / Wi-Fi BLE",9,"#26343c")+srect(10,58,52,61,"#717780","#c6cbd1",9)+srect(17,70,40,34,"#181c23","#b4b9bd",7)+stxt(15,140,"USB-C",9,"#c2cad2")+stxt(251,49,"BOOT",9,"#e0e9e6")+stxt(244,140,"GPIO",10,"#dedac4");}
 else if(kind==="ina"){base=pcb("#49266d","#a77cca")+pinsTop(false)+pinsTop(true);body=stxt(26,42,"INA3221",18,"#f0e3ff")+stxt(25,56,"3-CHANNEL HIGH SIDE",9,"#bda6d1");for(var i=0;i<3;i++){body+=srect(34+i*92,87,73,34,"#d9d7d7","#f4ffff",3)+stxt(43+i*92,108,"R100",16,"#292326")+stxt(47+i*92,138,"CH"+(i+1),11,"#d4beec");}body+=stxt(25,70,"VS GND SCL SDA",9,"#d9c9ff")+stxt(225,69,"A0=GND",9,"#e2c6f7");}
 else if(kind==="oled"){base=pcb("#1e2734","#687e9f");body=srect(34,16,252,146,"#030409","#747681",10)+srect(45,27,230,124,"#08111b","#18283e",6)+stxt(61,53,"LILITH",21,"#c8a1c6")+stxt(61,84,"3.17 V",22,"#c2b7d9")+stxt(61,109,"CH1  32.8mA",13,"#e7a8bb")+stxt(61,131,"INA3221  0x40",10,"#a4b1c6")+circles(26,83,1,0,0,"#e5ad87")+circles(296,83,1,0,0,"#e5ad87");}
 else if(kind==="xl4015"){base=pcb("#174e88","#4f9cc1");body=stxt(29,34,"XL4015  CC / CV",16,"#dce8ff")+srect(30,62,73,72,"#283641","#7b9eac",7)+'<circle cx="67" cy="97" r="30" fill="#333d44" stroke="#85959d" stroke-width="4"/>'+'<circle cx="67" cy="97" r="22" fill="#af875b" stroke="#6e5144" stroke-width="9"/>'+srect(127,72,65,42,"#192c39","#98b0bc",4)+stxt(137,96,"XL4015",10,"#c6d7ec");for(var z=0;z<2;z++){body+=srect(222+z*38,46,28,65,"#353b4a","#aab8c6",6)+srect(226+z*38,42,20,6,"#d1cfd0");}for(var n=0;n<2;n++){body+=srect(127+n*57,132,37,28,"#276788","#83a6ba",3)+'<circle cx="'+(145+n*57)+'" cy="146" r="9" fill="#e7cc73" stroke="#cb9a41" stroke-width="3"/>';}body+=stxt(31,157,"IN+  IN-",9,"#e6effc")+stxt(223,156,"OUT+ -",9,"#e6effc");}
 else if(kind==="tps"){base=pcb("#205b48","#69ac91");body=stxt(20,37,"TPS2553",18,"#dbf0df")+stxt(20,54,"BREAKOUT · SOT23-6",10,"#cfdfd8");body+=srect(100,75,117,77,"#326952","#a8c4ad",4);for(var u=0;u<6;u++){body+=srect(108+(u%3)*40,80+Math.floor(u/3)*56,19,13,"#b7a896","#e6d4b8",2);}body+=srect(242,72,47,42,"#15171c","#aeb1b5",5)+stxt(248,94,"IC",15,"#eee")+stxt(226,134,"SUELTO",10,"#e4c8b2")+stxt(102,166,"SIN SOLDAR",13,"#f0dcba");}
 else if(kind==="battery"){base=srect(6,6,308,168,"#383840","#9894a3",13);body=srect(20,20,280,140,"#253436","#536869",9)+srect(35,41,250,62,"#9ba6a0","#c2d4bf",4)+stxt(53,66,"LiFePO4",25,"#233b35")+stxt(54,85,"12.8V   4S / BMS",12,"#34564f")+stxt(42,133,"PACK OBJETIVO · NO COMPRADO",10,"#d9ddd2")+srect(80,5,38,22,"#2b2b34","#c07f6a",4)+srect(235,5,38,22,"#2b2b34","#c07f6a",4);}
 else if(kind==="adapter"){base=srect(20,25,276,118,"#232329","#85858a",19);body=srect(38,42,242,83,"#17191d","#303b41",9)+stxt(53,67,"MEAN WELL",18,"#e8ebea")+stxt(53,87,"GST60A12-P1J",13,"#bcc9c9")+stxt(53,105,"OUTPUT: 12V --- 5A",12,"#b6c0c1")+'<path d="M 19 82 C -7 60 -8 42 -4 29" stroke="#1e1d20" stroke-width="10" fill="none"/>'+'<path d="M 296 84 C 332 84 334 70 345 71" stroke="#202326" stroke-width="10" fill="none"/>'+stxt(27,155,"FUENTE EXTERNA / BANCO",12,"#d9b49d");}
 else if(kind==="laptop"){base=srect(10,16,300,151,"#34353b","#9b9c9b",11);body=srect(25,29,270,123,"#14171c","#737b83",5);for(var row=0;row<5;row++){for(var col=0;col<13;col++){body+=srect(33+col*19,36+row*15,15,11,(row+col)%6===0?"#38404c":"#242933","#5a6069",2);}}body+=srect(120,117,84,28,"#424652","#a1a5ac",5)+stxt(32,162,"DELL VOSTRO 3405",10,"#d7d7d9");}
 else if(kind==="keyboard"){base=srect(13,13,294,146,"#24222c","#8d8290",12);body="";for(var i=0;i<5;i++)for(var j=0;j<12;j++){var x=25+j*18.4,y=27+i*22;body+=srect(x,y,15.6,17,(j+i)%11===0?"#493541":"#33323d","#7b6e7f",3);}body+=srect(247,43,42,90,"#141921","#777b84",5)+stxt(40,148,"TECLADO + TRACKPAD",10,"#d8b7ca");}
 else if(kind==="switches"){base=srect(6,5,308,168,"#302a33","#9b8190",12);body=stxt(18,24,"PANEL 6 PALANCAS + 6 BASCULANTES",12,"#e8cbdb");for(var j=0;j<6;j++){var x=26+j*46;body+='<circle cx="'+(x+12)+'" cy="64" r="18" fill="#46454e" stroke="#ada4ac" stroke-width="4"/><circle cx="'+(x+12)+'" cy="64" r="7" fill="#d1cdd1"/><path d="M '+(x+12)+' 64 l 8 -19" stroke="#dedee0" stroke-width="6" stroke-linecap="round"/>'+srect(x-2,101,40,43,"#171b24","#69616c",5)+srect(x+5,106,25,15,"#3c4853","#848c98",3);}body+=stxt(19,160,"SWITCHES SIN CABLEAR",11,"#dcbdc9");}
 else if(kind==="fuse"){base=srect(8,31,304,119,"#493b2c","#987b5b",11);body=srect(24,69,182,52,"#181b20","#b5a59c",14)+srect(42,80,148,31,"#bac0c5","#eee",15)+srect(42,80,20,31,"#afb2b7","#fafafa",3)+srect(171,80,20,31,"#afb2b7","#fafafa",3)+stxt(71,101,"2A 5×20",13,"#3c3b40")+srect(231,65,61,65,"#181b20","#a69a91",7)+'<circle cx="261" cy="96" r="20" fill="#0e0f11" stroke="#dfc69d" stroke-width="5"/>'+stxt(40,54,"FUSIBLE / JACK",14,"#e8d5bb");}
 else if(kind==="fan"){base=srect(22,4,276,170,"#232630","#727987",14)+srect(36,17,250,145,"#14151c","#727c8b",10);body="";for(var i=0;i<6;i++){body+='<ellipse cx="160" cy="91" rx="30" ry="65" transform="rotate('+(i*60)+' 160 91)" fill="#363e4c" stroke="#5b6573" stroke-width="3"/>';}body+='<circle cx="160" cy="91" r="26" fill="#22242c" stroke="#8f9097" stroke-width="5"/>'+stxt(125,94,"FAN",16,"#b7bfc8");}
 else if(kind==="lora"){base=pcb("#155445","#419b70")+pinsTop(false)+pinsTop(true);body=srect(80,33,167,120,"#bbc5c1","#e8efe5",5)+srect(91,43,145,96,"#929e9b","#bcc6c3",4)+stxt(103,66,"LoRa RADIO",16,"#263d39")+stxt(104,88,"RF FRONTEND",11,"#284c42")+srect(21,60,44,39,"#c5b887","#d4d0b7",5)+'<circle cx="43" cy="79" r="12" fill="#151c20" stroke="#e0d6a4" stroke-width="6"/>'+stxt(257,131,"ANT",10,"#cfe8d5");}
 else if(kind==="sdr"){base=srect(25,44,247,95,"#2c2c35","#92909a",11);body=srect(42,56,209,72,"#141822","#72737e",4)+stxt(71,86,"RTL-SDR",24,"#d6cedd")+stxt(72,110,"USB RADIO",12,"#969aae")+srect(0,71,28,35,"#b9c3c9","#d8dde0",4)+srect(271,72,35,34,"#a6abae","#d4dcdd",10);}
 else if(kind==="antenna"){base=srect(90,144,140,22,"#26282e","#bbb6b6",5);body="";for(var k=0;k<3;k++){body+='<path d="M '+(108+k*48)+' 144 Q '+(95+k*48)+' 85 '+(94+k*48)+' 18" stroke="#17191e" stroke-width="10" fill="none"/><path d="M '+(108+k*48)+' 144 Q '+(95+k*48)+' 85 '+(94+k*48)+' 18" stroke="#777e86" stroke-width="2" fill="none"/>'+srect(97+k*48,126,22,27,"#bcbec0","#eeeeea",5);}body+=stxt(97,161,"SMA",10,"#dcdfe3");}
 else if(kind==="display"){base=pcb("#27406d","#758dbe");body=srect(38,20,243,137,"#080b12","#91a2b7",9)+srect(52,32,213,112,"#192033","#455876",5)+srect(62,48,193,20,"#452943","#9b5883",3)+stxt(82,63,"LILITH",16,"#efbdd7")+srect(65,80,75,49,"#314756","#728ea0",6)+srect(150,80,101,49,"#253a4c","#728ea0",6)+stxt(162,110,"CYD",22,"#e0b0be");}
 else if(kind==="ports"){base=srect(12,9,296,163,"#252431","#9c889c",11);body=stxt(27,30,"INTERFACES AUX",15,"#dec3d2");for(var k=0;k<4;k++){body+=srect(23+k*69,51,53,33,"#101820","#b4a7a9",4)+srect(29+k*69,59,42,16,"#53657c","#6f94b6",2);}for(var v=0;v<4;v++){body+='<circle cx="'+(53+v*67)+'" cy="125" r="16" fill="#090d13" stroke="#b1a295" stroke-width="5"/>';}body+=stxt(38,158,"USB / DC / GPIO / LAB",12,"#ccbdc9");}
 else if(kind==="toggle"){base=srect(42,13,236,151,"#2b2730","#aaa3a9",16);body='<circle cx="160" cy="81" r="51" fill="#45404b" stroke="#a69faa" stroke-width="9"/><circle cx="160" cy="81" r="19" fill="#dad5d3" stroke="#8c838a" stroke-width="4"/><path d="M 162 77 l 34 -43" stroke="#e0ddda" stroke-width="15" stroke-linecap="round"/>'+stxt(126,151,id.toUpperCase(),22,"#dfb6c7");}
 else if(kind==="mux"||kind==="dcdc"){base=pcb("#293c50","#788fa3");body=stxt(35,43,kind==="mux"?"SOURCE SELECTOR":"DC-DC DELL",16,"#d6ebfc")+centralChip(71,59,125,73,kind==="mux"?"POWER MUX":"DC CONVERTER")+srect(234,64,41,65,"#abb8c2","#e4dfea",5)+stxt(223,152,kind==="mux"?"A / B":"DC-IN",12,"#cfdcde");}
 else if(kind==="usb"){base=srect(16,36,273,108,"#292a30","#8b929c",9);body=stxt(39,77,"USB HUB",22,"#c6d0d6");for(var k=0;k<3;k++)body+=srect(35+k*82,97,60,28,"#151a20","#929ca5",4);body+=srect(288,82,30,29,"#a5afb7","#f0e8e8",3);}
 else if(kind==="case"){base=srect(12,12,295,151,"#25212a","#8e838a",18);body=srect(24,24,271,126,"#181620","#4b4650",12)+stxt(53,72,"EASY 16″",26,"#cfb1bf")+stxt(52,96,"40.6 × 33 × 17.4",13,"#b8a4b1")+stxt(55,118,"MEDIDAS EXTERIORES",10,"#9c879c");}
 else {base=pcb("#223b47","#79a0a8");body=centralChip(74,52,170,80,id.toUpperCase());}
 a='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="none" role="img" aria-label="'+esc(id)+' ilustración vectorial referencial">'+base+body+'</svg>';
 return a;
}
function resistorSVG(id){
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="none" role="img" aria-label="Resistencia de prueba 100 ohm"><path d="M 10 92 H 106 M 213 92 H 309" stroke="#c6c9c9" stroke-width="9"/><rect x="96" y="60" width="128" height="65" rx="30" fill="#d8c0a0" stroke="#b18d6c" stroke-width="4"/><path d="M 121 62 V 124" stroke="#734426" stroke-width="16"/><path d="M 155 62 V 124" stroke="#161618" stroke-width="15"/><path d="M 190 62 V 124" stroke="#734426" stroke-width="14"/><text x="119" y="152" fill="#dec5a1" font-size="23" font-family="monospace">100 Ω</text></svg>';
}
function benchBackground(){
 var holes="",tracks="";
 for(var row=0;row<28;row++){
  var yy=76+row*16;
  if(yy>530)break;
  for(var col=0;col<42;col++){var xx=78+col*20;if(xx>900)break; if(col===20||col===21)continue;holes+='<circle cx="'+xx+'" cy="'+yy+'" r="3.3" fill="#a7a39d" stroke="#70706e" stroke-width=".5"/>';}
 }
 var markers=[[2,94],[5,144],[10,224],[15,304],[20,384],[25,464],[30,528]];
 markers.forEach(function(p){tracks+=stxt(16,p[1]+4,String(p[0]),13,"#b6a7a0");});
 return '<div class="bench-substrate" style="position:absolute;inset:32px 25px;background:linear-gradient(165deg,#e0ddd2,#9c9992);border-radius:14px;border:9px solid #484149;box-shadow:0 15px 35px #000b"></div>'+
 '<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 980 650">'+holes+tracks+
 '<path d="M 470 68 V 530" stroke="#5d5555" stroke-width="20" opacity=".32"/>'+
 '<path d="M 40 55 H 932" stroke="#c15467" stroke-width="4" opacity=".55"/>'+
 '<path d="M 40 585 H 932" stroke="#4066a3" stroke-width="4" opacity=".55"/>'+
 stxt(70,45,"V0.1 / PROTOBOARD · DISTRIBUCIÓN ILUSTRATIVA",15,"#453846")+
 stxt(62,613,"FILAS REALES REGISTRADAS: 2, 5, 10, 15, 20/25, 30/35, 40/45",13,"#42343f")+'</svg>';
}
function makeFloor(key){
 var entry=LAYERS.filter(function(x){return x.id===key;})[0];
 var floor=document.createElement("div");floor.className="floor";floor.dataset.floor=key;floor.style.setProperty("--z","0px");
 var head=document.createElement("div");head.className="floor-name";head.textContent=entry.title;var small=document.createElement("small");small.textContent=entry.subtitle;head.append(small);floor.append(head);
 var btn=document.createElement("button");btn.className="floor-button";btn.textContent="INSPECCIONAR PISO ↗";btn.addEventListener("click",function(e){e.stopPropagation();state.layer=key;render();});floor.append(btn);
 var inner=document.createElement("div");inner.className="floor-inner";floor.append(inner);stack.append(floor);return floor;
}
var floors={};LAYERS.forEach(function(l){floors[l.id]=makeFloor(l.id);});
function makeHardware(id,placement,container){
 var m=part[id],btn=document.createElement("button");btn.className="hardware";btn.type="button";btn.dataset.part=id;btn.style.left=placement.x+"px";btn.style.top=placement.y+"px";btn.style.width=placement.w+"px";btn.style.height=placement.h+"px";btn.title=m.name;
 btn.innerHTML=boardSVG(m.kind,id)+'<span class="state-light '+m.status+'"></span><span class="hard-label">'+esc(m.name)+'</span>';
 btn.addEventListener("click",function(e){e.stopPropagation();state.selected=id;if(state.mode==="physical"&&state.layer!=="all"&&m.floor!==state.layer)state.layer=m.floor;render();});
 container.append(btn);return btn;
}
items.forEach(function(m){makeHardware(m.id,m,floors[m.floor].querySelector(".floor-inner"));});
var benchLayer=document.createElement("div");benchLayer.className="floor bench-floor";benchLayer.dataset.floor="bench";benchLayer.innerHTML=benchBackground();stack.append(benchLayer);
benchItems.forEach(function(p){if(part[p.id])makeHardware(p.id,p,benchLayer);else{
 var b=document.createElement("button");b.className="hardware";b.type="button";b.dataset.part=p.id;b.style.left=p.x+"px";b.style.top=p.y+"px";b.style.width=p.w+"px";b.style.height=p.h+"px";b.innerHTML=resistorSVG(p.id)+'<span class="state-light tested"></span><span class="hard-label">'+p.id.toUpperCase()+' · 100 Ω</span>';
 b.addEventListener("click",function(e){e.stopPropagation();state.selected=p.id;render();});benchLayer.append(b);
}});
var wiringLayer=document.createElement("div");wiringLayer.className="floor wiring-floor";wiringLayer.dataset.floor="wiring";wiringLayer.innerHTML='<div class="floor-name">ARQUITECTURA 5 V · NO CABLEADA<small>RUTAS PREVISTAS / CABLES DISCONTINUOS</small></div>';stack.append(wiringLayer);
diagramItems.forEach(function(p){makeHardware(p.id,p,wiringLayer);});
function model(id){
 if(part[id])return part[id];
 var n={r1:1,r2:2,r3:3}[id]||1;
 return {id:id,name:"Resistencia "+n+" · 100 Ω",kind:"res",floor:"bench",status:"tested",tag:"CARGA DE ENSAYO / CH"+n,supply:"3,3 V · 100 Ω · ¼ W",io:"INA VIN"+n+"− → resistencia → GND",summary:"Resistencia real de prueba de 100 Ω, una por cada canal del INA3221. No es un módulo definitivo. A 5 V disiparía 0,25 W, justo su potencia nominal: no usarla como carga de 5 V.",next:"Conservar para banco 3,3 V y emplear resistencias de potencia de 10 W en ensayo 5 V.",related:["ina","esp"],doc:"22-lilith-build-status-2026-10-17.md"};
}
function statusName(s){return s==="tested"?"PROBADO EN BANCO":s==="owned"?"COMPRADO / SIN MONTAR":"PLANIFICADO / SIN PROBAR";}
function isVisible(m){
 var statusOk=state.status==="all"||m.status===state.status;
 var q=(m.name+" "+m.tag+" "+m.summary+" "+m.io).toLowerCase();
 return statusOk&&(!state.query||q.indexOf(state.query)>=0);
}
function listItems(){
 var lst=$("inventory");lst.replaceChildren();
 var all=items.filter(isVisible);
 $("listCount").textContent=all.length;
 all.forEach(function(m){var btn=document.createElement("button");btn.className="inv-item"+(state.selected===m.id?" active":"");var led=document.createElement("i");led.className="state-dot "+m.status;var contents=document.createElement("span");var name=document.createElement("b");name.textContent=m.name;var desc=document.createElement("small");desc.textContent=m.tag;contents.append(name,desc);btn.append(led,contents);btn.addEventListener("click",function(){state.selected=m.id;if(state.mode==="bench"&&m.status!=="tested")state.mode="physical";if(state.mode==="physical")state.layer=m.floor;render();});lst.append(btn);});
 if(!all.length){var empty=document.createElement("p");empty.style.color="#b49da9";empty.textContent="Ningún módulo coincide con el filtro.";lst.append(empty);}
}
function inspector(){
 var m=model(state.selected),el=$("inspectorContent");el.replaceChildren();
 var top=document.createElement("div");top.className="inspect-topblock";
 var eye=document.createElement("div");eye.className="inspect-eyebrow";eye.textContent="LILITH / "+(m.floor||"BANCO").toUpperCase()+" / "+m.id.toUpperCase();top.append(eye);
 var preview=document.createElement("div");preview.className="inspect-preview";preview.innerHTML=m.kind==="res"?resistorSVG(m.id):boardSVG(m.kind,m.id);top.append(preview);
 var name=document.createElement("h3");name.className="inspect-name";name.textContent=m.name;top.append(name);
 var stat=document.createElement("div");stat.className="inspect-state "+m.status;stat.textContent=statusName(m.status);top.append(stat);
 var para=document.createElement("p");para.className="inspect-desc";para.textContent=m.summary;top.append(para);el.append(top);
 var sections=[
 {title:"DATOS FÍSICOS / ELÉCTRICOS",data:[["FUNCIÓN",m.tag],["ALIMENTACIÓN",m.supply],["SEÑALES / CONEXIONES",m.io],["UBICACIÓN",m.floor==="bench"?"Banco de pruebas":m.floor==="base"?"Nivel 4 · Base":m.floor==="power"?"Nivel 3 · Energía":m.floor==="modules"?"Nivel 2 · Electrónica":"Nivel 1 · Panel"]]},
 ];
 sections.forEach(function(s){var wrap=document.createElement("section");wrap.className="inspect-section";var h=document.createElement("h4");h.textContent=s.title;wrap.append(h);s.data.forEach(function(pair){var row=document.createElement("div");row.className="spec";var x=document.createElement("span");x.textContent=pair[0];var y=document.createElement("b");y.textContent=pair[1];row.append(x,y);wrap.append(row);});el.append(wrap);});
 var wrap=document.createElement("section");wrap.className="inspect-section";var h=document.createElement("h4");h.textContent="SIGUIENTE ACCIÓN REAL";wrap.append(h);var line=document.createElement("div");line.className="next";var i=document.createElement("i");i.textContent="01";var txt=document.createElement("span");txt.textContent=m.next;line.append(i,txt);wrap.append(line);el.append(wrap);
 wrap=document.createElement("section");wrap.className="inspect-section";h=document.createElement("h4");h.textContent="MÓDULOS RELACIONADOS";wrap.append(h);var grid=document.createElement("div");grid.className="connections";
 (m.related||[]).forEach(function(id){var other=part[id];if(!other)return;var b=document.createElement("button");b.className="conn";b.textContent=other.name;var s=document.createElement("small");s.textContent=statusName(other.status);b.append(s);b.addEventListener("click",function(){state.selected=other.id;if(state.mode==="bench")state.mode="physical";if(state.mode==="physical")state.layer=other.floor;render();});grid.append(b);});wrap.append(grid);el.append(wrap);
 var dis=document.createElement("div");dis.className="disclaimer";dis.textContent="La placa es una ilustración física referencial; no sustituye fotografía, huella CAD, comprobación de pines ni el esquema eléctrico aprobado.";el.append(dis);
 $("docLink").href=DOC+m.doc;
}
function currentMode(){
 var mode=state.mode;
 $("crumb").textContent=MODE_LABEL[mode];
 var title=mode==="physical"?"Lilith por dentro":mode==="bench"?"Lo que ya funciona":"Cada conexión importa";
 $("sceneTitle").textContent=title+".";var red=$("sceneTitle");var last=document.createElement("span");last.textContent=""; 
 $("sceneCaption").textContent=mode==="physical"?"Desarma el maletín por pisos, rota la maqueta y abre las placas para inspeccionar sus detalles.":mode==="bench"?"Reconstrucción lógica del ensayo ESP32 / OLED / INA · filas documentadas y tres resistencias.":"Arquitectura V0.1: líneas discontinuas = todavía no conectadas/probadas.";
 $("stageNote").textContent=mode==="bench"?"Cableado basado en filas y nets probados; distribución visual aproximada (no es una foto).":mode==="wiring"?"Ninguna rama TPS2553 o alimentación XL4015 ha sido verificada todavía.":"Dibujos físicos referenciales. Ni medidas ni posición de montaje están congeladas.";
 $("viewHint").textContent=mode==="bench"?"3 cargas reales de 100 Ω · sin reinicios reportados":mode==="wiring"?"Potencia 12/5 V pendiente · I²C probado en banco":"4 pisos · ESP32, OLED e INA3221 ya probados";
 $("extraHint").textContent=mode==="bench"?"I²C 0x40 / 0x3C · GPIO8 / GPIO9":mode==="wiring"?"Sólido = ensayo 3,3 V; discontinuo = plan":"Acerca y selecciona una placa para sus detalles";
 $("netTools").classList.toggle("is-hidden",mode==="physical");
 ["modeNav","layerNav"].forEach(function(area){$(area).querySelectorAll("button").forEach(function(b){var on=area==="modeNav"?b.dataset.mode===mode:b.dataset.layer===state.layer;b.classList.toggle("active",on);b.setAttribute("aria-pressed",on?"true":"false");});});
 $("layerNav").style.opacity=mode==="physical"?"1":".45";
 $("layerNav").style.pointerEvents=mode==="physical"?"auto":"none";
 $("statusFilters").querySelectorAll("button").forEach(function(b){b.classList.toggle("active",b.dataset.status===state.status);});
 $("netTools").querySelectorAll("button").forEach(function(b){b.classList.toggle("active",b.dataset.net===state.net);});
}
function setFloors(){
 var mode=state.mode;
 LAYERS.forEach(function(l){var f=floors[l.id],index=layerIndex[l.id],selected=state.layer==="all"||state.layer===l.id;
 var z=state.layer==="all"?index*105:0;
 f.style.setProperty("--z",z+"px");
 f.style.setProperty("--dx",state.layer==="all"?((index-1.5)*65)+"px":"0px");
 f.style.setProperty("--dy",state.layer==="all"?((1.5-index)*60)+"px":"0px");
 f.style.display=(mode==="physical"&&selected)?"block":"none";
 f.classList.toggle("dimmed",!selected);
 f.classList.toggle("selected",state.layer===l.id);
 f.querySelectorAll(".hardware").forEach(function(b){var p=part[b.dataset.part];b.classList.toggle("dimmed",!isVisible(p));b.classList.toggle("active",state.selected===p.id);});
 });
 benchLayer.style.display=mode==="bench"?"block":"none";
 wiringLayer.style.display=mode==="wiring"?"block":"none";
 [benchLayer,wiringLayer].forEach(function(f){f.style.setProperty("--z","0px");f.querySelectorAll(".hardware").forEach(function(b){b.classList.toggle("active",b.dataset.part===state.selected);});});
 overlay.style.setProperty("transform","translateZ(25px)");
 overlay.classList.toggle("enabled",mode!=="physical");
}
function wirePaths(){
 var nets=state.mode==="bench"?benchNets:designNets;
 if(state.mode==="physical"){overlay.replaceChildren();return;}
 var coords={},layout=state.mode==="bench"?benchItems:diagramItems;
 layout.forEach(function(x){coords[x.id]=[x.x+x.w/2,x.y+x.h/2];});
 overlay.replaceChildren();
 nets.forEach(function(net,n){
 var filter=state.net;if(filter!=="all"&&net[2]!==filter)return;
 var a=coords[net[0]],b=coords[net[1]];if(!a||!b)return;
 var type=net[2],color=COLORS[type];
 // Repeated parallel nets are separated for legibility.
 var parallel=nets.slice(0,n).filter(function(t){return t[0]===net[0]&&t[1]===net[1];}).length;
 var offset=parallel*13;
 var y1=a[1]+offset,y2=b[1]+offset;
 var mid=(a[0]+b[0])/2;
 var path=document.createElementNS("http://www.w3.org/2000/svg","path");
 path.setAttribute("d","M"+a[0]+" "+y1+" C"+mid+" "+y1+","+mid+" "+y2+","+b[0]+" "+y2);
 path.setAttribute("stroke",color);
 path.setAttribute("class",net[3]?"tested":"planned");
 path.setAttribute("opacity",state.selected===net[0]||state.selected===net[1]?"1":".73");
 overlay.append(path);
 if(filter!=="all"||state.selected===net[0]||state.selected===net[1]){
 var label=document.createElementNS("http://www.w3.org/2000/svg","text");label.setAttribute("x",mid);label.setAttribute("y",(y1+y2)/2-7);label.setAttribute("text-anchor","middle");label.textContent=net[4];overlay.append(label);
 }
 });
}
function updateCamera(){
 // React to container width but don't allow huge overflow.
 var area=viewport.getBoundingClientRect(),scale=Math.min((area.width-40)/1100,(area.height-70)/900,1);
 scale=Math.max(.29,scale);
 camera.style.setProperty("--rx",state.rx+"deg");
 camera.style.setProperty("--rz",state.rz+"deg");
 camera.style.setProperty("--scale",scale*state.zoom);
 $("zoomValue").textContent=Math.round(state.zoom*100)+"%";
 $("orbitValue").textContent="ÓRBITA "+Math.round(state.rx)+"° / "+Math.round(state.rz)+"°";
}
function render(){
 currentMode();setFloors();listItems();inspector();wirePaths();updateCamera();
}
$("modeNav").addEventListener("click",function(e){var b=e.target.closest("[data-mode]");if(!b)return;state.mode=b.dataset.mode;if(state.mode==="bench")state.selected="ina";if(state.mode==="wiring"){state.selected="buck";state.net="all";}render();});
$("layerNav").addEventListener("click",function(e){var b=e.target.closest("[data-layer]");if(!b||state.mode!=="physical")return;state.layer=b.dataset.layer;render();});
$("statusFilters").addEventListener("click",function(e){var b=e.target.closest("[data-status]");if(!b)return;state.status=b.dataset.status;render();});
$("netTools").addEventListener("click",function(e){var b=e.target.closest("[data-net]");if(!b)return;state.net=b.dataset.net;render();});
$("searchInput").addEventListener("input",function(e){state.query=e.target.value.trim().toLowerCase();render();});
$("goBench").addEventListener("click",function(){state.mode="bench";state.net="all";state.selected="ina";render();stage.scrollIntoView({behavior:"smooth",block:"center"});});
$("zoomIn").addEventListener("click",function(){state.zoom=Math.min(1.85,state.zoom+.12);updateCamera();});
$("zoomOut").addEventListener("click",function(){state.zoom=Math.max(.55,state.zoom-.12);updateCamera();});
$("resetCamera").addEventListener("click",function(){state.rx=54;state.rz=-25;state.zoom=1;updateCamera();});
viewport.addEventListener("wheel",function(e){e.preventDefault();state.zoom=Math.max(.55,Math.min(1.85,state.zoom+(e.deltaY>0?-.09:.09)));updateCamera();},{passive:false});
var drag=null;
viewport.addEventListener("pointerdown",function(e){if(e.target.closest(".hardware,.floor-button"))return;drag={x:e.clientX,y:e.clientY,rx:state.rx,rz:state.rz};viewport.setPointerCapture(e.pointerId);viewport.classList.add("dragging");});
viewport.addEventListener("pointermove",function(e){if(!drag)return;state.rx=Math.max(13,Math.min(80,drag.rx-(e.clientY-drag.y)*.2));state.rz=drag.rz+(e.clientX-drag.x)*.27;updateCamera();});
["pointerup","pointercancel","lostpointercapture"].forEach(function(t){viewport.addEventListener(t,function(){drag=null;viewport.classList.remove("dragging");});});
window.addEventListener("resize",updateCamera);
$("moduleCount").textContent=items.length;
$("testedCount").textContent=String(items.filter(function(m){return m.status==="tested";}).length).padStart(2,"0");
render();
})();