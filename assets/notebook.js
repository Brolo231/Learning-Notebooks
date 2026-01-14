let current = 0;
const slides = () => document.querySelectorAll(".slide");

function showSlide(i) {
  slides().forEach((s, idx) => {
    s.style.display = idx === i ? "block" : "none";
  });

  const indicator = document.getElementById("slide-indicator");
  if (indicator) {
    indicator.innerText = `Page ${i + 1} / ${slides().length}`;
  }
}

function nextSlide() {
  if (current < slides().length - 1) current++;
  showSlide(current);
}

function prevSlide() {
  if (current > 0) current--;
  showSlide(current);
}

document.addEventListener("DOMContentLoaded", () => showSlide(0));

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

let startX = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 60) nextSlide();
  if (endX - startX > 60) prevSlide();
});

document.addEventListener("click", e => {
  const link = e.target.closest("a[href^='#']");
  if (!link) return;

  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth" });
});

function buildBreadcrumb() {
  const el = document.getElementById("breadcrumb");
  if (!el) return;

  const path = window.location.pathname
    .split("/")
    .filter(p => p && p !== "notebooks");

  if (path.length <= 1) return;

  let current = "/Learning-Notebooks/notebooks/";
  el.innerHTML = " / ";

  path.slice(0, -1).forEach((part, i) => {
    current += part + "/";
    const a = document.createElement("a");
    a.href = current;
    a.textContent = part.replace(/_/g, " ");
    a.style.marginRight = "6px";
    el.appendChild(a);

    if (i < path.length - 2) {
      el.appendChild(document.createTextNode(" / "));
    }
  });
}

document.addEventListener("DOMContentLoaded", buildBreadcrumb);

function buildPageJump() {
  const container = document.getElementById("page-jump");
  if (!container) return;

  slides().forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = `Pg ${i + 1}`;
    btn.onclick = () => {
      current = i;
      showSlide(current);
    };
    container.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", buildPageJump);