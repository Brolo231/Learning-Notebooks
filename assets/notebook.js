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