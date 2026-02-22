// =====================
// Fractal Presets
// =====================

const FRACTALS = {
  koch: {
    name: "Koch Curve",
    axiom: "F",
    rules: { F: "F+F--F+F" },
    angle: 60,
    length: 5,
    startAngle: 0,
    translateStartingPoint: { x: 0, y: 0.4 },
  },

  dragon: {
    name: "Dragon Curve",
    axiom: "FX",
    rules: { X: "X+YF", Y: "FX-Y" },
    angle: 90,
    length: 8,
    startAngle: 0,
    translateStartingPoint: { x: 0.5, y: 0.5 },
  },

  hilbert: {
    name: "Hilbert Curve",
    axiom: "A",
    rules: { A: "+BF-AFA-FB+", B: "-AF+BFB+FA-" },
    angle: 90,
    length: 8,
    startAngle: 0,
    translateStartingPoint: { x: 0, y: 0 },
  },

  tree: {
    name: "Tree",
    axiom: "F",
    rules: { F: "F[+F]F[-F]F" },
    angle: 25,
    length: 10,
    startAngle: -90,
    translateStartingPoint: { x: 0.5, y: 1 },
  },

  sierpinski: {
    name: "Sierpinski Triangle",
    axiom: "F-G-G",
    rules: { F: "F-G+F+G-F", G: "GG" },
    angle: 120,
    length: 10,
    startAngle: 0,
    translateStartingPoint: { x: 0, y: 1 },
  },

  sierpinskiArrow: {
    name: "Sierpinski Arrowhead",
    axiom: "A",
    rules: { A: "B-A-B", B: "A+B+A" },
    angle: 60,
    length: 10,
    startAngle: 0,
    translateStartingPoint: { x: 0, y: 0.5 },
  },

  peano: {
    name: "Peano Curve",
    axiom: "X",
    rules: {
      X: "XFYFX+F+YFXFY-F-XFYFX",
      Y: "YFXFY-F-XFYFX+F+YFXFY",
    },
    angle: 90,
    length: 5,
    startAngle: 0,
    translateStartingPoint: { x: 0, y: 0 },
  },

  gosper: {
    name: "Gosper Curve",
    axiom: "A",
    rules: { A: "A-B--B+A++AA+B-", B: "+A-BB--B-A++A+B" },
    angle: 60,
    length: 10,
    startAngle: 0,
    translateStartingPoint: { x: 0.5, y: 1 },
  },

  levy: {
    name: "Levy C Curve",
    axiom: "F",
    rules: { F: "+F--F+" },
    angle: 45,
    length: 10,
    startAngle: 0,
    translateStartingPoint: { x: 0.5, y: 0.5 },
  },

  fern: {
    name: "Fern",
    axiom: "X",
    rules: { X: "F+[[X]-X]-F[-FX]+X", F: "FF" },
    angle: 25,
    length: 8,
    startAngle: -90,
    translateStartingPoint: { x: 0.5, y: 0.95 },
  },

  crystal: {
    name: "Crystal",
    axiom: "F+F+F+F",
    rules: { F: "FF+F++F+F" },
    angle: 90,
    length: 6,
    startAngle: 0,
    translateStartingPoint: { x: 0.15, y: 0.5 },
  },

  moore: {
    name: "Moore Curve",
    axiom: "LFL+F+LFL",
    rules: { L: "-RF+LFL+FR-", R: "+LF-RFR-FL+" },
    angle: 90,
    length: 8,
    startAngle: 0,
    translateStartingPoint: { x: 0, y: 0 },
  },

  snowflake: {
    name: "Snowflake",
    axiom: "F++F++F",
    rules: { F: "F-F++F-F" },
    angle: 60,
    length: 8,
    startAngle: 0,
    translateStartingPoint: { x: 0.25, y: 0.7 },
  },

  quadraticKoch: {
    name: "Quadratic Koch",
    axiom: "F-F-F-F",
    rules: { F: "F-F+F+FF-F-F+F" },
    angle: 90,
    length: 5,
    startAngle: 0,
    translateStartingPoint: { x: 0.1, y: 0.35 },
  },

  bush: {
    name: "Bush",
    axiom: "Y",
    rules: { X: "X[-FFF][+FFF]FX", Y: "YFX[+Y][-Y]" },
    angle: 25.7,
    length: 8,
    startAngle: -90,
    translateStartingPoint: { x: 0.5, y: 0.95 },
  },

  pentigree: {
    name: "Pentigree",
    axiom: "F-F-F-F-F",
    rules: { F: "F-F++F+F-F-F" },
    angle: 72,
    length: 8,
    startAngle: 0,
    translateStartingPoint: { x: 0.5, y: 0.6 },
  },
};

