(()=>{
"use strict";
/* Lilith Explorer 3.0: 3D projected geometry on Canvas 2D. Board art is conceptual, not CAD.
   Verified bench relations are separated from not-yet-built AUX power connections. */
const $=id=>document.getElementById(id),canvas=$("scene"),g=canvas.getContext("2d");
if(!g){$("sceneInfoText").textContent="Este navegador no admite el visor Canvas 2D.";return;}
const colors={tested:"#ebbbd0",owned:"#dcba92",planned:"#91899c",power:"#f2b381",i2c:"#d6a4e7",ground:"#9fb5d8"};
const docs="https://github.com/Jesus-Medina/Cyberdeck-R5-ESP32/blob/main/docs/";
const levels=[["base","04 · BASE ESTRUCTURAL"],["power","03 · ENERGÍA"],["electronics","02 · ELECTRÓNICA"],["panel","01 · PANEL SUPERIOR"]];
const raw=[
["dell","Dell Vostro 3405","base","owned","laptop",[-3.5,-2.3,6.9,4.4],"Batería/cargador originales","USB Dell; alimentación independiente","Equipo comprado Ryzen 5 3450U, 12 GB RAM y SSD de 256 GB. No conectado al sistema auxiliar.","Medir cargador Dell e interior del maletín.","hub,dcdell,keyboard"],
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
const items=raw.map(r=>({id:r[0],name:r[1],floor:r[2],status:r[3],kind:r[4],box:r[5],v:r[6],io:r[7],desc:r[8],next:r[9],links:r[10].split(","),doc:r[2]==="power"?"21-portable-power-architecture.md":"22-lilith-build-status-2026-10-17.md"}));
const index=Object.fromEntries(items.map(i=>[i.id,i]));
const bench={esp32:[-3.7,-1.1,2.24,1.32],ina:[-.77,-1.1,2.1,1.35],oled:[2.38,-1.0,1.45,1.1],r1:[-2.55,1.35,.87,.4],r2:[-.32,1.35,.87,.4],r3:[1.91,1.35,.87,.4]};
const circuit={meanwell:[-4.45,-2.1,1.5,.95],fuse:[-2.62,-2.1,1.07,.87],sw0:[-1.18,-2.1,.81,.87],xl:[.08,-2.05,1.58,1.18],tps1:[2.23,-2.14,1.06,.91],tps2:[3.65,-2.14,1.04,.91],sw1:[.14,.27,.80,.79],ina:[-1.05,.59,1.54,1.10],esp32:[-4.0,.70,1.89,1.05],oled:[2.32,.60,1.58,1.02]};
const benchN=[["esp32","ina","power","3V3 fila 5",true],["esp32","oled","power","3V3",true],["esp32","ina","ground","GND fila 2",true],["esp32","ina","i2c","GPIO8 SDA fila 10",true],["esp32","ina","i2c","GPIO9 SCL fila 15",true],["esp32","oled","i2c","I²C GPIO8/9",true],["ina","r1","power","VIN1−",true],["ina","r2","power","VIN2−",true],["ina","r3","power","VIN3−",true]];
const designN=[["meanwell","fuse","power","12 V",false],["fuse","sw0","power","12 V",false],["sw0","xl","power","12 V",false],["xl","tps1","power","5 V",false],["xl","tps2","power","5 V",false],["xl","sw1","power","5 V",false],["tps1","ina","power","CH1",false],["tps2","ina","power","CH2",false],["sw1","ina","power","CH3",false],["ina","esp32","power","SUP 5 V",false],["esp32","ina","i2c","GPIO8/9 probado",true],["esp32","oled","i2c","GPIO8/9 probado",true],["esp32","ina","ground","GND banco",true]];
const S={mode:"model",floor:"all",exploded:true,status:"all",q:"",selected:"esp32",net:"all",yaw:-.55,pitch:.62,zoom:1,panX:0,panY:0};
let W=0,H=0,dpr=1,scale=1,hit=[],lab=[],scheduled=false,drag=false,startDist=0;
const ptr=new Map();
const lim=(v,a,b)=>Math.max(a,Math.min(b,v));
function proj(x,y,z){let co=Math.cos(S.yaw),si=Math.sin(S.yaw),p=Math.sin(S.pitch),q=Math.cos(S.pitch),u=x*co-y*si,v=x*si+y*co,depth=v*q+z*p,f=25/(25-depth);return{x:W*.5+S.panX+u*scale*f,y:H*.54+S.panY+(v*p-z*q)*scale*f};}
function poly(pts,fill,stroke,width=1){let a=pts.map(v=>proj(...v));g.beginPath();g.moveTo(a[0].x,a[0].y);a.slice(1).forEach(v=>g.lineTo(v.x,v.y));g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}return a;}
function path(pts,color="#cdb2be",w=1,dash=[]){let a=pts.map(v=>proj(...v));g.beginPath();g.moveTo(a[0].x,a[0].y);a.slice(1).forEach(v=>g.lineTo(v.x,v.y));g.strokeStyle=color;g.lineWidth=w;g.setLineDash(dash);g.stroke();g.setLineDash([]);}
function block(x,y,z,w,d,h,col){poly([[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]],"#14141b","#4a4251");poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],"#14141b","#4a4251");poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],"#14141b","#4a4251");return poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],col,"#8b7d8b");}
function ring(x,y,z,r,col,fill){let p=[];for(let i=0;i<22;i++){let a=i*Math.PI*2/22;p.push([x+Math.cos(a)*r,y+Math.sin(a)*r,z]);}poly(p,fill,col,1.4);}
function text(x,y,z,t,size=8,color="#e5dce7"){let p=proj(x,y,z);g.font="700 "+size+"px 'Space Grotesk',sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillStyle=color;g.fillText(t,p.x,p.y);g.textAlign="left";}
function light(x,y,z,c){let p=proj(x,y,z);g.beginPath();g.arc(p.x,p.y,Math.max(2.0,scale*.05),0,Math.PI*2);g.fillStyle=c;g.fill();}
function paintBoard(m,b,z){let [x,y,w,d]=b,k=m.kind,base=z+.08;let colorsBoard={esp32:"#173d3b",ina:"#653881",oled:"#1b2a3e",xl:"#1c5d92",tps:"#216a53",laptop:"#474752",keyboard:"#33323d",switches:"#33313e",battery:"#42514d",lora:"#235d47",fuse:"#4e4238",usb:"#333b45",resistor:"#725444",antenna:"#36303c",fan:"#343941",screen:"#263d62",ports:"#394053"};let area=block(x,y,z,w,d,.075,colorsBoard[k]||"#284d58");
let add=(a,b,c,dd,h,color)=>block(x+a*w,y+b*d,base,c*w,dd*d,h,color),loc=(a,b,h=.1)=>[x+a*w,y+b*d,base+h];
if(k==="laptop"||k==="keyboard"){add(.04,.06,.91,.84,.05,"#343a43");for(let i=0;i<5;i++)for(let j=0;j<13;j++)add(.08+j*.057,.12+i*.116,.044,.086,.018,i+j===15?"#4c3b4f":"#242a34");add(.34,.73,.28,.11,.01,"#929098");}
else if(k==="switches"){for(let i=0;i<6;i++){let xx=x+w*(.08+i*.15),yy=y+d*.29;ring(xx,yy,base+.08,w*.031,"#c1c1c7","#494852");path([[xx,yy,base+.12],[xx+.06,yy-.06,base+.34]],"#e1dadf",3);}for(let j=0;j<6;j++)add(.045+j*.15,.61,.12,.20,.07,"#1a202b");}
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
else if(k==="usb"){add(.08,.19,.80,.60,.13,"#242b36");add(.82,.37,.17,.24,.11,"#d2d1d1");}
else if(k==="ports"){for(let i=0;i<3;i++){add(.13,.10+i*.27,.57,.18,.12,"#141e2b");ring(...loc(.84,.20+i*.27,.09),w*.09,"#d5b38a","#1d202a");}}
else{add(.10,.14,.81,.74,.045,"#203443");add(.29,.30,.41,.39,.12,"#141b25");for(let i=0;i<5;i++)add(.10+i*.17,.03,.06,.09,.015,"#dab27e");}
light(x+w*.88,y+d*.13,base+.20,colors[m.status]);
if(S.selected===m.id)poly([[x,y,base+.2],[x+w,y,base+.2],[x+w,y+d,base+.2],[x,y+d,base+.2]],null,"#f8cee2",2.4);
hit.push({id:m.id,poly:area});let q=proj(x+w/2,y+d/2,base+.22);lab.push({id:m.id,x:q.x,y:q.y,t:m.name,c:colors[m.status],selected:S.selected===m.id});
}
function floor(f,z){block(-5,-3.35,z,10,6.7,.15,"#332b3d99");for(let i=-4;i<=4;i++)path([[i,-3.3,z+.16],[i,3.3,z+.16]],"#d9a8bc16",.5);let a=proj(-4.4,-3.5,z+.23);lab.push({id:"floor",x:a.x,y:a.y,t:f[1],c:"#ab8fa2",selected:false});}
function drawingModel(){for(const f of levels){if(S.floor!=="all"&&S.floor!==f[0])continue;const idx=levels.indexOf(f),z=S.floor==="all"?.11+idx*(S.exploded?.98:.18):.60;floor(f,z);
 const group=items.filter(m=>m.floor===f[0]&&!["sw0","sw1"].includes(m.id));
 group.sort((a,b)=>(a.box[0]+a.box[2]/2)*Math.sin(S.yaw)+(a.box[1]+a.box[3]/2)*Math.cos(S.yaw)-(b.box[0]+b.box[2]/2)*Math.sin(S.yaw)-(b.box[1]+b.box[3]/2)*Math.cos(S.yaw));
 group.forEach(m=>paintBoard(m,m.box,z+.19));
 if(f[0]==="panel"){let p=index.switches.box;for(let i=0;i<2;i++){let x=p[0]+p[2]*(.05+i*.15),y=p[1]+p[3]*.15,z1=z+.40;hit.push({id:i?"sw1":"sw0",poly:[[x,y,z1],[x+.35,y,z1],[x+.35,y+.36,z1],[x,y+.36,z1]].map(q=>proj(...q))});}}
}}
function wires(nets,placement,z){nets.forEach(([aa,bb,kind,label,ok],i)=>{if(S.net!=="all"&&kind!==S.net)return;let a=placement[aa],b=placement[bb];if(!a||!b)return;const p=[a[0]+a[2]/2,a[1]+a[3]/2,z],q=[b[0]+b[2]/2,b[1]+b[3]/2,z],mid=[(p[0]+q[0])/2,(p[1]+q[1])/2,z+.11+(i%4)*.11];
 path([p,[(p[0]+mid[0])/2,(p[1]+mid[1])/2,mid[2]],mid,[(q[0]+mid[0])/2,(q[1]+mid[1])/2,mid[2]],q],colors[kind],S.selected===aa||S.selected===bb?3.6:2.4,ok?[]:[6,5]);
 if(S.selected===aa||S.selected===bb||S.net!=="all"){let sp=proj(...mid);g.font="600 9px 'DM Sans'";g.fillStyle="#201828ee";g.fillRect(sp.x-56,sp.y-15,112,18);g.fillStyle="#f4e2ed";g.textAlign="center";g.fillText(label.slice(0,26),sp.x,sp.y-3);g.textAlign="left";}
});}
function diagram(which){let p=which==="bench"?bench:circuit,z=.19;floor(["bench",which==="bench"?"BANCO REAL 3,3 V":"ARQUITECTURA V0.1"],z);for(const [id,b] of Object.entries(p))paintBoard(index[id],b,z+.15);wires(which==="bench"?benchN:designN,p,z+.40);}
function labels(){let used=[];const small=W<560;let arr=lab.slice().sort((a,b)=>Number(b.selected)-Number(a.selected));for(const t of arr){if(S.mode==="model"&&S.floor==="all"&&!t.selected&&!["esp32","ina","xl","oled","dell","battery","switches","tps1"].includes(t.id))continue;let w=Math.min(small?145:200,18+t.t.length*(small?5.4:6)),h=22,x=lim(t.x-w/2,4,W-w-4),y=lim(t.y-36,42,H-92);
 if(!t.selected&&used.some(r=>x<r.x+r.w+4&&x+w>r.x-4&&y<r.y+r.h+4&&y+h>r.y-4))continue;used.push({x,y,w,h});g.fillStyle=t.selected?"#5d3950f2":"#201827e5";g.strokeStyle=t.selected?"#eec4d7":"#745569";g.beginPath();g.roundRect(x,y,w,h,6);g.fill();g.lineWidth=1;g.stroke();g.fillStyle=t.c;g.beginPath();g.arc(x+9,y+11,3,0,Math.PI*2);g.fill();g.fillStyle="#f6e9f0";g.font="600 "+(small?9:10)+"px 'DM Sans'";g.textAlign="left";g.textBaseline="middle";g.fillText(t.t.length>(small?22:30)?t.t.slice(0,small?20:28)+"…":t.t,x+17,y+11);}g.textBaseline="alphabetic";}
function draw(){scheduled=false;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);let bg=g.createRadialGradient(W*.52,H*.50,10,W*.5,H*.49,Math.max(W,H)*.8);bg.addColorStop(0,"#423044");bg.addColorStop(.6,"#17131f");bg.addColorStop(1,"#0e0c16");g.fillStyle=bg;g.fillRect(0,0,W,H);g.strokeStyle="#dcb8c51a";for(let x=0;x<W;x+=30){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}for(let y=0;y<H;y+=30){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
 scale=Math.min(W/14.8,H/11.5)*1.17*S.zoom;hit=[];lab=[];if(S.mode==="model")drawingModel();else diagram(S.mode);labels();}
function render(){if(!scheduled){scheduled=true;requestAnimationFrame(draw);}}
function resize(){let r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;W=r.width;H=r.height;dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);render();}
function inside(v,a){let ok=false;for(let i=0,j=a.length-1;i<a.length;j=i++){let p=a[i],q=a[j];if((p.y>v.y)!==(q.y>v.y)&&v.x<(q.x-p.x)*(v.y-p.y)/(q.y-p.y)+p.x)ok=!ok;}return ok;}
function pick(v){for(let i=hit.length-1;i>=0;i--)if(inside(v,hit[i].poly))return hit[i].id;for(let i=hit.length-1;i>=0;i--){let a=hit[i].poly,p={x:a.reduce((s,v)=>s+v.x,0)/4,y:a.reduce((s,v)=>s+v.y,0)/4};if(Math.hypot(v.x-p.x,v.y-p.y)<(W<600?21:13))return hit[i].id;}return null;}
function statusText(s){return s==="tested"?"PROBADO EN BANCO":s==="owned"?"COMPRADO / POR VERIFICAR":"PLANIFICADO / SIN PROBAR";}
function select(id){if(!index[id])return;S.selected=id;if(id==="meanwell")S.mode="circuit";if(["r1","r2","r3"].includes(id))S.mode="bench";if(S.mode==="model"&&S.floor!=="all"&&index[id].floor!=="external")S.floor=index[id].floor;update();}
function inventory(){let el=$("inventory");el.replaceChildren();let all=items.filter(m=>(S.status==="all"||m.status===S.status)&&(!S.q||(m.name+" "+m.desc+" "+m.io).toLowerCase().includes(S.q))&&(!["r1","r2","r3"].includes(m.id)||S.mode==="bench"));$("resultCount").textContent=all.length;
 all.forEach(m=>{let b=document.createElement("button"),dot=document.createElement("i"),wrap=document.createElement("span"),n=document.createElement("b"),sub=document.createElement("small");b.className="inv-item"+(S.selected===m.id?" active":"");dot.className="state-dot "+m.status;n.textContent=m.name;sub.textContent=m.floor.toUpperCase();wrap.append(n,sub);b.append(dot,wrap);b.addEventListener("click",()=>select(m.id));el.append(b);});}
