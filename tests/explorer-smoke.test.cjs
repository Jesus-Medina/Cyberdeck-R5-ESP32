'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '../site/app.js'), 'utf8');
const capabilitiesScript = fs.readFileSync(path.join(__dirname, '../site/capabilities.js'), 'utf8');
function boot(width = 900, height = 600) {
  const nodes = new Map(), frames = [];
  const painted = { polygons: 0, labels: 0, background: 0 };
  const gradient = { addColorStop() {} };
  const context = new Proxy({}, {
    get(_, key) {
      if (key === 'createRadialGradient') return () => gradient;
      if (key === 'fill') return () => { painted.polygons++; };
      if (key === 'fillText') return () => { painted.labels++; };
      if (key === 'fillRect') return () => { painted.background++; };
      return () => {};
    },
    set() { return true; }
  });
  function element(id = '') {
    return {
      id, children: [], dataset: {}, style: {}, hidden: false,
      classList: { add() {}, remove() {}, toggle() { return true; } },
      listeners: {},
      addEventListener(name, fn) { this.listeners[name] = fn; },
      getBoundingClientRect() { return { left: 0, top: 0, width, height }; },
      getContext() { return context; },
      setPointerCapture() {},
      scrollIntoView() {},
      querySelectorAll() { return []; },
      querySelector() { return null; },
      setAttribute() {},
      append(...args) { this.children.push(...args); },
      replaceChildren(...args) { this.children = args; }
    };
  }
  const document = {
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, element(id));
      return nodes.get(id);
    },
    createElement() { return element(); }
  };
  class ResizeObserver {
    constructor(fn) { this.fn = fn; }
    observe() { this.fn(); }
  }
  const runtime = {
    document, ResizeObserver, devicePixelRatio: 1,
    window: { addEventListener() {} },
    requestAnimationFrame(fn) { frames.push(fn); }
  };
  vm.runInNewContext(capabilitiesScript, runtime, {filename:'site/capabilities.js',timeout:4000});
  vm.runInNewContext(script.replace("const S={", "const S=globalThis.__testCamera={").replace("const items=raw.map", "const items=globalThis.__testItems=raw.map"), runtime, { filename: 'site/app.js', timeout: 4000 });
  function flush() {
    let runs = 0;
    while (frames.length) {
      assert.ok(++runs <= 10, 'Bucle de renderizado infinito');
      frames.shift()();
    }
  }
  function click(id, data) {
    const el = document.getElementById(id);
    assert.ok(el.listeners.click, 'Falta listener de ' + id);
    el.listeners.click({ target: { closest() { return { dataset: data }; } } });
    flush();
  }
  flush();
  return { nodes, painted, click, flush, camera: runtime.__testCamera, items: runtime.__testItems };
}

test('el 3D dibuja componentes reales al abrir escritorio', () => {
  const app = boot(1000, 680);
  assert.ok(app.painted.polygons > 50, 'No se dibujaron las placas');
  assert.ok(app.painted.labels > 3, 'No se dibujaron etiquetas');
  assert.ok(app.nodes.get('inventory').children.length >= 20);
});
test('el 3D aparece en móvil y permite navegar pisos', () => {
  const app = boot(375, 480);
  assert.ok(app.painted.polygons > 50);
  const prev = app.painted.polygons;
  app.click('floorNav', { floor: 'electronics' });
  assert.ok(app.painted.polygons > prev, 'El piso de electrónica no se redibujó');
  app.click('floorNav', { floor: 'power' });
  app.click('floorNav', { floor: 'all' });
});
test('banco, cableado, zoom y controles funcionan sin errores', () => {
  const app = boot();
  const prev = app.painted.polygons;
  app.click('modeNav', { mode: 'bench' });
  app.click('modeNav', { mode: 'circuit' });
  app.click('netFilter', { net: 'i2c' });
  app.click('modeNav', { mode: 'model' });
  for (const id of ['assembledBtn', 'explodedBtn', 'zoomIn', 'zoomOut', 'resetCamera']) {
    app.nodes.get(id).listeners.click();
    app.flush();
  }
  assert.ok(app.painted.polygons > prev);
});

