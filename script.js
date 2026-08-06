// ===== Preloader =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1200);
});

// ===== Navbar Scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Nav Burger =====
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section');
const navLinksAll = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== Reveal Animations (Intersection Observer) =====
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-text');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== Animated Counter =====
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            let count = 0;
            const increment = target / 40;
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    entry.target.textContent = Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    entry.target.textContent = target;
                }
            };
            updateCount();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ===== Particle Canvas Background =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationParticles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        const colors = ['#ff3d7f', '#3d8bff', '#ffd93d', '#9b3dff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
    }
}

for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== Gallery Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

const categoryLabels = {
    'clip-studio-paint': 'Clip Studio Paint',
    'opentoonz': 'OpenToonz',
    'speedpaint': 'Speedpaint',
    'fan-art': 'Fan Art',
    'graphic-design': 'Graphic Design'
};

galleryItems.forEach(item => {
    const cat = item.dataset.category;
    if (cat && categoryLabels[cat]) {
        const overlay = item.querySelector('.item-overlay');
        const badge = document.createElement('span');
        badge.className = 'item-category';
        badge.textContent = categoryLabels[cat];
        overlay.appendChild(badge);
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'none';
                setTimeout(() => {
                    item.style.animation = 'fadeIn 0.4s ease forwards';
                }, 10);
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ===== Gallery Video Hover Play =====
galleryItems.forEach(item => {
    const video = item.querySelector('video');
    if (video) {
        item.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
        });
        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }
});

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lbCurrent = document.getElementById('lbCurrent');
const lbTotal = document.getElementById('lbTotal');

const galleryData = [];
galleryItems.forEach(item => {
    const video = item.querySelector('video');
    const img = item.querySelector('img');
    if (video) {
        galleryData.push({ type: 'video', src: video.src, label: item.querySelector('.item-label').textContent });
    } else if (img) {
        galleryData.push({ type: 'image', src: img.src, label: item.querySelector('.item-label').textContent });
    }
});

lbTotal.textContent = galleryData.length;

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxContent.innerHTML = '';
}

function updateLightbox() {
    const item = galleryData[currentIndex];
    lightboxContent.innerHTML = '';
    if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        lightboxContent.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.label;
        lightboxContent.appendChild(img);
    }
    lbCurrent.textContent = currentIndex + 1;
}

function navLightbox(dir) {
    currentIndex += dir;
    if (currentIndex < 0) currentIndex = galleryData.length - 1;
    if (currentIndex >= galleryData.length) currentIndex = 0;
    updateLightbox();
}

galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navLightbox(-1));
lightboxNext.addEventListener('click', () => navLightbox(1));
document.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
});

// ===== Parallax Hero Shapes =====
const heroShapes = document.querySelectorAll('.shape');
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    heroShapes.forEach((shape, i) => {
        const intensity = (i + 1) * 15;
        shape.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
    });
});

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPos = target.offsetTop - offset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});

// ===== Tilt Effect on Cards =====
document.querySelectorAll('.about-card, .tool-card, .team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});