function inspector(){let m=index[S.selected];if(!m)return;let el=$("inspectorBody");el.replaceChildren();let top=document.createElement("div");top.className="inspector-topblock";let p=document.createElement("div");p.className="inspect-code";p.textContent="LILITH / "+m.floor.toUpperCase()+" / "+m.id.toUpperCase();top.append(p);
 let fig=document.createElement("div");fig.className="inspect-picture";let tile=document.createElement("div");tile.style.cssText="width:78%;height:60%;border:2px solid #b7a2b1;border-radius:9px;background:"+({ina:"#633583",xl:"#285f8a",esp32:"#235043",tps:"#2a6c56",oled:"#182c44"}[m.kind]||"#344b59")+";box-shadow:10px 12px 12px #0007;transform:rotate(-7deg);display:grid;place-items:center;text-align:center;font:700 15px 'Space Grotesk';padding:9px";tile.textContent=({ina:"INA3221 · R100 ×3",xl:"XL4015 · CC/CV",esp32:"ESP32-S3 · USB-C",tps:"TPS2553 · SOT-23-6",oled:"OLED · SH1106"}[m.kind]||m.name);fig.append(tile);top.append(fig);
 let title=document.createElement("h3");title.className="inspect-title";title.textContent=m.name;top.append(title);
 let badge=document.createElement("div");badge.className="inspect-state "+m.status;badge.textContent=statusText(m.status);top.append(badge);
 let desc=document.createElement("p");desc.className="inspect-desc";desc.textContent=m.desc;top.append(desc);el.append(top);
 let sect=document.createElement("section");sect.className="detail-section";let h=document.createElement("h4");h.textContent="ESPECIFICACIONES";sect.append(h);
 [["TENSIÓN",m.v],["CONECTORES / DATOS",m.io],["ÁREA",m.floor.toUpperCase()]].forEach(([k,v])=>{let row=document.createElement("div");row.className="spec";let a=document.createElement("span"),b=document.createElement("b");a.textContent=k;b.textContent=v;row.append(a,b);sect.append(row);});el.append(sect);
 sect=document.createElement("section");sect.className="detail-section";h=document.createElement("h4");h.textContent="SIGUIENTE PASO";sect.append(h);p=document.createElement("div");p.className="nextstep";p.textContent=m.next;sect.append(p);el.append(sect);
 sect=document.createElement("section");sect.className="detail-section";h=document.createElement("h4");h.textContent="MÓDULOS RELACIONADOS";sect.append(h);let group=document.createElement("div");group.className="related-list";m.links.forEach(id=>{if(!index[id])return;let b=document.createElement("button");b.textContent=index[id].name;b.addEventListener("click",()=>select(id));group.append(b);});sect.append(group);el.append(sect);
 p=document.createElement("div");p.className="detail-warning";p.textContent="Los dibujos son referenciales: no son fotografías de tus piezas ni planos CAD validados.";el.append(p);$("inspectorDoc").href=docs+m.doc;}
