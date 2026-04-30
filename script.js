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

function setActiveTab(tabId, updateHash = true) {
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

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

tabTargets.forEach((target) => {
  target.addEventListener("click", (event) => {
    event.preventDefault();
    setActiveTab(target.dataset.tabTarget);
  });
});

const initialTab = window.location.hash.replace("#", "");
if (initialTab && document.querySelector(`[data-tab-panel="${initialTab}"]`)) {
  setActiveTab(initialTab, false);
}

portfolioImages.forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("missing");
    image.closest("[data-media-src]")?.removeAttribute("data-media-src");
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
