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
    text: "This is the front door. You sign in with email and password. The greeting says the plants missed you."
  },
  {
    src: "screens/aquagrow/02-home.png",
    title: "Home",
    text: "The garden overview. Sparkz has 3 plants, and 2 could use a drink. Mochi is at 46% water and Pip is at 28%. Garden health shows water, sunshine, and love across the plants."
  },
  {
    src: "screens/aquagrow/03-plants.png",
    title: "My plants",
    text: "Mochi the pothos, Sage the snake plant, and Pip the succulent. The red badge means that plant needs attention. Add new starts another plant."
  },
  {
    src: "screens/aquagrow/04-water.png",
    title: "Water",
    text: "A list of who needs a drink. Mochi and Pip are thirsty. Sage the snake plant is happy at 72% water."
  },
  {
    src: "screens/aquagrow/05-status.png",
    title: "Plant status",
    text: "Pip the succulent is open. The plant says it is feeling parched. Water is 28%, sunshine is 91%, and love is 61%. Look After Pip is the care button."
  },
  {
    src: "screens/aquagrow/06-happy.png",
    title: "After care",
    text: "After a drink and a little sun, Pip perks up. The screen says Pip is happy and lives to see another day."
  },
  {
    src: "screens/aquagrow/07-add.png",
    title: "Add a plant",
    text: "Pick a picture, give the plant a name, and choose the species. Bill is a snake plant, watered every 5 days, with a sunshine need of 70%. Add to garden saves it."
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
