const root = document.documentElement;
const themeButton = document.querySelector(".theme");
const steps = [
  {
    src: "screens/01-start.jpg",
    title: "Start incubation",
    text: "No batch is running yet. Tap Start Incubation. The next screens are where you choose the days, the climate you want, how often the tray turns, and how often the camera takes a photo."
  },
  {
    src: "screens/02-days.jpg",
    title: "Set days",
    text: "You choose how long each stage lasts. Incubation is the turning stage. Lockdown is the last stretch, when turning stops and humidity goes up so the chicks can hatch. In this example the user set day 1–18 for incubation and day 19–21 for lockdown."
  },
  {
    src: "screens/03-climate.jpg",
    title: "Set climate",
    text: "You set the climate you prefer. Choose a minimum and maximum temperature and humidity for incubation, then again for lockdown. In this example incubation is 36.5–37.5°C and 45–55% humidity. Lockdown keeps that temperature and uses 65–75% humidity. Later, the dashboard warns you if a reading leaves these ranges."
  },
  {
    src: "screens/04-tilt.jpg",
    title: "Capture and tilt",
    text: "You set how often you want the eggs turned, and how often you want a photo. In this example the tray tilts every 1 minute. The camera takes a photo every 5 minutes during incubation and every 20 minutes during lockdown. Roboflow checks those photos later and marks each egg normal or cracked."
  },
  {
    src: "screens/05-review.jpg",
    title: "Review settings",
    text: "This is your review before the hatch starts. Read the climate, tilt timing, and camera timing you just chose. Confirm and start begins the batch with those settings. Back to edit sends you back if something is wrong."
  },
  {
    src: "screens/06-dash1.jpg",
    title: "Dashboard",
    text: "After you start the batch, this is where you watch it. Day 1 of batch 90. The water tray is empty, temperature is 33.7°C, and humidity is 42%. Both are outside the climate you set. Wi-Fi is disconnected, and the incubator is on main power. The alerts tell you what to fix."
  },
  {
    src: "screens/07-dash2.jpg",
    title: "Dashboard, continued",
    text: "You choose how the incubator should respond. Auto holds temperature and humidity inside the ranges you set, and the pump refills the tray at 15%. Manual lets you switch the heater and fans yourself. Cancel incubation is how you stop the batch."
  },
  {
    src: "screens/08-controls.jpg",
    title: "Controls",
    text: "You check the parts that hold your settings. The heater, circulation fan, and ventilation fan stay on standby until a reading leaves the climate you set. The tray is tilting right on the 1-minute interval you chose. The pump refills on its own when the sensor reads 15% or below."
  },
  {
    src: "screens/09-tray.jpg",
    title: "Egg tray",
    text: "You open this to look at the eggs. Roboflow checks the photo and marks each egg normal or cracked. This frame shows 6 normal and 0 cracked. Those counts are the analytics on the website. You can take a new photo, or switch the view between incubation, lockdown, and hatch."
  },
  {
    src: "screens/10-cancel.jpg",
    title: "Cancel incubation",
    text: "You only use this when you mean to stop the hatch. Type CANCEL so it does not happen by accident. The relays turn off. Keep running leaves the batch going."
  }
];

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

const aquaSteps = [
  {
    src: "screens/aquagrow/01-login.png",
    title: "Login",
    text: "You sign in with email and password to open your garden. The greeting says the plants missed you."
  },
  {
    src: "screens/aquagrow/02-home.png",
    title: "Home",
    text: "This is your garden overview. You see how many plants you have and which ones need water. Sparkz has 3 plants, and 2 could use a drink. Mochi is at 46% water and Pip is at 28%. Garden health shows water, sunshine, and love across the plants. Tap a plant when you want to look after it."
  },
  {
    src: "screens/aquagrow/03-plants.png",
    title: "My plants",
    text: "You keep your plants here. Mochi is a pothos, Sage is a snake plant, and Pip is a succulent. A red badge means that plant needs you. Add new is where you start another plant."
  },
  {
    src: "screens/aquagrow/04-water.png",
    title: "Water",
    text: "You use this list to see who to water. Mochi and Pip are thirsty. Sage is happy at 72% water, so that one can wait."
  },
  {
    src: "screens/aquagrow/05-status.png",
    title: "Plant status",
    text: "You opened Pip. The plant says it is feeling parched. Water is 28%, sunshine is 91%, and love is 61%. Look After Pip is the button you tap to care for it."
  },
  {
    src: "screens/aquagrow/06-happy.png",
    title: "After care",
    text: "This is what you see after you water Pip and give it a little sun. The screen says Pip is happy and lives to see another day."
  },
  {
    src: "screens/aquagrow/07-add.png",
    title: "Add a plant",
    text: "You add a plant here. Pick a picture, give it a name, and choose the species. You also set how often it should be watered and how much sunshine it needs. Bill is a snake plant, watered every 5 days, with a sunshine need of 70%. Add to garden saves it."
  }
];

function bindWalk(root, walkSteps) {
  const shot = root.querySelector(".shot");
  const title = root.querySelector(".title");
  const text = root.querySelector(".text");
  const count = root.querySelector(".count");
  const list = root.querySelector(".step-list");
  let index = 0;
  function show(next) {
    index = (next + walkSteps.length) % walkSteps.length;
    const step = walkSteps[index];
    shot.src = step.src;
    shot.alt = step.title;
    title.textContent = step.title;
    text.textContent = step.text;
    count.textContent = `${index + 1} of ${walkSteps.length}`;
    list.querySelectorAll("button").forEach((button, i) => {
      button.classList.toggle("is-on", i === index);
    });
  }
  walkSteps.forEach((step, i) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = step.title;
    button.addEventListener("click", () => show(i));
    item.appendChild(button);
    list.appendChild(item);
  });
  show(0);
  root.querySelector(".next").addEventListener("click", () => show(index + 1));
  root.querySelector(".prev").addEventListener("click", () => show(index - 1));
}

const appSlides = [...document.querySelectorAll(".app-slide")];
let appIndex = 0;

function showApp(index) {
  if (!appSlides.length) return;
  appIndex = (index + appSlides.length) % appSlides.length;
  appSlides.forEach((slide, i) => slide.classList.toggle("is-on", i === appIndex));
}

document.querySelector("#app-next").addEventListener("click", () => showApp(appIndex + 1));
document.querySelector("#app-prev").addEventListener("click", () => showApp(appIndex - 1));
document.querySelectorAll("[data-open-app]").forEach((link) => {
  link.addEventListener("click", () => {
    const index = appSlides.findIndex((slide) => slide.dataset.app === link.dataset.openApp);
    if (index >= 0) showApp(index);
  });
});

bindWalk(document.querySelector("#incuvue-walk"), steps);
bindWalk(document.querySelector("#aquagrow-walk"), aquaSteps);

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