// =====================
// LSystem Class
// =====================

class LSystem {
  constructor({ axiom, rules, angle, length, startAngle, translateStartingPoint }) {
    this.axiom = axiom;
    this.rules = rules;
    this.angle = angle;
    this.length = length;
    this.startAngle = startAngle || 0;
    this.translateStartingPoint = translateStartingPoint || { x: 0, y: 0 };
    this._totalSegments = 0;
    this._segmentsDirty = true;
    this.reset();
  }

  reset() {
    this.sentence = this.axiom;
    this.iteration = 0;
    this._segmentsDirty = true;
    this._boundsDirty = true;
  }

  generate() {
    let next = "";
    for (let char of this.sentence) {
      next += this.rules[char] || char;
    }
    this.sentence = next;
    this.iteration++;
    this._segmentsDirty = true;
    this._boundsDirty = true;
  }

  countSegments() {
    if (this._segmentsDirty) {
      let count = 0;
      for (let char of this.sentence) {
        if (char >= "A" && char <= "Z") count++;
      }
      this._totalSegments = count;
      this._segmentsDirty = false;
    }
    return this._totalSegments;
  }

  computeBounds() {
    if (!this._boundsDirty && this._bounds) return this._bounds;
    let x = 0, y = 0, a = this.startAngle * (Math.PI / 180);
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    const stack = [];
    for (let char of this.sentence) {
      if (char >= 'A' && char <= 'Z') {
        x += Math.cos(a) * this.length;
        y += Math.sin(a) * this.length;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      } else if (char === '+') { a += this.angle * (Math.PI / 180); }
      else if (char === '-')   { a -= this.angle * (Math.PI / 180); }
      else if (char === '[')   { stack.push({x, y, a}); }
      else if (char === ']')   { ({x, y, a} = stack.pop()); }
    }
    this._bounds = {minX, maxX, minY, maxY};
    this._boundsDirty = false;
    return this._bounds;
  }

  getAllSymbols() {
    const symbols = new Set();
    for (let char of this.axiom) {
      if (char >= 'A' && char <= 'Z') symbols.add(char);
    }
    for (let rhs of Object.values(this.rules)) {
      for (let char of rhs) {
        if (char >= 'A' && char <= 'Z') symbols.add(char);
      }
    }
    return [...symbols].sort();
  }

  draw() {
    background(bgCol);
    resetMatrix();

    // Viewport transform: pan + zoom toward canvas center
    translate(width / 2 + viewOffsetX, height / 2 + viewOffsetY);
    scale(viewScale);
    translate(-width / 2, -height / 2);

    // Fractal positioning
    translate(
      width * this.translateStartingPoint.x,
      height * this.translateStartingPoint.y
    );
    rotate(radians(this.startAngle));

    strokeWeight(strokeW);

    // Pre-compute per-mode data
    let segIdx = 0;
    const total = colorMode === 'flat' ? 1 : this.countSegments();
    const bounds = colorMode === 'position' ? this.computeBounds() : null;
    const symMap = colorMode === 'per-symbol' ? symbolColorMap : null;

    // Parallel turtle tracking for position mode
    let tx = 0, ty = 0, ta = this.startAngle * (Math.PI / 180);
    const tStack = [];

    if (colorMode === 'flat') stroke(paletteColors[0]);

    for (let char of this.sentence) {
      if (char >= "A" && char <= "Z") {
        if (colorMode === 'palette-gradient') {
          stroke(paletteGradient(segIdx / Math.max(total - 1, 1)));
        } else if (colorMode === 'depth') {
          stroke(paletteColors[tStack.length % paletteColors.length]);
        } else if (colorMode === 'position') {
          stroke(positionColor(tx, ty, bounds));
        } else if (colorMode === 'per-symbol') {
          stroke(paletteColors[symMap[char] ?? 0]);
        }
        line(0, 0, this.length, 0);
        translate(this.length, 0);
        tx += Math.cos(ta) * this.length;
        ty += Math.sin(ta) * this.length;
        segIdx++;
      } else if (char === "+") {
        rotate(radians(this.angle));
        ta += this.angle * (Math.PI / 180);
      } else if (char === "-") {
        rotate(radians(-this.angle));
        ta -= this.angle * (Math.PI / 180);
      } else if (char === "[") {
        push();
        tStack.push({tx, ty, ta});
      } else if (char === "]") {
        pop();
        ({tx, ty, ta} = tStack.pop());
      }
    }
  }
}