function update(){
 $("modeCrumb").textContent=S.mode==="model"?"MODELO 3D":S.mode==="bench"?"BANCO REAL":"CABLEADO";
 $("viewTitle").innerHTML=(S.mode==="model"?"El interior, pieza por pieza":S.mode==="bench"?"Lo que ya funciona":"Conexiones y seguridad")+"<span>.</span>";
 $("viewSubtitle").textContent=S.mode==="model"?"Arrastra para girar · pellizca para ampliar y mover · toca los módulos.":S.mode==="bench"?"ESP32, OLED, INA3221 y tres resistencias independientes de 100 Ω.":"Las líneas discontinuas son rutas aún sin montar ni probar.";
 $("floorCaption").innerHTML=(S.mode==="model"?(S.floor==="all"?"CUATRO NIVELES":levels.find(x=>x[0]===S.floor)?.[1]||"PISO"):(S.mode==="bench"?"BANCO REAL 3,3 V":"V0.1 PENDIENTE"))+"<small>"+(S.mode==="model"?(S.exploded?"DESPIECE · MEDIDAS ILUSTRATIVAS":"ENSAMBLADO · MEDIDAS ILUSTRATIVAS"):S.mode==="bench"?"ENSAYO COMPROBADO":"12 V → 5 V NO CONECTADOS")+"</small>";
 $("sceneInfoText").textContent=S.mode==="model"?"ARRASTRAR: GIRAR · 2 DEDOS: ZOOM/MOVER":S.mode==="bench"?"I²C 0x40 / 0x3C · GPIO8/9":"RUTAS FUTURAS Y DATOS PROBADOS";
 $("netFilter").hidden=S.mode==="model";$("explodeControls").style.display=S.mode==="model"&&S.floor==="all"?"flex":"none";
 $("modeNav").querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===S.mode));
 $("floorNav").querySelectorAll("[data-floor]").forEach(b=>{b.classList.toggle("active",b.dataset.floor===S.floor);b.disabled=S.mode!=="model";});
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
  const canSelect=activePointers.size===1&&!moved&&!hadMultiTouch;
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
  if(activePointers.has(e.pointerId))canvas.dispatchEvent(new PointerEvent("pointercancel",{pointerId:e.pointerId}));
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
$("searchInput").addEventListener("input",e=>{S.q=e.target.value.trim().toLowerCase();inventory();});
$("assembledBtn").addEventListener("click",()=>{S.exploded=false;update();});$("explodedBtn").addEventListener("click",()=>{S.exploded=true;update();});
$("zoomIn").addEventListener("click",()=>{S.zoom=lim(S.zoom+.13,.55,2.4);render();});$("zoomOut").addEventListener("click",()=>{S.zoom=lim(S.zoom-.13,.55,2.4);render();});
$("resetCamera").addEventListener("click",resetView);
$("openBench").addEventListener("click",()=>{S.mode="bench";S.selected="ina";update();$("viewer").scrollIntoView({behavior:"smooth",block:"center"});});
$("mobileInventoryToggle").addEventListener("click",()=>{let yes=$("inventorySection").classList.toggle("open");$("mobileInventoryToggle").setAttribute("aria-expanded",String(yes));});
$("openInspector").addEventListener("click",()=>$("inspector").scrollIntoView({behavior:"smooth",block:"start"}));
$("moduleTotal").textContent=items.length-3;
if(typeof ResizeObserver==="function"){new ResizeObserver(resize).observe(canvas);}else{window.addEventListener("resize",resize);}update();resize();
})();