function pointer(app, action, id, x, y, extras = {}) {
  const scene = app.nodes.get('scene');
  const listener = scene.listeners[action];
  assert.ok(listener, 'Falta evento ' + action);
  listener({ pointerId: id, clientX: x, clientY: y, pointerType: 'touch', button: 0, ...extras });
  app.flush();
}

test('arrastrar sigue la dirección corregida sin invertir los ejes', () => {
  const app=boot();
  const y0=app.camera.yaw, p0=app.camera.pitch;
  pointer(app,'pointerdown',1,250,200);
  pointer(app,'pointermove',1,350,200);
  assert.ok(app.camera.yaw < y0, 'El arrastre hacia la derecha debe disminuir yaw');
  pointer(app,'pointermove',1,350,270);
  assert.ok(app.camera.pitch > p0, 'Arrastrar hacia abajo debe aumentar inclinación');
  pointer(app,'pointerup',1,350,270);
});

test('Mayús + arrastrar desplaza sin rotar, y reset restaura la cámara', () => {
  const app=boot();
  const yaw=app.camera.yaw;
  pointer(app,'pointerdown',1,100,100,{shiftKey:true,pointerType:'mouse'});
  pointer(app,'pointermove',1,170,135,{shiftKey:true,pointerType:'mouse'});
  assert.equal(app.camera.panX,70);
  assert.equal(app.camera.panY,35);
  assert.equal(app.camera.yaw,yaw);
  pointer(app,'pointerup',1,170,135,{shiftKey:true,pointerType:'mouse'});
  app.nodes.get('resetCamera').listeners.click();
  app.flush();
  assert.equal(app.camera.panX,0);
  assert.equal(app.camera.panY,0);
});

test('pellizco con dos dedos amplía sin rotar ni seleccionar accidentalmente', () => {
  const app=boot(375,500), z0=app.camera.zoom, yaw=app.camera.yaw;
  pointer(app,'pointerdown',1,100,200);
  pointer(app,'pointerdown',2,200,200);
  pointer(app,'pointermove',2,270,200);
  assert.ok(app.camera.zoom>z0, 'Separar dedos debe ampliar');
  assert.equal(app.camera.yaw,yaw,'El gesto de dos dedos no debe orbitar');
  assert.ok(app.camera.panX>0,'Dos dedos pueden desplazar la vista');
  pointer(app,'pointerup',2,270,200);
  pointer(app,'pointermove',1,110,200);
  assert.equal(app.camera.yaw,yaw,'Dedo residual tras pellizco no debe rotar');
  pointer(app,'pointerup',1,110,200);
  pointer(app,'pointerdown',3,140,240);
  pointer(app,'pointermove',3,240,240);
  assert.ok(app.camera.yaw<yaw,'Nuevo gesto después de pinch debe volver a orbitar');
  pointer(app,'pointercancel',3,240,240);
});

test('rueda y teclado ofrecen zoom y navegación sin recargar', () => {
  const app=boot(), c=app.camera, canvas=app.nodes.get('scene');
  const initialZoom=c.zoom, initialYaw=c.yaw;
  canvas.listeners.wheel({deltaY:-130,deltaMode:0,preventDefault(){}});
  app.flush();
  assert.ok(c.zoom>initialZoom);
  canvas.listeners.keydown({key:'ArrowRight',preventDefault(){}});
  app.flush();
  assert.ok(c.yaw<initialYaw);
  canvas.listeners.keydown({key:'Home',preventDefault(){}});
  app.flush();
  assert.equal(c.zoom,1);
  assert.equal(c.yaw,-.55);
});

