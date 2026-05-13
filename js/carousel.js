/**
 * LUXARA JOYERIA - CAROUSEL
 * Auto-sliding con navegacion manual (flechas + dots)
 */

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;

  const slidesContainer = document.getElementById("carouselSlides");
  const slides = slidesContainer.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  if (slides.length === 0) return;

  let current = 0;
  let autoTimer = null;
  const INTERVAL = 5000;

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    slides[current]?.classList.remove("active");
    current = index;
    slidesContainer.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
    slides[current]?.classList.add("active");
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Arrows
  if (nextBtn) nextBtn.addEventListener("click", () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); startAuto(); });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      goTo(parseInt(dot.dataset.slide, 10));
      startAuto();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    startAuto();
  }, { passive: true });

  // Pause on hover
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  // Init
  goTo(0);
  startAuto();
});
