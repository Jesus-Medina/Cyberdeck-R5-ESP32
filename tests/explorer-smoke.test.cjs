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
  vm.runInNewContext(script, {
    document, ResizeObserver, devicePixelRatio: 1,
    window: { addEventListener() {} },
    requestAnimationFrame(fn) { frames.push(fn); }
  }, { filename: 'site/app.js', timeout: 4000 });
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
  return { nodes, painted, click, flush };
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
