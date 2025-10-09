window.addEventListener('load', () => {
  const images = document.querySelectorAll('.carousel-container img');
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  const dots = document.querySelectorAll('.dot');
  let index = 0;
  let interval;

  function showSlide(i) {
    images.forEach((img, idx) => {
      img.classList.toggle('active', idx === i);
      dots[idx].classList.toggle('active', idx === i);
    });
    index = i;
  }

  function nextSlide() {
    showSlide((index + 1) % images.length);
  }

  function prevSlide() {
    showSlide((index - 1 + images.length) % images.length);
  }

  rightBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  leftBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      resetInterval();
    });
  });

  function startInterval() {
    interval = setInterval(nextSlide, 4000);
  }

  function resetInterval() {
    clearInterval(interval);
    startInterval();
  }

  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(interval));
  carousel.addEventListener('mouseleave', startInterval);

  showSlide(0);
  startInterval();
});

// === Gestion du sélecteur "Qui ?" ===
const guestInput = document.getElementById('guests-summary');
const popup = document.querySelector('.guest-popup');
const closePopupBtn = document.querySelector('.close-popup');
const counts = {
  rooms: 1,
  adults: 2,
  children: 0
};

// Ouvrir/fermer le popup
guestInput.addEventListener('click', () => {
  popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
});

closePopupBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  updateGuestSummary();
});

// Boutons + et -
popup.addEventListener('click', (e) => {
  if (e.target.classList.contains('plus') || e.target.classList.contains('minus')) {
    const type = e.target.parentElement.querySelector('.count').dataset.type;
    if (e.target.classList.contains('plus')) counts[type]++;
    else counts[type] = Math.max(0, counts[type] - 1);

    // Empêcher les valeurs incohérentes
    if (type === 'adults' && counts.adults < 1) counts.adults = 1;
    if (type === 'rooms' && counts.rooms < 1) counts.rooms = 1;

    e.target.parentElement.querySelector('.count').textContent = counts[type];
    updateGuestSummary();
  }
});

function updateGuestSummary() {
  guestInput.value = `${counts.rooms} chambre${counts.rooms > 1 ? 's' : ''}, `
    + `${counts.adults} adulte${counts.adults > 1 ? 's' : ''}, `
    + `${counts.children} enfant${counts.children > 1 ? 's' : ''}`;
}

// Fermer si clic en dehors
document.addEventListener('click', (e) => {
  if (!popup.contains(e.target) && e.target !== guestInput) {
    popup.style.display = 'none';
  }
});