// =====================
// Color helpers
// =====================

function paletteGradient(t) {
  const n = paletteColors.length;
  if (n === 1) return color(paletteColors[0]);
  const seg = t * (n - 1);
  const i = Math.min(Math.floor(seg), n - 2);
  return lerpColor(color(paletteColors[i]), color(paletteColors[i + 1]), seg - i);
}

function positionColor(tx, ty, bounds) {
  const {minX, maxX, minY, maxY} = bounds;
  let t = 0;
  if (positionSubMode === 'horizontal') {
    t = maxX > minX ? (tx - minX) / (maxX - minX) : 0;
  } else if (positionSubMode === 'vertical') {
    t = maxY > minY ? (ty - minY) / (maxY - minY) : 0;
  } else { // radial
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const maxDist = Math.max(
      Math.hypot(maxX - cx, maxY - cy),
      Math.hypot(minX - cx, minY - cy),
      0.001
    );
    t = Math.min(Math.hypot(tx - cx, ty - cy) / maxDist, 1);
  }
  return paletteGradient(t);
}

// =====================
// Global state
// =====================

let system;

// Viewport
let viewScale = 1;
let viewOffsetX = 0;
let viewOffsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragMoved = false;
let lastTouchDist = 0;
let touchOnCanvas = false;
let longPressTimer = null;

// Colors
let paletteColors = ['#000000', '#4a90d9', '#e84393', '#f5a623', '#7ed321'];
let bgCol = "#ffffff";
let colorMode = 'flat';
let positionSubMode = 'horizontal';
let symbolColorMap = {}; // { 'F': 0, 'G': 1, ... } maps symbol → palette index

// Stroke weight
let strokeW = 1;

// Animation
let isAnimating = false;
let animTimeout = null;
let animStartIteration = 0;

// =====================
// p5.js setup / draw
// =====================

function setup() {
  const canvasSize = getCanvasSize();
  const c = createCanvas(canvasSize, canvasSize);
  c.parent("canvas-container");
  fitContainerToCanvas(canvasSize);
  angleMode(RADIANS);

  setupUI();
  loadFractal("koch");
}

function draw() {
  if (system) system.draw();
}

function getCanvasSize() {
  const container = document.getElementById("canvas-container");
  const style = getComputedStyle(container);
  const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  const w = container.clientWidth - paddingX;
  const h = container.clientHeight - paddingY;
  return h > 50 ? Math.min(w, h) : w;
}

function fitContainerToCanvas(s) {
  const container = document.getElementById("canvas-container");
  const style = getComputedStyle(container);
  const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  container.style.flex = "none";
  container.style.width = (s + paddingX) + "px";
  container.style.height = (s + paddingY) + "px";
}

function windowResized() {
  const container = document.getElementById("canvas-container");
  // Reset to CSS defaults so getCanvasSize reads the natural available space
  container.style.flex = "1";
  container.style.width = "";
  container.style.height = "";
  const s = getCanvasSize();
  resizeCanvas(s, s);
  fitContainerToCanvas(s);
}