test('catálogo expandido representa módulos de RF, redes, electrónica, panel y energía',()=>{
 const a=boot(900,600),idSet=new Set(a.items.map(v=>v.id));
 assert.ok(a.items.length>=55,'El catálogo no contiene los módulos expandidos');
 for(const id of ['lora','sdr','wifilab','ue306','arduino','fnirsi','gm328','logic','bme','rtc','irpanel','tca','eeprom','adum','backplane','smartports','lab','regservo','cyd','antenna','switches']){
  assert.ok(idSet.has(id),'Falta el componente '+id);
 }
 assert.equal(idSet.size,a.items.length,'IDs duplicados');
 for(const floor of ['panel','electronics','power']){
  const parts=a.items.filter(x=>x.floor===floor&&!["sw0","sw1"].includes(x.id)&&x.box?.length===4&&x.box[2]>0&&x.box[3]>0);
  assert.ok(parts.length>=(floor==='panel'?9:15),'Pocas posiciones reservadas para '+floor);
  for(const p of parts){
   assert.ok(p.box[0]>=-5&&p.box[1]>=-3.35&&p.box[0]+p.box[2]<=5&&p.box[1]+p.box[3]<=3.35,'Componente fuera del piso: '+p.id);
  }
  // El layout en rejilla solo es ilustrativo, pero no puede superponer componentes.
  for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){
   const x=parts[i].box,y=parts[j].box;
   const overlap=x[0]<y[0]+y[2]&&x[0]+x[2]>y[0]&&x[1]<y[1]+y[3]&&x[1]+x[3]>y[1];
   assert.ok(!overlap,'Piezas superpuestas en '+floor+': '+parts[i].id+', '+parts[j].id);
  }
 }
});
test('desde el inventario se abre el piso exacto del módulo seleccionado',()=>{
 const a=boot(),btn=a.nodes.get('inventory').children.find(e=>e.children?.[1]?.children?.[0]?.textContent==='LoRa');
 assert.ok(btn,'LoRa debe estar en inventario');
 btn.listeners.click();a.flush();
 assert.equal(a.camera.floor,'electronics');
 assert.equal(a.camera.selected,'lora');
});

test('Dell es placa desnuda, panel reserva 216x78 mm para doce interruptores y tapa incluye LCD',()=>{
 const a=boot(980,720),map=Object.fromEntries(a.items.map(x=>[x.id,x]));
 assert.equal(map.dell.kind,'motherboard','Dell no debe dibujarse como notebook con teclado');
 assert.ok(a.items.some(x=>x.id==='dellcooler'&&x.floor==='base'));
 assert.equal(map.lcd.floor,'lid');
 const sw=map.switches.box,physicalWidth=sw[2]*371/10,physicalHeight=sw[3]*258/6.7;
 assert.ok(Math.abs(physicalWidth-216)<0.01);
 assert.ok(Math.abs(physicalHeight-78)<0.01);
 const prev=a.painted.polygons;
 a.click('floorNav',{floor:'lid'});
 assert.ok(a.painted.polygons>prev,'Dibujar la tapa debe producir geometría');
});
test('inventario distingue las zonas operativas del montaje interior',()=>{
 const a=boot(),floors=new Set(a.items.map(x=>x.floor));
 for(const f of ['lid','panel','electronics','power','base'])assert.ok(floors.has(f));
 const lid=a.nodes.get('inventory').children.find(x=>x.children?.[1]?.children?.[0]?.textContent==='LCD Dell de 14 pulgadas');
 assert.ok(lid,'La pantalla tiene ficha independiente');
 lid.listeners.click();a.flush();
 assert.equal(a.camera.floor,'lid');
});

test('el mapa funcional presenta 22 accesos en panel y 8 alrededor de la pantalla',()=>{
 const a=boot();
 const panel=a.nodes.get('panelAccessGrid').children.filter(e=>e.dataset?.part);
 const lid=a.nodes.get('lidAccessGrid').children.filter(e=>e.dataset?.part);
 assert.equal(panel.length,22,'Deben verse los 22 accesos del panel');
 assert.equal(lid.length,8,'Deben verse 8 accesos adicionales de la tapa');
 assert.equal(new Set(panel.map(e=>e.dataset.part)).size,22);
 assert.equal(new Set(lid.map(e=>e.dataset.part)).size,8);
 for(const id of ['fnirsi','gm328','gpio','smartout','labout','logic','uart','irpanel','nfc','cyd']){
  assert.ok(panel.some(p=>p.dataset.part===id),'El panel operativo no muestra '+id);
 }
 for(const id of ['lcd','wifilab','lora','sdr','gps']){
  assert.ok(lid.some(p=>p.dataset.part===id),'La tapa no muestra '+id);
 }
 assert.equal(a.nodes.get('panelAccessCount').textContent,22);
 assert.equal(a.nodes.get('lidAccessCount').textContent,8);
 assert.equal(a.nodes.get('operatingCount').textContent,30);
});
test('desde un acceso de tapa se abre la ficha sin exigir acceso a piso inferior',()=>{
 const a=boot(),btn=a.nodes.get('lidAccessGrid').children.find(e=>e.dataset?.part==='lora');
 assert.ok(btn);
 btn.listeners.click();a.flush();
 assert.equal(a.camera.mode,'model');
 assert.equal(a.camera.floor,'lid','Seleccionar antena LoRa debe mantener la superficie operativa');
 assert.equal(a.camera.selected,'lora','La ficha enseña el módulo LoRa interior');
});
test('el visor ofrece un acceso directo al mapa de funciones',()=>{
 const a=boot();
 const jump=a.nodes.get('accessJump');
 assert.equal(jump.hidden,false);
 assert.match(jump.textContent,/30 accesos/);
 jump.listeners.click();
 assert.ok(a.nodes.get('operatingOverview'));
 a.click('floorNav',{floor:'panel'});
 assert.match(jump.textContent,/22 accesos/);
 a.click('floorNav',{floor:'lid'});
 assert.match(jump.textContent,/8 accesos/);
});

