/* ================================
   Birthday Website JavaScript
   OPTIMIZED VERSION
   ================================ */

// DOM Elements
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
const musicText = musicBtn.querySelector('.music-text');
const particlesCanvas = document.getElementById('particles');
const ctx = particlesCanvas.getContext('2d');

// State
let isPlaying = false;
let particles = [];
let animationId;

// ================================
// Music Control
// ================================
function initMusic() {
    bgMusic.volume = 0.1;
    document.addEventListener('click', handleFirstClick, { once: true });
    musicBtn.addEventListener('click', toggleMusic);
}

function handleFirstClick(e) {
    if (e.target.closest('.music-control')) return;
    playMusic();
}

function toggleMusic(e) {
    e.stopPropagation();
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicText.textContent = 'Pause';
    }).catch(() => {
        console.log('Audio playback failed - user interaction required');
    });
}

function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicText.textContent = 'Play Music';
}

// ================================
// OPTIMIZED Particle System
// Reduced particle count for better performance
// ================================
function initParticles() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Reduced particle count from 50 to 20 for better performance
    for (let i = 0; i < 20; i++) {
        particles.push(createParticle());
    }

    animateParticles();
}

function resizeCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
}

function createParticle() {
    const types = ['heart', 'confetti'];
    const type = types[Math.floor(Math.random() * types.length)];
    const colors = ['#FF69B4', '#FF1493', '#FFD700', '#FF6B9D', '#E8A0BF'];

    return {
        x: Math.random() * particlesCanvas.width,
        y: Math.random() * particlesCanvas.height + particlesCanvas.height,
        size: Math.random() * 12 + 4,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: Math.random() * 1.5 - 0.75,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 1.5 - 0.75,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: type,
        opacity: Math.random() * 0.6 + 0.3,
        wobble: Math.random() * Math.PI * 2
    };
}

function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;

    if (p.type === 'heart') {
        drawHeart(p.size, p.color);
    } else {
        drawConfetti(p.size, p.color);
    }

    ctx.restore();
}

function drawHeart(size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const s = size / 2;
    ctx.moveTo(0, s / 2);
    ctx.bezierCurveTo(-s, -s / 2, -s, -s, 0, -s);
    ctx.bezierCurveTo(s, -s, s, -s / 2, 0, s / 2);
    ctx.fill();
}

function drawConfetti(size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(-size / 2, -size / 4, size, size / 2);
}

function updateParticle(p) {
    p.y -= p.speedY;
    p.x += p.speedX + Math.sin(p.wobble) * 0.3;
    p.rotation += p.rotationSpeed;
    p.wobble += 0.015;

    if (p.y < -50) {
        p.y = particlesCanvas.height + 50;
        p.x = Math.random() * particlesCanvas.width;
    }

    if (p.x < -50) p.x = particlesCanvas.width + 50;
    if (p.x > particlesCanvas.width + 50) p.x = -50;
}

function animateParticles() {
    ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

    particles.forEach(p => {
        updateParticle(p);
        drawParticle(p);
    });

    animationId = requestAnimationFrame(animateParticles);
}

// ================================
// OPTIMIZED Scroll Animations
// ================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // Unobserve after animation to save resources
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ================================
// Smooth Scroll
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================================
// Initialize Everything
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initMusic();
    initParticles();
    initScrollAnimations();
    initSmoothScroll();

    console.log('%c💕 Happy Birthday! 💕', 'font-size: 24px; color: #FF69B4; font-weight: bold;');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