// =====================
// Mouse interactions
// =====================

function mouseWheel(event) {
  // Only act when mouse is inside the canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  const zoomFactor = event.delta < 0 ? 1.1 : 0.9;
  const newScale = constrain(viewScale * zoomFactor, 0.05, 100);

  // Zoom toward the cursor: keep the world point under the cursor fixed
  const px = mouseX - width / 2;
  const py = mouseY - height / 2;
  viewOffsetX = px - (px - viewOffsetX) * (newScale / viewScale);
  viewOffsetY = py - (py - viewOffsetY) * (newScale / viewScale);
  viewScale = newScale;

  return false; // prevent page scroll
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  isDragging = true;
  dragStartX = mouseX - viewOffsetX;
  dragStartY = mouseY - viewOffsetY;
  dragMoved = false;
  document.getElementById("canvas-container").classList.add("grabbing");
}

function mouseDragged() {
  if (!isDragging) return;
  viewOffsetX = mouseX - dragStartX;
  viewOffsetY = mouseY - dragStartY;
  dragMoved = true;
}

// Touch handlers (separate from mouse so both can coexist cleanly)
function touchStarted() {
  if (!touches.length) return;
  const t = touches[0];

  if (touches.length === 1) {
    if (t.x >= 0 && t.x <= width && t.y >= 0 && t.y <= height) {
      touchOnCanvas = true;
      isDragging = true;
      dragStartX = t.x - viewOffsetX;
      dragStartY = t.y - viewOffsetY;
      dragMoved = false;
      lastTouchDist = 0;
      document.getElementById("canvas-container").classList.add("grabbing");

      // Long press: fire next iteration after 500 ms if finger hasn't moved
      longPressTimer = setTimeout(() => {
        longPressTimer = null;
        if (!dragMoved) nextIteration();
      }, 500);

      return false;
    }
    touchOnCanvas = false;
  } else if (touches.length === 2 && touchOnCanvas) {
    // Second finger cancels any pending long press
    if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
    lastTouchDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    return false;
  }
}

function touchMoved() {
  if (!touchOnCanvas) return; // allow page scroll outside canvas

  if (touches.length === 1 && isDragging) {
    viewOffsetX = touches[0].x - dragStartX;
    viewOffsetY = touches[0].y - dragStartY;
    dragMoved = true;
    // Movement cancels long press
    if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
  } else if (touches.length === 2) {
    const d = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    if (lastTouchDist > 0) {
      const zoomFactor = d / lastTouchDist;
      const newScale = constrain(viewScale * zoomFactor, 0.05, 100);
      // Zoom toward the midpoint of both fingers
      const mx = (touches[0].x + touches[1].x) / 2;
      const my = (touches[0].y + touches[1].y) / 2;
      const px = mx - width / 2;
      const py = my - height / 2;
      viewOffsetX = px - (px - viewOffsetX) * (newScale / viewScale);
      viewOffsetY = py - (py - viewOffsetY) * (newScale / viewScale);
      viewScale = newScale;
    }
    lastTouchDist = d;
  }
  return false;
}

function touchEnded() {
  if (!touchOnCanvas) return;

  // Always cancel long press on lift
  if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }

  if (touches.length === 0) {
    isDragging = false;
    touchOnCanvas = false;
    document.getElementById("canvas-container").classList.remove("grabbing");
  } else if (touches.length === 1) {
    // One finger lifted during pinch — restart single-finger pan
    lastTouchDist = 0;
    isDragging = true;
    dragStartX = touches[0].x - viewOffsetX;
    dragStartY = touches[0].y - viewOffsetY;
    dragMoved = true; // prevent long-press triggering on remaining finger
  }
  return false;
}

function mouseReleased() {
  if (isDragging && !dragMoved) {
    nextIteration();
  }
  isDragging = false;
  document.getElementById("canvas-container").classList.remove("grabbing");
}

// =====================
// UI Setup
// =====================

