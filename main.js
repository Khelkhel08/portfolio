const root = document.documentElement;
const themeButton = document.querySelector(".theme");
const dialog = document.querySelector("#case");
const steps = [
  {
    src: "screens/01-start.jpg",
    title: "Start incubation",
    text: "Nothing is hatching yet. This screen is the empty start. Tap Start Incubation to open a new batch and set it up."
  },
  {
    src: "screens/02-days.jpg",
    title: "Set days",
    text: "Choose the first and last day of each stage. Incubation is while the eggs are turned. Lockdown is the last days, when turning stops and humidity goes up. Here that is day 1–18, then day 19–21."
  },
  {
    src: "screens/03-climate.jpg",
    title: "Set climate",
    text: "Set how warm and how humid the box should stay. Incubation holds about 36.5–37.5°C and 45–55% humidity. Lockdown keeps the same heat and raises humidity to 65–75% so the chicks can hatch."
  },
  {
    src: "screens/04-tilt.jpg",
    title: "Capture and tilt",
    text: "Set how often the tray turns the eggs, and how often the camera takes a photo. Here the tray turns every 1 minute. The camera shoots every 5 minutes in incubation and every 20 minutes in lockdown."
  },
  {
    src: "screens/05-review.jpg",
    title: "Review settings",
    text: "One last check before the batch starts: climate, lockdown, tilt, and camera. Confirm and start begins the hatch. Back to edit returns to the earlier steps."
  },
  {
    src: "screens/06-dash1.jpg",
    title: "Dashboard",
    text: "The live batch. It is day 1, still in incubation. The alerts say the water tray is empty, and temperature and humidity are below the range you set. Wi-Fi is disconnected. Power is on the main line."
  },
  {
    src: "screens/07-dash2.jpg",
    title: "Dashboard, continued",
    text: "Further down the same screen. Auto keeps the climate inside the ranges. Manual lets you switch the heater and fans yourself. Open Controls goes to those switches. Cancel incubation stops the batch."
  },
  {
    src: "screens/08-controls.jpg",
    title: "Controls",
    text: "The heater and both fans are on standby, so they are allowed to run. The tray turns every 1 minute and is tilting right. The water pump is automatic and refills when the sensor is at 15% or below."
  },
  {
    src: "screens/09-tray.jpg",
    title: "Egg tray",
    text: "The camera looking at the eggs. It marked 6 as normal and 0 as cracked. You can force a new photo, and switch the view between incubation, lockdown, and hatch."
  },
  {
    src: "screens/10-cancel.jpg",
    title: "Cancel incubation",
    text: "This stops the batch and turns the relays off. You have to type CANCEL so it does not happen by mistake. Keep running leaves the hatch going."
  }
];
let stepIndex = 0;

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

const shot = document.querySelector("#shot");
const stepTitle = document.querySelector("#step-title");
const stepText = document.querySelector("#step-text");
const stepCount = document.querySelector("#step-count");
const stepList = document.querySelector("#step-list");

function showStep(index) {
  stepIndex = (index + steps.length) % steps.length;
  const step = steps[stepIndex];
  shot.src = step.src;
  shot.alt = step.title;
  stepTitle.textContent = step.title;
  stepText.textContent = step.text;
  stepCount.textContent = `${stepIndex + 1} of ${steps.length}`;
  stepList.querySelectorAll("button").forEach((button, i) => {
    button.classList.toggle("is-on", i === stepIndex);
  });
}

steps.forEach((step, index) => {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = step.title;
  button.addEventListener("click", () => showStep(index));
  item.appendChild(button);
  stepList.appendChild(item);
});
showStep(0);
document.querySelector("#next").addEventListener("click", () => showStep(stepIndex + 1));
document.querySelector("#prev").addEventListener("click", () => showStep(stepIndex - 1));

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
