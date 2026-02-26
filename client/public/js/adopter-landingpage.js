document.querySelectorAll(".arrow-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Navigation coming soon!");
  });
});

const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.campaign-card');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsContainer = document.querySelector('.carousel-dots');
const wrapper = document.querySelector('.carousel-wrapper');

let index = 0;
let interval;
let startX = 0;
let isDragging = false;

/* ---------- Dots ---------- */
slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');

  dot.addEventListener('click', () => {
    index = i;
    updateCarousel();
  });

  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

/* ---------- Core Update ---------- */
function updateCarousel() {
  carousel.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

/* ---------- Navigation ---------- */
function nextSlide() {
  index = (index + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

/* ---------- Auto Slide ---------- */
function startAutoSlide() {
  interval = setInterval(nextSlide, 3000);
}

function stopAutoSlide() {
  clearInterval(interval);
}

startAutoSlide();

/* ---------- Pause on Hover ---------- */
wrapper.addEventListener('mouseenter', stopAutoSlide);
wrapper.addEventListener('mouseleave', startAutoSlide);

/* ---------- Swipe Support ---------- */
wrapper.addEventListener('pointerdown', (e) => {
  startX = e.clientX;
  isDragging = true;
});

wrapper.addEventListener('pointerup', (e) => {
  if (!isDragging) return;

  const diff = e.clientX - startX;

  if (diff > 50) prevSlide();
  if (diff < -50) nextSlide();

  isDragging = false;
});

wrapper.addEventListener('pointerleave', () => {
  isDragging = false;
});