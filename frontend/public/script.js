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

// === Remplacer les icônes emoji par des SVG et peupler les prix dynamiquement ===
(() => {
  const priceMap = {
    'Paris': { hotel: '70$', plane: '150$' },
    'St Petersburg': { hotel: '65$', plane: '140$' },
    'Prague': { hotel: '55$', plane: '120$' },
    'Amsterdam': { hotel: '60$', plane: '130$' },
    // valeurs par défaut si la ville n'est pas listée
    'default': { hotel: '70$', plane: '150$' }
  };

  // Helper : créer un <svg><use ...></use></svg>
  function makeUse(id, size = 44) {
    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('class', 'offer-icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(svgns, 'use');
    // prefer href when supported, fall back to xlink:href for older browsers
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`);
    svg.appendChild(use);
    return svg;
  }

  // Parcourir toutes les cartes
  document.querySelectorAll('.card-ruban-variant').forEach(card => {
    const cityEl = card.querySelector('.card-ruban-variant-text');
    const city = cityEl ? cityEl.textContent.trim() : '';
    const prices = priceMap[city] || priceMap['default'];

    // Remplacer les icônes (left/right) si présents
    const leftIconSpan = card.querySelector('.offer-block.offer-left .offer-icon');
    const rightIconSpan = card.querySelector('.offer-block.offer-right .offer-icon');

    if (leftIconSpan) {
      const svg = makeUse('icon-hotel', 44);
      leftIconSpan.replaceWith(svg);
    }
    if (rightIconSpan) {
      const svg = makeUse('icon-plane', 44);
      rightIconSpan.replaceWith(svg);
    }

    // Appliquer les prix dynamiques
    const leftPriceEl = card.querySelector('.offer-block.offer-left .offer-price');
    const rightPriceEl = card.querySelector('.offer-block.offer-right .offer-price');
    if (leftPriceEl) leftPriceEl.textContent = prices.hotel;
    if (rightPriceEl) rightPriceEl.textContent = prices.plane;

    // Accessibility improvements:
    // - announce price updates to assistive tech
    // - ensure the offer control has a descriptive aria-label and keyboard semantics
    try {
      if (leftPriceEl) {
        leftPriceEl.setAttribute('aria-live', 'polite');
        leftPriceEl.setAttribute('aria-atomic', 'true');
      }
      if (rightPriceEl) {
        rightPriceEl.setAttribute('aria-live', 'polite');
        rightPriceEl.setAttribute('aria-atomic', 'true');
      }

      const btn = card.querySelector('.card-ruban-variant-wide-btn');
      if (btn) {
        // Ensure it's a button control (if it's a <button> element this is a no-op)
        try { btn.type = btn.type || 'button'; } catch (e) { /* not a <button>, ignore */ }

        const destName = city || 'cette destination';
        const hotelLabel = prices.hotel || '';
        const planeLabel = prices.plane || '';
        const ariaLabel = `Voir l'offre pour ${destName} — hôtel dès ${hotelLabel}, vol dès ${planeLabel}`;
        btn.setAttribute('aria-label', ariaLabel);
      }
    } catch (err) {
      // If something goes wrong with ARIA assignment, don't break the page
      console.warn('Accessibility attributes assignment failed', err);
    }
  });

})();