test('auditoría de la página distingue 6 palancas, 6 basculantes y solo 2 conexiones canónicas',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../site/index.html'),'utf8');
 const rows=[...html.matchAll(/<tr data-switch="(P[1-6]|B[1-6])" data-maturity="(canonical|proposed|blocked)">/g)];
 assert.equal(rows.length,12,'La matriz debe contener doce interruptores físicos, no 24');
 assert.equal(rows.filter(x=>x[1].startsWith('P')).length,6);
 assert.equal(rows.filter(x=>x[1].startsWith('B')).length,6);
 assert.equal(rows.filter(x=>x[2]==='canonical').length,2,'Solo SW0 y SW1 se cablean en V0.1');
 assert.equal(rows.filter(x=>x[2]!=='canonical').length,10,'Diez propuestas sin montar');
 assert.ok(html.includes('Coaxial RF 50 Ω'),'Debe estar dibujado el arnés coaxial');
 assert.ok(html.includes('Sin perforar carcasa ni soldar nada al LCD'),'Debe bloquearse soldar a la pantalla');
 assert.ok(html.includes('¿100 % de rendimiento?'),'Prohibido prometer rendimiento perfecto');
 assert.ok(html.includes('LoRa SPI/UART → ESP32'),'Datos LoRa separados de radio');
});
test('la especificación RF no convierte la propuesta en cableado oficial V0.1',()=>{
 const engineering=fs.readFileSync(path.join(__dirname,'../docs/26-lilith-switch-matrix-and-antenna-routing.md'),'utf8');
 const netlist=fs.readFileSync(path.join(__dirname,'../docs/20-v0.1-wiring-netlist.md'),'utf8');
 for(const id of ['P1 = SW0','P2 = SW1','**P3**','**P4**','**P5**','**P6**','**B1**','**B2**','**B3**','**B4**','**B5**','**B6**']){
   assert.ok(engineering.includes(id),'Sin justificación técnica para '+id);
 }
 assert.ok(engineering.includes('CAMBIO PROPUESTO'));
 assert.ok(engineering.includes('no se cablea todavía'));
 assert.ok(engineering.includes('no se puede prometer este recorrido'));
 assert.ok(netlist.includes('GPIO4 -> EN1 -> U2 pin 3'),'La V0.1 sigue con GPIO→EN directo');
});


test('las setenta fichas funcionales se muestran y filtran por capacidad',()=>{
 const app=boot(375,480);
 const cards=app.nodes.get('capabilityCards');
 assert.equal(cards.children.length,12,'Al iniciar se muestran doce tarjetas');
 const search=app.nodes.get('capabilitySearch');
 search.value='inyección';
 search.listeners.input();
 assert.ok(cards.children.some(c=>c.children.some(n=>String(n.textContent||'').includes('Wi-Fi'))),'Debe aparecer el adaptador Wi-Fi al buscar inyección');
 search.value='';
 search.listeners.input();
 app.nodes.get('capabilityMore').listeners.click();
 assert.equal(cards.children.length,70,'Las setenta fichas deben poder consultarse');
});
