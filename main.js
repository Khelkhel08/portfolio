const root = document.documentElement;
const themeButton = document.querySelector(".theme");
const steps = [
  {
    src: "screens/01-start.jpg",
    title: "Start incubation",
    text: "No batch is running. Tap Start Incubation to set the days, climate, camera, and tray before a hatch begins."
  },
  {
    src: "screens/02-days.jpg",
    title: "Set days",
    text: "Incubation is the turning stage. Lockdown is the last stretch, when turning stops and humidity rises so the chicks can hatch. This setup uses day 1–18 for incubation and day 19–21 for lockdown."
  },
  {
    src: "screens/03-climate.jpg",
    title: "Set climate",
    text: "Incubation stays at 36.5–37.5°C and 45–55% humidity. Lockdown keeps the same temperature and raises humidity to 65–75%."
  },
  {
    src: "screens/04-tilt.jpg",
    title: "Capture and tilt",
    text: "The tray turns the eggs every 1 minute. The camera takes a photo every 5 minutes during incubation and every 20 minutes during lockdown. Those photos are what Roboflow checks."
  },
  {
    src: "screens/05-review.jpg",
    title: "Review settings",
    text: "This is the last check: temperature, humidity, tilt timing, and camera timing. Confirm and start begins the batch. Back to edit returns to the earlier steps."
  },
  {
    src: "screens/06-dash1.jpg",
    title: "Dashboard",
    text: "Day 1 of incubation for batch 90. The alerts say the water tray is empty, temperature is 33.7°C, and humidity is 42%. Both are below the set range. Wi-Fi is disconnected, and the incubator is on main power."
  },
  {
    src: "screens/07-dash2.jpg",
    title: "Dashboard, continued",
    text: "Auto holds temperature and humidity inside the ranges you set, and the pump refills the tray at 15%. Manual opens the heater and fan switches. Cancel incubation stops the batch."
  },
  {
    src: "screens/08-controls.jpg",
    title: "Controls",
    text: "The heater, circulation fan, and ventilation fan are on standby, so they can run when needed. The tray turns every 1 minute and is tilting right. The water pump refills on its own when the sensor reads 15% or below."
  },
  {
    src: "screens/09-tray.jpg",
    title: "Egg tray",
    text: "This is the camera view. Roboflow looks at the photo and marks each egg as normal or cracked. This frame shows 6 normal and 0 cracked. Those counts are the analytics on the website. You can take a new photo, or switch the view between incubation, lockdown, and hatch."
  },
  {
    src: "screens/10-cancel.jpg",
    title: "Cancel incubation",
    text: "Stopping the batch turns the relays off. Type CANCEL so it does not happen by accident. Keep running leaves the hatch going."
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

const slides = [...document.querySelectorAll(".slide")];
let slideIndex = 0;

function showSlide(index) {
  if (!slides.length) return;
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("is-on", i === slideIndex));
}

document.querySelector("#proj-next").addEventListener("click", () => showSlide(slideIndex + 1));
document.querySelector("#proj-prev").addEventListener("click", () => showSlide(slideIndex - 1));
document.querySelectorAll("[data-slide]").forEach((link) => {
  link.addEventListener("click", () => {
    const index = slides.findIndex((slide) => slide.dataset.project === link.dataset.slide);
    if (index >= 0) showSlide(index);
  });
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
