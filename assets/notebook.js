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

  // ✅ FIX: toggle pagination visibility
  updatePaginationVisibility(i);
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

function updatePaginationVisibility(index) {
  const pageJump = document.getElementById("page-jump");
  if (!pageJump) return;

  // Show page jump ONLY on first slide
  pageJump.style.display = index === 0 ? "flex" : "none";
}

let SEARCH_DATA = [];

// Load search index (works only over http:// or https://)
fetch("assets/search_index.json")
  .then(r => r.json())
  .then(d => {
    SEARCH_DATA = d;
    console.log("🔍 Search index loaded:", SEARCH_DATA.length, "entries");
  })
  .catch(err => console.error("❌ Failed to load search index:", err));

document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchBox");
  if (!searchBox) {
    console.warn("❌ searchBox not found in DOM");
    return;
  }

  searchBox.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();
    if (!query) return;

    // Build safe regex: whole word or exact phrase
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wordRegex = new RegExp(`\\b${escaped}\\b`, "i");
  const tokens = query.split(/\s+/).filter(Boolean);

  const lessons = document.querySelectorAll(".lesson-item");
  const allDetails = document.querySelectorAll("details");

  // Reset
  lessons.forEach(el => (el.style.display = "block"));
  allDetails.forEach(d => (d.open = false));

  if (!tokens.length) return;

  const matchedLessons = [];

  lessons.forEach(el => {
    const titleEl = el.querySelector(".lesson-title");
    const link = el.querySelector("a.lesson-link");
    if (!link || !titleEl) return;

    const titleText = titleEl.innerText.toLowerCase();
    const href = link.getAttribute("href");
    const filename = href.split("/").pop().toLowerCase();

    const entry = SEARCH_DATA.find(n =>
      n.path.toLowerCase().endsWith(filename)
    );

    // Build weighted search text
    let matched = false;

    // 1️⃣ Title match (highest priority)
    if (wordRegex.test(titleText)) {
      matched = true;
    }

    // 2️⃣ Headings match
    else if (entry && wordRegex.test(entry.headings)) {
      matched = true;
    }

    // 3️⃣ Content match (WHOLE WORD only)
    else if (entry && wordRegex.test(entry.content)) {
      matched = true;
    }

    if (!matched) {
      el.style.display = "none";
    } else {
      matchedLessons.push(el);
    }
  });

  // Auto-expand parents
  matchedLessons.forEach(el => {
    let parent = el.parentElement;
    while (parent) {
      if (parent.tagName === "DETAILS") parent.open = true;
      parent = parent.parentElement;
    }
  });

  // Close empty folders
  allDetails.forEach(d => {
    const visibleInside = d.querySelector(
      ".lesson-item:not([style*='display: none'])"
    );
    if (!visibleInside) d.open = false;
  });
});
});