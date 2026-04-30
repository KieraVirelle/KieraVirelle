const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const tabTargets = document.querySelectorAll("[data-tab-target]");
const tabButtons = document.querySelectorAll(".site-nav [data-tab-target]");
const panels = document.querySelectorAll("[data-tab-panel]");
const uploadInput = document.querySelector("#preview-upload");
const uploadGallery = document.querySelector("#upload-gallery");
const lightbox = document.querySelector("#media-lightbox");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxMedia = document.querySelector("#lightbox-media");
const lightboxCloseButtons = document.querySelectorAll("[data-lightbox-close]");
const portfolioImages = document.querySelectorAll(".project-thumb img");
const tabLoader = document.querySelector("#tab-loader");
const flyerFilterButtons = document.querySelectorAll("[data-flyer-filter]");
const flyerCards = document.querySelectorAll("[data-flyer-tags]");
const flyerEmptyMessage = document.querySelector(".flyer-empty-message");
const cuteQuote = document.querySelector("[data-cute-quote]");
const bookingLinks = document.querySelectorAll(".discord-card[href*='discord.com']");
const copyReviewButton = document.querySelector("[data-copy-review]");
const reviewForm = document.querySelector(".review-form");
const reviewHelper = document.querySelector("[data-review-helper]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let loadingTimer;
let sparkleTimer = 0;

const cuteQuotes = [
  "Built between snack breaks",
  "Powered by cookies",
  "Dino nuggies secured",
  "Caffeine.exe is running",
  "Making cute things at alarming speed",
];

function setActiveTab(tabId, updateHash = true) {
  document.body.dataset.activeTab = tabId;

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === tabId);
  });

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tabTarget === tabId);
  });

  siteNav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");

  if (updateHash) {
    history.replaceState(null, "", `#${tabId}`);
  }
}

function showTabLoader() {
  if (!tabLoader) {
    return;
  }

  clearTimeout(loadingTimer);
  tabLoader.classList.add("active");
  tabLoader.setAttribute("aria-hidden", "false");

  loadingTimer = setTimeout(() => {
    tabLoader.classList.remove("active");
    tabLoader.setAttribute("aria-hidden", "true");
  }, 430);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

tabTargets.forEach((target) => {
  target.addEventListener("click", (event) => {
    event.preventDefault();
    const nextTab = target.dataset.tabTarget;

    if (!nextTab || document.querySelector(`[data-tab-panel="${nextTab}"]`)?.classList.contains("active")) {
      return;
    }

    showTabLoader();
    setTimeout(() => setActiveTab(nextTab), 150);
  });
});

const initialTab = window.location.hash.replace("#", "");
if (initialTab && document.querySelector(`[data-tab-panel="${initialTab}"]`)) {
  setActiveTab(initialTab, false);
}

if (cuteQuote) {
  let quoteIndex = 0;

  setInterval(() => {
    quoteIndex = (quoteIndex + 1) % cuteQuotes.length;
    cuteQuote.textContent = cuteQuotes[quoteIndex];
  }, 3200);
}

copyReviewButton?.addEventListener("click", async () => {
  if (!reviewForm) {
    return;
  }

  const formData = new FormData(reviewForm);
  const name = formData.get("review-name")?.toString().trim() || "Anonymous";
  const service = formData.get("review-service")?.toString().trim() || "Commission";
  const message = formData.get("review-message")?.toString().trim() || "I loved my commission!";
  const reviewText = `Review for Kiera Virelle\nName/Venue: ${name}\nService: ${service}\nReview: ${message}`;

  try {
    await navigator.clipboard.writeText(reviewText);
    if (reviewHelper) {
      reviewHelper.textContent = "Review copied. Send it to me on Discord when you are ready.";
      reviewHelper.classList.add("copied");
    }
  } catch {
    if (reviewHelper) {
      reviewHelper.textContent = "Copy did not work here, but you can still select your review text and send it on Discord.";
      reviewHelper.classList.remove("copied");
    }
  }
});

reviewForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

portfolioImages.forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("missing");
    image.closest("[data-media-src]")?.removeAttribute("data-media-src");
  });
});

flyerFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.flyerFilter;
    let visibleCount = 0;

    flyerFilterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("active", filterButton === button);
    });

    flyerCards.forEach((card) => {
      const tags = card.dataset.flyerTags.split(" ");
      const isVisible = filter === "all" || tags.includes(filter);

      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (flyerEmptyMessage) {
      flyerEmptyMessage.hidden = visibleCount > 0;
    }
  });
});

function createBurst(x, y, className, count = 1) {
  if (reduceMotion.matches) {
    return;
  }

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    const hueClass = count === 1
      ? ["pink", "yellow", "blue"][Math.floor(Math.random() * 3)]
      : ["pink", "yellow", "blue"][index % 3];

    particle.className = `${className} ${className}-${hueClass}`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty("--dx", `${Math.random() * 70 - 35}px`);
    particle.style.setProperty("--dy", `${Math.random() * -58 - 18}px`);
    particle.style.setProperty("--turn", `${Math.random() * 180 - 90}deg`);
    document.body.append(particle);

    setTimeout(() => particle.remove(), 760);
  }
}

document.addEventListener("pointermove", (event) => {
  const now = Date.now();

  if (now - sparkleTimer < 95 || reduceMotion.matches || event.pointerType === "touch") {
    return;
  }

  sparkleTimer = now;
  createBurst(event.clientX, event.clientY, "cursor-sparkle");
});

bookingLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const rect = link.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, "booking-confetti", 14);
  });
});

function openLightbox(src, type, title) {
  if (!lightbox || !lightboxMedia || !lightboxTitle) {
    return;
  }

  lightboxMedia.replaceChildren();
  lightboxTitle.textContent = title || "Preview";

  if (type === "video") {
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    lightboxMedia.append(video);
  } else {
    const image = document.createElement("img");
    image.src = src;
    image.alt = title || "Expanded preview";
    lightboxMedia.append(image);
  }

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-active");
}

function closeLightbox() {
  if (!lightbox || !lightboxMedia) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-active");
  lightboxMedia.replaceChildren();
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-media-src]");

  if (!trigger) {
    return;
  }

  event.preventDefault();
  openLightbox(trigger.dataset.mediaSrc, trigger.dataset.mediaType, trigger.dataset.mediaTitle);
});

lightboxCloseButtons.forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

uploadInput?.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const card = document.createElement("article");
      const image = document.createElement("img");
      const title = document.createElement("h3");
      const note = document.createElement("p");

      card.className = "preview-card image-card";
      image.src = reader.result;
      image.alt = file.name;
      title.textContent = file.name.replace(/\.[^/.]+$/, "");
      note.textContent = "Local preview added from your computer.";

      card.append(image, title, note);
      uploadGallery.prepend(card);
    });

    reader.readAsDataURL(file);
  });
});
