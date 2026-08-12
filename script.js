const scrollMeter = document.querySelector(".scroll-meter");
const revealItems = document.querySelectorAll("[data-reveal]");

function isInitiallyVisible(item) {
  const rect = item.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.96;
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => {
    if (isInitiallyVisible(item)) {
      item.classList.add("is-visible");
    } else {
      revealObserver.observe(item);
    }
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function updateScrollUi() {
  if (!scrollMeter) {
    return;
  }

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollMeter.style.width = `${progress * 100}%`;
}

function setupProcessCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const slides = Array.from(
      carousel.querySelectorAll(".carousel-frame img, .carousel-frame video, [data-carousel-slide]")
    );
    const previous = carousel.querySelector("[data-carousel-previous]");
    const next = carousel.querySelector("[data-carousel-next]");

    if (!slides.length) {
      previous?.setAttribute("hidden", "");
      next?.setAttribute("hidden", "");
      return;
    }

    let activeIndex = Math.max(
      0,
      slides.findIndex((slide) => slide.classList.contains("is-active"))
    );

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
        if (slideIndex !== activeIndex && slide.tagName === "VIDEO") {
          slide.pause();
        }
      });
    }

    previous?.addEventListener("click", () => showSlide(activeIndex - 1));
    next?.addEventListener("click", () => showSlide(activeIndex + 1));
    showSlide(activeIndex);
  });
}

window.addEventListener("scroll", updateScrollUi, { passive: true });
window.addEventListener("resize", updateScrollUi);

updateScrollUi();
setupProcessCarousels();