function setupUI() {
  // Populate fractal dropdown
  const select = document.getElementById("fractalSelect");
  Object.entries(FRACTALS).forEach(([key, f]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = f.name;
    select.appendChild(option);
  });
  select.onchange = (e) => loadFractal(e.target.value);

  // Stroke weight slider
  const swSlider = document.getElementById("strokeWeight");
  swSlider.addEventListener("input", () => {
    strokeW = Number(swSlider.value);
    document.getElementById("strokeWeightVal").textContent = strokeW + "px";
  });

  // Animation speed slider
  const speedSlider = document.getElementById("animSpeed");
  speedSlider.addEventListener("input", () => {
    document.getElementById("animSpeedVal").textContent = speedSlider.value + "ms";
  });

  // Palette swatches
  for (let i = 0; i < 5; i++) {
    document.getElementById('pal' + i).addEventListener('input', (e) => {
      paletteColors[i] = e.target.value;
      updateSymbolLegend();
    });
  }

  // Background color
  document.getElementById("bgColor").addEventListener("input", (e) => {
    bgCol = e.target.value;
  });

  // Color mode dropdown
  document.getElementById("colorModeSelect").addEventListener("change", function () {
    colorMode = this.value;
    document.getElementById("positionControls").classList.toggle("hidden", colorMode !== "position");
    document.getElementById("symbolLegend").classList.toggle("hidden", colorMode !== "per-symbol");
  });

  // Position sub-mode dropdown
  document.getElementById("positionSubMode").addEventListener("change", function () {
    positionSubMode = this.value;
  });
}

function refreshSymbolMap() {
  if (!system) return;
  const allSyms = system.getAllSymbols();
  // Remove stale symbols
  for (const sym of Object.keys(symbolColorMap)) {
    if (!allSyms.includes(sym)) delete symbolColorMap[sym];
  }
  // Auto-assign palette index to new symbols
  allSyms.forEach((sym, i) => {
    if (!(sym in symbolColorMap)) {
      symbolColorMap[sym] = i % paletteColors.length;
    }
  });
}

function updateSymbolLegend() {
  if (!system) return;
  refreshSymbolMap();
  const legend = document.getElementById('symbolLegend');
  const allSyms = system.getAllSymbols();
  legend.innerHTML = allSyms.map(sym => {
    const btns = paletteColors.map((col, idx) => {
      const sel = symbolColorMap[sym] === idx ? ' selected' : '';
      return `<button class="sym-pal-btn${sel}" style="background:${col}" onclick="setSymbolColor('${sym}',${idx})" title="Palette ${idx + 1}"></button>`;
    }).join('');
    return `<span class="sym-entry"><b class="sym-label">${sym}</b><span class="sym-pal-btns">${btns}</span></span>`;
  }).join('');
}

function setSymbolColor(sym, idx) {
  symbolColorMap[sym] = idx;
  updateSymbolLegend();
}

function importCoolors() {
  const raw = document.getElementById('coolorsUrl').value.trim();
  const match = raw.match(/([0-9a-fA-F]{6}(?:-[0-9a-fA-F]{6})*)/);
  if (!match) { alert('No valid Coolors palette found in URL.'); return; }
  const hexes = match[1].split('-').slice(0, 5);
  hexes.forEach((hex, i) => {
    paletteColors[i] = '#' + hex.toLowerCase();
    document.getElementById('pal' + i).value = '#' + hex.toLowerCase();
  });
  updateSymbolLegend();
}

// =====================
// Fractal loading
// =====================

let currentBaseFractal;

function loadFractal(key) {
  resetView();
  currentBaseFractal = FRACTALS[key];
  system = new LSystem(currentBaseFractal);

  document.getElementById("axiomInput").value = currentBaseFractal.axiom;
  document.getElementById("rulesInput").value = Object.entries(currentBaseFractal.rules)
    .map(([a, b]) => `${a}=${b}`)
    .join("\n");
  document.getElementById("angleInput").value = currentBaseFractal.angle;
  document.getElementById("lengthInput").value = currentBaseFractal.length;
  document.getElementById("startAngleInput").value = currentBaseFractal.startAngle;

  updateStats();
  updateSymbolLegend();
}

