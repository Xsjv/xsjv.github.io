const canvas = document.querySelector(".code-rain");
const context = canvas.getContext("2d");
const menu = document.querySelector("[data-menu]");
const toggle = document.querySelector(".menu-toggle");
const brand = document.querySelector(".brand");
const bootScreen = document.querySelector(".boot-screen");
const flash = document.querySelector(".screen-flash");

const glyphs = "01<>/$#{}[]=+-*";
const fontSize = 16;
let columns = [];
let width = 0;
let height = 0;

function resize() {
  const scale = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.setTransform(scale, 0, 0, scale, 0, 0);
  columns = Array.from(
    { length: Math.ceil(width / fontSize) },
    () => Math.random() * -80
  );
}

function draw() {
  context.fillStyle = "rgba(1, 7, 6, 0.16)";
  context.fillRect(0, 0, width, height);
  context.font = `${fontSize}px "IBM Plex Mono", monospace`;

  columns.forEach((column, index) => {
    const text = glyphs[Math.floor(Math.random() * glyphs.length)];
    const x = index * fontSize;
    const y = column * fontSize;

    context.fillStyle = column > 2 && Math.random() > 0.92 ? "#effff9" : "#73ffc8";
    context.fillText(text, x, y);

    if (y > height && Math.random() > 0.975) {
      columns[index] = Math.random() * -20;
      return;
    }

    columns[index] += 1;
  });

  requestAnimationFrame(draw);
}

function syncTopState() {
  document.body.classList.toggle("near-top", window.scrollY < 120);
}

function setMenuState(open) {
  menu.dataset.open = String(open);
  toggle.setAttribute("aria-expanded", String(open));
}

function playScreenClick() {
  flash.classList.remove("is-active");
  void flash.offsetWidth;
  flash.classList.add("is-active");
}

function playBootSequence() {
  bootScreen.classList.remove("is-active");
  void bootScreen.offsetWidth;
  bootScreen.classList.add("is-active");
}

resize();
draw();
syncTopState();

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

window.scrollTo(0, 0);
playBootSequence();

window.addEventListener("resize", resize);
window.addEventListener("scroll", syncTopState, { passive: true });
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  syncTopState();
});

toggle.addEventListener("click", () => {
  const isOpen = menu.dataset.open === "true";
  setMenuState(!isOpen);
});

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target)) {
    setMenuState(false);
  }
});

document.querySelectorAll(".menu-panel a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

flash.addEventListener("animationend", () => {
  flash.classList.remove("is-active");
});

bootScreen.addEventListener("animationend", () => {
  bootScreen.classList.remove("is-active");
  document.body.classList.remove("booting");
});

brand.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  setMenuState(false);
});
