/* ===== app.js — Interactions ===== */
(function () {
    'use strict';

    /* ── Scroll-reveal with IntersectionObserver ── */
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    revealObs.unobserve(e.target);
                }
            });
        },
        { threshold: 0.15 }
    );
    reveals.forEach((el) => revealObs.observe(el));

    /* ── Navbar scroll effect ── */
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── Mobile nav toggle ── */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.setAttribute(
            'aria-expanded',
            navLinks.classList.contains('open')
        );
    });
    navLinks.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    /* ── FAQ accordion ── */
    document.querySelectorAll('.faq-item__question').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-item__answer');
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item').forEach((fi) => {
                fi.classList.remove('open');
                fi.querySelector('.faq-item__answer').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ── Smooth scroll for anchors ── */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ══════════════════════════════════════════
       Countdown Timer — June 12, 2026 at 10 PM
       ══════════════════════════════════════════ */
    const TARGET_DATE = new Date('2026-06-12T22:00:00-05:00'); // Peru time (UTC-5)

    function updateCountdown() {
        const now = new Date();
        let diff = TARGET_DATE - now;
        if (diff < 0) diff = 0;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        const pad = (n) => String(n).padStart(2, '0');
        document.getElementById('cd-days').textContent = pad(days);
        document.getElementById('cd-hours').textContent = pad(hours);
        document.getElementById('cd-mins').textContent = pad(mins);
        document.getElementById('cd-secs').textContent = pad(secs);
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* ══════════════════════════════════════════
       Prizes Carousel — Full-featured
       ══════════════════════════════════════════ */
    const carousel = document.getElementById('prizesCarousel');
    const dotsContainer = document.getElementById('prizeDots');
    const arrowLeft = document.getElementById('prizeArrowLeft');
    const arrowRight = document.getElementById('prizeArrowRight');

    if (carousel && dotsContainer) {
        const cards = carousel.querySelectorAll('.prize-card');
        const totalCards = cards.length;
        let currentIndex = 0;
        let autoplayInterval = null;

        // Generate dots dynamically
        cards.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'prizes__dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.prizes__dot');

        // Scroll to card by index
        function scrollToCard(index) {
            if (index < 0) index = totalCards - 1;
            if (index >= totalCards) index = 0;
            currentIndex = index;

            const card = cards[index];
            const carouselRect = carousel.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const scrollTarget = card.offsetLeft - (carouselRect.width / 2) + (cardRect.width / 2);

            carousel.scrollTo({
                left: scrollTarget,
                behavior: 'smooth'
            });

            updateDots(index);
        }

        // Update active dot
        function updateDots(activeIndex) {
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === activeIndex);
            });
        }

        // Detect current card from scroll position
        function detectCurrentCard() {
            const scrollLeft = carousel.scrollLeft;
            const carouselCenter = scrollLeft + carousel.offsetWidth / 2;
            let closest = 0;
            let minDist = Infinity;

            cards.forEach((card, i) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const dist = Math.abs(carouselCenter - cardCenter);
                if (dist < minDist) {
                    minDist = dist;
                    closest = i;
                }
            });

            currentIndex = closest;
            updateDots(closest);
        }

        // Arrow click handlers
        if (arrowLeft) {
            arrowLeft.addEventListener('click', () => {
                scrollToCard(currentIndex - 1);
                resetAutoplay();
            });
        }
        if (arrowRight) {
            arrowRight.addEventListener('click', () => {
                scrollToCard(currentIndex + 1);
                resetAutoplay();
            });
        }

        // Dot click handlers
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                scrollToCard(parseInt(dot.dataset.index, 10));
                resetAutoplay();
            });
        });

        // Update dots on manual scroll
        let scrollTimeout;
        carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(detectCurrentCard, 80);
        }, { passive: true });

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                scrollToCard(currentIndex + 1);
            }, 4000);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        // Pause autoplay on hover
        carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        carousel.addEventListener('mouseleave', () => startAutoplay());

        // Touch handling — pause autoplay on touch
        carousel.addEventListener('touchstart', () => clearInterval(autoplayInterval), { passive: true });
        carousel.addEventListener('touchend', () => startAutoplay(), { passive: true });

        // Start autoplay
        startAutoplay();
    }

})();
