const guideTabs = Array.from(document.querySelectorAll(".tab"));
const guidePanels = Array.from(document.querySelectorAll(".guide-panel"));
const roomTabs = Array.from(document.querySelectorAll(".room-tab"));
const roomPanels = Array.from(document.querySelectorAll(".room-panel"));
const roomSlides = Array.from(document.querySelectorAll("[data-room-slide]"));
const roomDotsWrap = document.querySelector(".room-dots");
const roomPrev = document.querySelector("[data-room-prev]");
const roomNext = document.querySelector("[data-room-next]");
const toast = document.querySelector(".toast");
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileOverlay = document.querySelector(".mobile-nav-overlay");

guideTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.guide;
    guideTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    guidePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === target);
    });
  });
});

roomTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.room;
    roomTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    roomPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.roomPanel === target);
    });
  });
});

if (roomSlides.length && roomDotsWrap) {
  let activeRoomSlide = roomSlides.findIndex((slide) => slide.classList.contains("active"));
  if (activeRoomSlide < 0) activeRoomSlide = 0;

  const dots = roomSlides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "room-dot";
    dot.setAttribute("aria-label", `查看房间主题 ${index + 1}`);
    dot.addEventListener("click", () => {
      showRoomSlide(index);
      restartRoomTimer();
    });
    roomDotsWrap.appendChild(dot);
    return dot;
  });

  const showRoomSlide = (index) => {
    activeRoomSlide = (index + roomSlides.length) % roomSlides.length;
    roomSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeRoomSlide);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeRoomSlide);
      dot.setAttribute("aria-current", dotIndex === activeRoomSlide ? "true" : "false");
    });
  };

  const nextRoomSlide = () => showRoomSlide(activeRoomSlide + 1);
  const prevRoomSlide = () => showRoomSlide(activeRoomSlide - 1);

  let roomTimer = window.setInterval(nextRoomSlide, 4800);
  const restartRoomTimer = () => {
    window.clearInterval(roomTimer);
    roomTimer = window.setInterval(nextRoomSlide, 4800);
  };

  roomNext?.addEventListener("click", () => {
    nextRoomSlide();
    restartRoomTimer();
  });

  roomPrev?.addEventListener("click", () => {
    prevRoomSlide();
    restartRoomTimer();
  });

  showRoomSlide(activeRoomSlide);
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast("已复制管家微信 / 电话");
    } catch {
      showToast(value);
    }
  });
});

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

if (header) {
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true }
  );
}

if (menuToggle && mobileOverlay) {
  const closeMenu = () => {
    menuToggle.classList.remove("open");
    mobileOverlay.classList.remove("open");
    mobileOverlay.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  menuToggle.addEventListener("click", () => {
    const open = !menuToggle.classList.contains("open");
    menuToggle.classList.toggle("open", open);
    mobileOverlay.classList.toggle("open", open);
    mobileOverlay.setAttribute("aria-hidden", String(!open));
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  mobileOverlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}