function parseRules(text) {
  const rules = {};
  text.split("\n").forEach((line) => {
    const eqIdx = line.indexOf("=");
    if (eqIdx > 0) {
      const key = line.slice(0, eqIdx).trim();
      const val = line.slice(eqIdx + 1).trim();
      if (key && val) rules[key] = val;
    }
  });
  return rules;
}

function applyCustom() {
  system = new LSystem({
    axiom: document.getElementById("axiomInput").value.trim(),
    rules: parseRules(document.getElementById("rulesInput").value),
    angle: Number(document.getElementById("angleInput").value),
    length: Number(document.getElementById("lengthInput").value),
    startAngle: Number(document.getElementById("startAngleInput").value),
    translateStartingPoint: currentBaseFractal
      ? currentBaseFractal.translateStartingPoint
      : { x: 0, y: 0 },
  });
  updateStats();
  updateSymbolLegend();
}

// =====================
// Iteration controls
// =====================

function nextIteration() {
  if (system.sentence.length > 500000) {
    alert("Sentence exceeds 500,000 characters. Reset to continue.");
    return;
  }
  system.generate();
  updateStats();
}

function resetSystem() {
  system.reset();
  updateStats();
}

function resetView() {
  viewScale = 1;
  viewOffsetX = 0;
  viewOffsetY = 0;
}

function updateStats() {
  document.getElementById("iteration").textContent =
    "Iteration: " + system.iteration;
  const len = system.sentence.length;
  document.getElementById("sentenceLen").textContent =
    "· " + len.toLocaleString() + " char" + (len === 1 ? "" : "s");
}

// =====================
// Auto-animate
// =====================

function toggleAnimate() {
  if (isAnimating) {
    clearTimeout(animTimeout);
    animTimeout = null;
    isAnimating = false;
    document.getElementById("animBtn").textContent = "▶ Auto";
  } else {
    isAnimating = true;
    animStartIteration = system.iteration;
    document.getElementById("animBtn").textContent = "⏸ Pause";
    scheduleNext();
  }
}

function scheduleNext() {
  if (!isAnimating) return;
  const maxSteps = Number(document.getElementById("animSteps").value);
  const targetIteration = animStartIteration + maxSteps;
  if (system.iteration >= targetIteration || system.sentence.length > 200000) {
    toggleAnimate();
    return;
  }
  const delay = Number(document.getElementById("animSpeed").value);
  animTimeout = setTimeout(() => {
    nextIteration();
    scheduleNext();
  }, delay);
}

// =====================
// Export
// =====================

function exportPNG() {
  const name = prompt("Export filename:", "fractal");
  if (!name) return;

  saveCanvas(name, "png");

  // Build settings text
  const rules = document.getElementById("rulesInput").value.trim();
  const lines = [
    "L-System Settings",
    "==================",
    "",
    "-- L-System --",
    `Axiom:            ${document.getElementById("axiomInput").value.trim()}`,
    `Rules:`,
    ...rules.split("\n").map(r => `  ${r}`),
    `Angle:            ${document.getElementById("angleInput").value}°`,
    `Length:           ${document.getElementById("lengthInput").value}`,
    `Start angle:      ${document.getElementById("startAngleInput").value}°`,
    `Translate origin: x=${system.translateStartingPoint.x}, y=${system.translateStartingPoint.y}`,
    "",
    "-- Colors --",
    `Color mode:       ${colorMode}`,
    `Palette:          ${paletteColors.join(', ')}`,
    `Background:       ${bgCol}`,
    ...(colorMode === 'position' ? [`Position mode:    ${positionSubMode}`] : []),
    "",
    "-- Visual --",
    `Stroke weight:    ${strokeW}px`,
    "",
    "-- State --",
    `Iteration:        ${system.iteration}`,
    `Sentence length:  ${system.sentence.length.toLocaleString()} chars`,
    "",
    "-- Animation --",
    `Delay:            ${document.getElementById("animSpeed").value}ms`,
    `Max steps:        ${document.getElementById("animSteps").value}`,
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name + "_settings.txt";
  a.click();
  URL.revokeObjectURL(url);
}
