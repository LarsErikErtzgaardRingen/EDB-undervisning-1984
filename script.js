
// ---------- Oppsett ----------
const COLS = 40;      // tegn per linje
const ROWS = 25;      // linjer på skjermen
const TOP = 2;        // første rad navnet kan stå på
const BOTTOM = 21;    // siste rad navnet kan stå på
const JUMP = 5;       // hvor mange ruter et hopp er

const screen = document.getElementById("screen");
const grid = document.getElementById("grid");
const nameEl = document.getElementById("name");
const input = document.getElementById("name-input");
const typed = document.getElementById("typed");
const placeholder = document.getElementById("placeholder");
const status = document.getElementById("status");
const help = document.getElementById("help");
const probe = document.getElementById("probe");

let x = 10;
let y = 12;
let name = "";
let lastMove = [1, 0]; // retningen navnet sist gikk – hoppet går samme vei

// Holder et tall mellom min og max – det er dette som holder navnet på skjermen
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ---------- Tegnbredde ----------
// Måler hvor bred skriften egentlig er, og strekker den så 40 tegn
// fyller hele bredden – akkurat som på en gammel 40-tegns skjerm.
function fitFont() {
  const cellWidth = grid.clientWidth / COLS;
  const charWidth = probe.getBoundingClientRect().width / probe.textContent.length;
  if (charWidth > 0) grid.style.setProperty("--sx", cellWidth / charWidth);
}

// ---------- Tegn på skjermen ----------
function draw() {
  // Navnet kan ikke gå lenger til høyre enn at hele navnet får plass
  x = clamp(x, 0, COLS - name.length);
  y = clamp(y, TOP, BOTTOM);

  nameEl.style.setProperty("--x", x);
  nameEl.style.setProperty("--y", y);

  const pos = (n) => String(n).padStart(2, "0");
  const extra = isEditing() ? "" : "   ENTER: ENDRE NAVN";
  status.textContent = `X=${pos(x)} Y=${pos(y)}${extra}`;
}

// ---------- Skrivemodus ----------
// Mens man skriver, er mellomrom et vanlig mellomrom (LARS ERIK).
// Etter Enter betyr mellomrom "hopp".
const isEditing = () => document.activeElement === input;

function showHelp() {
  const editing = isEditing();
  screen.classList.toggle("editing", editing);
  help.textContent = editing
    ? "SKRIV NAVNET OG TRYKK ENTER"
    : "PILTASTER: FLYTT  MELLOMROM: HOPP";
  draw();
}

function startEditing() {
  input.focus({ preventScroll: true });
  showHelp();
}

function stopEditing() {
  input.blur();
  showHelp();
}

function move(dx, dy, steps = 1) {
  lastMove = [dx, dy];
  x += dx * steps;
  y += dy * steps;
  draw();
}

// Kalles hver gang brukeren skriver noe
function update() {
  const text = input.value.toUpperCase();

  // Skrivelinja øverst: teksten, så den blinkende firkanten
  typed.textContent = text;
  placeholder.hidden = text.length > 0; // hjelpeteksten forsvinner når man skriver

  // Navnet som flyttes rundt. Det vises først når brukeren har skrevet noe.
  name = text.trim();
  nameEl.textContent = name;
  nameEl.hidden = name.length === 0;
  draw();
}

// ---------- Hendelser ----------
const MOVES = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

document.addEventListener("keydown", (e) => {
  const direction = MOVES[e.key];

  // Piltaster flytter navnet én rute, også mens man skriver
  if (direction) {
    e.preventDefault(); // ikke la siden scrolle
    move(direction[0], direction[1]);
    return;
  }

  // Enter veksler mellom å skrive navnet og å styre det
  if (e.key === "Enter") {
    e.preventDefault();
    isEditing() ? stopEditing() : startEditing();
    return;
  }

  // Mellomrom = hopp, men bare når man ikke skriver
  if (e.key === " " && !isEditing()) {
    e.preventDefault(); // ikke la siden scrolle
    move(lastMove[0], lastMove[1], JUMP);
  }
});

input.addEventListener("input", update);
input.addEventListener("blur", showHelp);

// Klikk: regn ut hvilken rute i tekstområdet som ble klikket, og flytt navnet dit
screen.addEventListener("click", (e) => {
  if (e.target.closest("#prompt")) return startEditing(); // klikk på skrivelinja = skriv

  const rect = grid.getBoundingClientRect();
  const col = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
  const rowHeight = (rect.width / COLS) * 1.2; // samme som --ch i CSS
  const row = Math.floor((e.clientY - rect.top) / rowHeight);
  x = col - Math.floor(name.length / 2); // midten av navnet havner der du klikket
  y = row;
  draw();
});

window.addEventListener("resize", fitFont);
document.fonts.ready.then(fitFont); // mål på nytt når skrifttypen er lastet

fitFont();
update();
startEditing(); // start med å skrive navnet
