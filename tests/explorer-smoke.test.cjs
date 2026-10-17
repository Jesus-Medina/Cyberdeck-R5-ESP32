'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '../site/app.js'), 'utf8');
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
  assert.ok(parts.length>=15,'Pocos módulos para '+floor);
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
