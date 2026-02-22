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
  }

  generate() {
    let next = "";
    for (let char of this.sentence) {
      next += this.rules[char] || char;
    }
    this.sentence = next;
    this.iteration++;
    this._segmentsDirty = true;
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

    // Gradient setup
    let segmentIndex = 0;
    const totalSegments = gradientMode ? this.countSegments() : 1;
    const c1 = gradientMode ? color(gradFrom) : null;
    const c2 = gradientMode ? color(gradTo) : null;

    if (!gradientMode) {
      stroke(strokeCol);
    }

    for (let char of this.sentence) {
      if (char >= "A" && char <= "Z") {
        if (gradientMode) {
          const t = totalSegments > 1 ? segmentIndex / (totalSegments - 1) : 0;
          stroke(lerpColor(c1, c2, t));
          segmentIndex++;
        }
        line(0, 0, this.length, 0);
        translate(this.length, 0);
      } else if (char === "+") {
        rotate(radians(this.angle));
      } else if (char === "-") {
        rotate(radians(-this.angle));
      } else if (char === "[") {
        push();
      } else if (char === "]") {
        pop();
      }
    }
  }
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

// Colors
let strokeCol = "#000000";
let bgCol = "#ffffff";
let gradientMode = false;
let gradFrom = "#0000ff";
let gradTo = "#ff0000";

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

function touchMoved() {
  if (isDragging) return false; // prevent page scroll while panning canvas
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

  // Color pickers
  document.getElementById("strokeColor").addEventListener("input", (e) => {
    strokeCol = e.target.value;
  });
  document.getElementById("bgColor").addEventListener("input", (e) => {
    bgCol = e.target.value;
  });
  document.getElementById("gradFrom").addEventListener("input", (e) => {
    gradFrom = e.target.value;
  });
  document.getElementById("gradTo").addEventListener("input", (e) => {
    gradTo = e.target.value;
  });

  // Gradient toggle
  document.getElementById("gradientMode").addEventListener("change", function () {
    gradientMode = this.checked;
    document.getElementById("gradientControls").classList.toggle("hidden", !this.checked);
  });
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
    `Stroke:           ${strokeCol}`,
    `Background:       ${bgCol}`,
    `Gradient mode:    ${gradientMode ? "on" : "off"}`,
    ...(gradientMode ? [
      `Gradient from:    ${gradFrom}`,
      `Gradient to:      ${gradTo}`,
    ] : []),
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
