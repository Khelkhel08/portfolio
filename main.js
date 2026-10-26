const root = document.documentElement;
const themeButton = document.querySelector(".theme");
const dialog = document.querySelector("#case");
const screens = ["dashboard", "controls", "tray"];

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const light = theme === "light";
  themeButton.textContent = light ? "Dark mode" : "Light mode";
  themeButton.setAttribute("aria-pressed", light ? "true" : "false");
}

applyTheme(root.getAttribute("data-theme") || "dark");
themeButton.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.textContent = open ? "Close" : "Menu";
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "Menu";
  });
});

function openCase(id) {
  const article = dialog.querySelector(`[data-case="${id}"]`);
  if (!article) return;
  dialog.querySelectorAll("[data-case]").forEach((node) => {
    node.hidden = node !== article;
  });
  if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
}

function closeCase() {
  if (dialog.open) dialog.close();
}

document.querySelectorAll("[data-open]").forEach((node) => {
  node.addEventListener("click", () => openCase(node.dataset.open));
});
document.querySelectorAll("[data-close]").forEach((node) => {
  node.addEventListener("click", () => closeCase());
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeCase();
});

function showScreen(name) {
  if (!screens.includes(name)) return;
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("is-on", screen.dataset.screen === name);
  });
  document.querySelectorAll("[data-screen-btn]").forEach((button) => {
    button.classList.toggle("is-on", button.dataset.screenBtn === name);
  });
}

document.querySelectorAll("[data-screen-btn]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.screenBtn));
});
document.querySelectorAll(".switch").forEach((row) => {
  row.addEventListener("click", () => {
    row.setAttribute("aria-pressed", row.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const onScroll = () => {
  const mark = window.scrollY + 120;
  let current = "";
  sections.forEach((section) => {
    if (section.offsetTop <= mark) current = section.id;
  });
  document.querySelectorAll(".nav-links a").forEach((anchor) => {
    anchor.classList.toggle("is-on", anchor.getAttribute("href") === `#${current}`);
  });
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();
