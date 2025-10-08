console.log('script chargé');

window.addEventListener('load', () => {
  const carousel = document.querySelector('.carousel-container');
  const imgs = carousel.querySelectorAll('img');
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  const viewport = document.querySelector('.viewport');

  if (!carousel || imgs.length === 0) {
    console.error('Carousel introuvable ou pas d\'images');
    return;
  }

  let index = 0;
  const total = imgs.length;

  // calcule la largeur visible (responsive)
  function slideWidth() {
    return viewport.clientWidth;
  }

  function moveTo(i) {
    const w = slideWidth();
    carousel.style.transform = `translateX(-${i * w}px)`;
  }

  function moveRight() {
    index = (index + 1) % total;
    moveTo(index);
    console.log('droite →', index);
  }

  function moveLeft() {
    index = (index - 1 + total) % total;
    moveTo(index);
    console.log('gauche →', index);
  }

  // listeners
  rightBtn.addEventListener('click', moveRight);
  leftBtn.addEventListener('click', moveLeft);

  // recalculer la position au redimensionnement
  window.addEventListener('resize', () => moveTo(index));

  // auto-scroll optionnel (3s) + pause au survol
  let interval = setInterval(moveRight, 3000);
  viewport.addEventListener('mouseenter', () => clearInterval(interval));
  viewport.addEventListener('mouseleave', () => { interval = setInterval(moveRight, 3000); });

  // init position
  moveTo(0);
});