document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initGuestSelector();
});

/**
 * Gestion du Carrousel d'images
 */
function initCarousel() {
    const images = document.querySelectorAll('.carousel-container img');
    const dots = document.querySelectorAll('.dot');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    let currentIndex = 0;
    let autoPlayInterval;

    // Fonction pour afficher une slide spécifique
    function showSlide(index) {
        // Boucle infini : gestion des limites
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;

        currentIndex = index;

        // Mise à jour des classes active
        images.forEach((img, i) => img.classList.toggle('active', i === currentIndex));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    // Navigation
    const next = () => showSlide(currentIndex + 1);
    const prev = () => showSlide(currentIndex - 1);

    if(rightBtn) rightBtn.addEventListener('click', () => { next(); resetTimer(); });
    if(leftBtn) leftBtn.addEventListener('click', () => { prev(); resetTimer(); });

    // Navigation via les points
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    // Lecture automatique
    function startTimer() {
        autoPlayInterval = setInterval(next, 5000);
    }
    function resetTimer() {
        clearInterval(autoPlayInterval);
        startTimer();
    }

    // Pause au survol de la souris
    const carousel = document.querySelector('.carousel');
    if(carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.addEventListener('mouseleave', startTimer);
    }

    startTimer();
}

/**
 * Gestion du sélecteur de voyageurs (Popup)
 */
function initGuestSelector() {
    const summaryInput = document.getElementById('guests-summary');
    const popup = document.getElementById('guest-popup');
    const closeBtn = document.querySelector('.close-popup');
    
    if (!summaryInput || !popup) return;

    // État local
    const counts = {
        adults: 2,
        children: 0
    };

    // Toggle affichage
    summaryInput.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche la fermeture immédiate
        popup.classList.toggle('show');
        // Gestion de l'accessibilité
        const isExpanded = popup.classList.contains('show');
        summaryInput.setAttribute('aria-expanded', isExpanded);
    });

    // Fermer le popup
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('show');
            summaryInput.setAttribute('aria-expanded', 'false');
        });
    }

    // Fermer si clic en dehors
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && e.target !== summaryInput) {
            popup.classList.remove('show');
            summaryInput.setAttribute('aria-expanded', 'false');
        }
    });

    // Gestion des compteurs (+ / -)
    popup.addEventListener('click', (e) => {
        if (e.target.classList.contains('plus') || e.target.classList.contains('minus')) {
            const counterDiv = e.target.closest('.counter');
            const countSpan = counterDiv.querySelector('.count');
            const type = countSpan.dataset.type;
            let val = parseInt(countSpan.textContent);

            if (e.target.classList.contains('plus')) {
                val++;
            } else {
                val = Math.max(0, val - 1); // Minimum 0
                if (type === 'adults') val = Math.max(1, val); // Minimum 1 adulte
            }

            // Mise à jour visuelle et état
            countSpan.textContent = val;
            counts[type] = val;
            updateSummaryText();
        }
    });

    function updateSummaryText() {
        const text = `${counts.adults} adulte${counts.adults > 1 ? 's' : ''}, ${counts.children} enfant${counts.children > 1 ? 's' : ''}`;
        summaryInput.value = text;
    }
}