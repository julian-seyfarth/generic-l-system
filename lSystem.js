// =====================
// Fraktal-Presets
// =====================

const FRACTALS = {
    koch: {
      name: "Kochkurve",
      axiom: "F",
      rules: { F: "F+F--F+F" },
      angle: 60,
      length: 5,
      startAngle: 0
    },
  
    dragon: {
      name: "Dragon Curve",
      axiom: "FX",
      rules: {
        X: "X+YF",
        Y: "FX-Y"
      },
      angle: 90,
      length: 8,
      startAngle: 0
    },
  
    hilbert: {
      name: "Hilbert-Kurve",
      axiom: "A",
      rules: {
        A: "+BF-AFA-FB+",
        B: "-AF+BFB+FA-"
      },
      angle: 90,
      length: 8,
      startAngle: 0
    },

    tree: {
      name: "Baum",
      axiom: "F",
      rules: {
        F: "F[+F]F[-F]F"
      },
      angle: 25,
      length: 10,
      startAngle: -90
    },

    sierpinski: {
        name: "Sierpinski Dreieck",
        axiom: "F-G-G",
        rules: {
          F: "F-G+F+G-F",
          G: "GG"
        },
        angle: 120,
        length: 10,
        startAngle: 0
      },

      peano: {
        name: "Peano Kurve",
        axiom: "X",
        rules: {
          X: "XFYFX+F+YFXFY-F-XFYFX",
          Y: "YFXFY-F-XFYFX+F+YFXFY"
        },
        angle: 90,
        length: 5,
        startAngle: 0
      },
      
  };
  
  // =====================
  // L-System Klasse
  // =====================
  
  class LSystem {
    constructor({ axiom, rules, angle, length, startAngle }) {
      this.axiom = axiom;
      this.rules = rules;
      this.angle = angle;
      this.length = length;
      this.startAngle = startAngle || 0;
  
      this.reset();
    }
  
    reset() {
      this.sentence = this.axiom;
      this.iteration = 0;
    }
  
    generate() {
      let next = "";
      for (let char of this.sentence) {
        next += this.rules[char] || char;
      }
      this.sentence = next;
      this.iteration++;
    }
  
    draw() {
      background(255);
      resetMatrix();
      translate(width / 2, height / 2);
      rotate(radians(this.startAngle));
  
      for (let char of this.sentence) {
        if (char >= "A" && char <= "Z") {
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
  // p5.js
  // =====================
  
  let system;
  
  function setup() {
    const c = createCanvas(600, 600);
    c.parent("canvas-container");
    angleMode(RADIANS);
    stroke(0);
  
    setupUI();
    loadFractal("koch");
  }
  
  function draw() {
    if (system) system.draw();
  }
  
  // =====================
  // UI Logik
  // =====================
  
  function setupUI() {
    const select = document.getElementById("fractalSelect");
  
    Object.entries(FRACTALS).forEach(([key, f]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = f.name;
      select.appendChild(option);
    });
  
    select.onchange = e => loadFractal(e.target.value);
  }
  
  function loadFractal(key) {
    const f = FRACTALS[key];
  
    system = new LSystem(f);
  
    document.getElementById("axiomInput").value = f.axiom;
    document.getElementById("rulesInput").value = Object.entries(f.rules)
      .map(([a, b]) => `${a}=${b}`)
      .join("\n");
    document.getElementById("angleInput").value = f.angle;
    document.getElementById("lengthInput").value = f.length;
  
    updateIteration();
  }
  
  function parseRules(text) {
    const rules = {};
    text.split("\n").forEach(line => {
      const [a, b] = line.split("=");
      if (a && b) rules[a.trim()] = b.trim();
    });
    return rules;
  }
  
  function applyCustom() {
    system = new LSystem({
      axiom: document.getElementById("axiomInput").value,
      rules: parseRules(document.getElementById("rulesInput").value),
      angle: Number(document.getElementById("angleInput").value),
      length: Number(document.getElementById("lengthInput").value),
      startAngle: 0
    });
  
    updateIteration();
  }
  
  function nextIteration() {
    system.generate();
    updateIteration();
  }
  
  function resetSystem() {
    system.reset();
    updateIteration();
  }
  
  function updateIteration() {
    document.getElementById("iteration").textContent =
      "Iteration: " + system.iteration;
  }
  