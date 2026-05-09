/* ===== particles.js — Lightweight gold confetti canvas ===== */
(function () {
    'use strict';

    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    const PARTICLE_COUNT = 50;
    const particles = [];

    const COLORS = [
        'rgba(212, 175, 55, 0.6)',  // gold
        'rgba(232, 204, 106, 0.5)', // gold-light
        'rgba(255, 251, 235, 0.3)', // beige
        'rgba(212, 175, 55, 0.35)', // gold dim
    ];

    function resize() {
        const hero = canvas.parentElement;
        W = canvas.width = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
    }

    function Particle() {
        this.reset();
    }

    Particle.prototype.reset = function () {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 3 + 1;
        this.dx = (Math.random() - 0.5) * 0.2;
        this.dy = -(Math.random() * 0.3 + 0.08);
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
        this.life = Math.random() * 600 + 300;
        this.age = 0;
    };

    Particle.prototype.update = function () {
        this.x += this.dx;
        this.y += this.dy;
        this.age++;
        if (this.age > this.life || this.y < -10 || this.x < -10 || this.x > W + 10) {
            this.reset();
            this.y = H + 10;
        }
    };

    Particle.prototype.draw = function () {
        const fadeFactor = 1 - this.age / this.life;
        ctx.globalAlpha = this.opacity * fadeFactor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    function init() {
        resize();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(function (p) {
            p.update();
            p.draw();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
})();
