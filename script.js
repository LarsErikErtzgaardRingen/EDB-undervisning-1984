// OPPSETT  
const COLS = 40;      // tegn per linje
const ROWS = 25;      // linjer på skjermen
const TOP = 2;        // første rad navnet kan stå på
const BOTTOM = 22;    // siste rad navnet kan stå på
const PLACEHOLDER = "SKRIV NAVNET DITT HER";

const screen = document.getElementById("screen");
const nameEl = document.getElementById("name");
const input = document.getElementById("name-input");
const typed = document.getElementById("typed");
const placeholder = document.getElementById("placeholder");
const status = document.getElementById("status");

let x = 10;
let y = 12;
let name = "";