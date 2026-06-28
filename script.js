// ============================================
// 🚀 Лев / WEB-DEV — Интерактивность
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---------- 🔹 Частицы (Particles) ----------
    class Particles {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: null, y: null, radius: 150 };

            this.resize();
            this.init();
            this.animate();
            this.bindEvents();
        }

        resize() {
            const docHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight
            );
            this.canvas.width = window.innerWidth;
            this.canvas.height = Math.max(window.innerHeight, docHeight);
        }

        init() {
            const particleCount = Math.min(
                Math.floor((this.canvas.width * this.canvas.height) / 15000),
                120
            );
            this.particles = [];
            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 2.5,
                    vy: (Math.random() - 0.5) * 2.5,
                    radius: Math.random() * 2.5 + 1,
                    alpha: Math.random() * 0.5 + 0.25,
                    colorType: Math.floor(Math.random() * 2), // 0=purple, 1=cyan
                });
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => this.resize());
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            this.canvas.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];

                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = this.mouse.x - p.x;
                    const dy = this.mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this.mouse.radius) {
                        const force = (this.mouse.radius - dist) / this.mouse.radius;
                        p.vx -= (dx / dist) * force * 0.15;
                        p.vy -= (dy / dist) * force * 0.15;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;

                // Keep speed constant — clamp velocity magnitude
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 3) {
                    p.vx = (p.vx / speed) * 3;
                    p.vy = (p.vy / speed) * 3;
                } else if (speed < 0.8) {
                    p.vx = (p.vx / speed) * 0.8 || (Math.random() - 0.5) * 2;
                    p.vy = (p.vy / speed) * 0.8 || (Math.random() - 0.5) * 2;
                }

                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

                if (p.colorType === 0) {
                    // Purple
                    this.ctx.shadowColor = 'rgba(124, 92, 252, 0.6)';
                    this.ctx.shadowBlur = 14;
                    this.ctx.fillStyle = `rgba(124, 92, 252, ${p.alpha})`;
                } else {
                    // Cyan / Blue
                    this.ctx.shadowColor = 'rgba(92, 214, 255, 0.6)';
                    this.ctx.shadowBlur = 14;
                    this.ctx.fillStyle = `rgba(92, 214, 255, ${p.alpha})`;
                }

                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }

            this.drawConnections();
            requestAnimationFrame(() => this.animate());
        }

        drawConnections() {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 160) {
                        const alpha = (1 - dist / 160) * 0.12;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        const p1 = this.particles[i];
                        const p2 = this.particles[j];
                        const isCyanLink = p1.colorType === 1 || p2.colorType === 1;
                        const linkColor = isCyanLink
                            ? `rgba(92, 214, 255, ${alpha * 0.4})`
                            : `rgba(124, 92, 252, ${alpha * 0.4})`;
                        this.ctx.strokeStyle = linkColor;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            }
        }
    }

    new Particles('particles-canvas');

    // ---------- 🔹 Hero Typing Effect ----------
    const typingEl = document.getElementById('heroTyping');
    const cursorEl = document.querySelector('.hero-cursor');
    if (typingEl) {
        const path = window.location.pathname;
        const lines = path.includes('/en/') || path.endsWith('/en') ? [
            'I\'ll create a website,',
            '<span class="gradient-text">that brings you clients</span>'
        ] : path.includes('/sr/') || path.endsWith('/sr') ? [
            'Stvoriću sajt,',
            '<span class="gradient-text">koji donosi klijente</span>'
        ] : [
            'Создам сайт,',
            '<span class="gradient-text">который приносит клиентов</span>'
        ];
        let lineIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeLine() {
            const currentLine = lines[lineIdx];
            // Strip HTML for length calculation
            const plainText = currentLine.replace(/<[^>]*>/g, '');
            
            if (!isDeleting) {
                charIdx++;
                const visibleChars = plainText.substring(0, charIdx);
                // Rebuild with HTML for the gradient line
                if (lineIdx === 1) {
                    typingEl.innerHTML = lines[0] + '<br />' + visibleChars;
                } else {
                    typingEl.innerHTML = visibleChars;
                }

                if (charIdx >= plainText.length) {
                    if (lineIdx < lines.length - 1) {
                        // Wait then go to next line
                        setTimeout(() => {
                            lineIdx++;
                            charIdx = 0;
                            typeLine();
                        }, 600);
                        return;
                    } else {
                        // Done - show full text
                        typingEl.innerHTML = lines.join('<br />');
                        if (cursorEl) cursorEl.style.display = 'none';
                        return;
                    }
                }
                setTimeout(typeLine, 40 + Math.random() * 30);
            }
        }

        // Start after a short delay
        setTimeout(typeLine, 500);
    }

    // ---------- 🔹 Header Scroll ----------
    const header = document.getElementById('header');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const isScrolled = scrollY > 60;
        const scrollingDown = scrollY > lastScroll && scrollY > 80;

        // Add/remove scrolled state
        header.classList.toggle('scrolled', isScrolled);

        // Auto-hide header on scroll down, show on scroll up
        header.classList.toggle('hidden', scrollingDown);

        lastScroll = scrollY;
    });

    // ---------- 🔹 Burger Menu ----------
    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('open');
        });

        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('open');
            });
        });
    }

    // ---------- 🔹 Active Nav Link ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 130;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ---------- 🔹 Scroll Reveal ----------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- 🔹 FAQ Accordion ----------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(i => i.classList.remove('open'));

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // ---------- 🔹 Contact Form ----------
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !message) {
                showToast('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = original;
                btn.disabled = false;
                form.reset();
                showToast('Спасибо! Я свяжусь с вами в ближайшее время 🚀', 'success');
            }, 1500);
        });
    }

    // ---------- 🔹 Toast ----------
    function showToast(text, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = text;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ---------- 🔹 Smooth Fade-in ----------
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // ---------- 🔹 Testimonials Toggle ----------
    const toggleBtn = document.getElementById('testimonialToggle');
    const formWrap = document.getElementById('testimonialFormWrap');
    if (toggleBtn && formWrap) {
        toggleBtn.addEventListener('click', () => {
            formWrap.classList.toggle('open');
            toggleBtn.classList.toggle('open');
        });
    }

    // ---------- 🔹 3D Carousel with Drag ----------
    const carousel = document.getElementById('carousel3d');
    let cards = carousel ? Array.from(carousel.querySelectorAll('.carousel-card')) : [];
    let cardCount = cards.length;
    let currentAngle = 0;
    let targetAngle = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartAngle = 0;
    const radius = window.innerWidth < 768 ? 80 : 850;

    function getCardPosition(i) {
        const a = (currentAngle + i * (360 / cardCount)) * Math.PI / 180;
        const x = Math.sin(a) * radius;
        const z = Math.cos(a) * radius - radius;
        const normZ = (z + radius) / (radius * 2);
        return { x, z, scale: 0.7 + normZ * 0.5, opacity: 0.5 + normZ * 0.5 };
    }

    function updateCarousel() {
        currentAngle += (targetAngle - currentAngle) * 0.08;
        cards.forEach((card, i) => {
            const p = getCardPosition(i);
            card.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
            card.style.transform = 'translateX(' + p.x + 'px) translateZ(' + p.z + 'px) scale(' + p.scale + ')';
            card.style.opacity = p.opacity;
            card.style.zIndex = Math.round(p.z + radius);
        });
    }

    function autoRotate() {
        if (!isDragging) targetAngle += 0.3;
        updateCarousel();
        requestAnimationFrame(autoRotate);
    }

    // Drag with mouse
    carousel.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    // Drag with touch (mobile)
    carousel.addEventListener('touchstart', function(e) {
        startDrag({ clientX: e.touches[0].clientX });
    }, { passive: true });
    window.addEventListener('touchmove', function(e) {
        moveDrag({ clientX: e.touches[0].clientX });
    }, { passive: true });
    window.addEventListener('touchend', endDrag, { passive: true });

    function startDrag(e) {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartAngle = targetAngle;
        carousel.style.cursor = 'grabbing';
        cards.forEach(c => {
            c.style.transition = 'transform 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease';
            c.style.boxShadow = '';
            c.style.borderColor = '';
            c.style.zIndex = '';
            c.style.opacity = '';
        });
    }

    function moveDrag(e) {
        if (!isDragging) return;
        targetAngle = dragStartAngle + (e.clientX - dragStartX) * 0.3;
    }

    function endDrag() {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = '';
        }
    }

    if (carousel && cardCount > 0) {
        updateCarousel();
        autoRotate();
    }

    // ---------- 🔹 Testimonials Form ----------
    const testimonialForm = document.getElementById('testimonialForm');

    function getSelectedRating() {
        const radios = document.querySelectorAll('.star-rating input[name="rating"]');
        for (const r of radios) {
            if (r.checked) return parseInt(r.value);
        }
        return 5;
    }

    let reviewIdCounter = 4;

    function addCarouselCard(name, text, rating, save) {
        const firstLetter = name.charAt(0).toUpperCase();
        const stars = '★'.repeat(rating || 5) + '☆'.repeat(5 - (rating || 5));
        const div = document.createElement('div');
        div.className = 'testimonial-card carousel-card';
        const id = 'review-' + (save ? reviewIdCounter++ : 'saved-' + Date.now());
        div.setAttribute('data-id', id);
        div.innerHTML = '<div class="testimonial-stars">' + stars + '</div><p class="testimonial-text">"' + text + '"</p><div class="testimonial-author"><div class="testimonial-avatar">' + firstLetter + '</div><div class="testimonial-info"><span class="testimonial-name">' + name + '</span></div></div>';
        carousel.appendChild(div);
        cards = Array.from(carousel.querySelectorAll('.carousel-card'));
        cardCount = cards.length;
        if (save) {
            const saved = JSON.parse(localStorage.getItem('reviews') || '[]');
            saved.push({ name: name, text: text, rating: rating });
            localStorage.setItem('reviews', JSON.stringify(saved));
        }
    }

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reviewName').value.trim();
            const text = document.getElementById('reviewText').value.trim();
            const rating = getSelectedRating();
            if (!name || !text) return;
            addCarouselCard(name, text, rating, true);
            testimonialForm.reset();
            formWrap.classList.remove('open');
            toggleBtn.classList.remove('open');
        });
    }

    // Clear saved reviews if ?clear_reviews in URL
    if (window.location.search.includes('clear_reviews')) {
        localStorage.removeItem('reviews');
        console.log('🧹 Reviews cleared');
    }

    // Load saved reviews from localStorage
    const saved = JSON.parse(localStorage.getItem('reviews') || '[]');
    saved.forEach(function(r) { addCarouselCard(r.name, r.text, r.rating, false); });

    // ---------- 🔹 Cookie Consent ----------
    var cookieBar = document.getElementById('cookieBar');
    var cookieBtn = document.getElementById('cookieAccept');
    if (cookieBar && cookieBtn) {
        try {
            if (window.location.search.indexOf('clear_cookie') !== -1) {
                localStorage.removeItem('cookieConsent');
            }
            var consented = localStorage.getItem('cookieConsent');
        } catch(e) {
            var consented = null;
        }
        if (!consented) {
            cookieBar.style.position = 'fixed';
            cookieBar.style.bottom = '24px';
            cookieBar.style.right = '24px';
            cookieBar.style.zIndex = '99999';
            cookieBar.style.display = 'flex';
        }
        cookieBtn.addEventListener('click', function() {
            try { localStorage.setItem('cookieConsent', 'true'); } catch(e) {}
            cookieBar.style.display = 'none';
        });
    }

    console.log('🚀 Лев / WEB-DEV — Сайты, которые приносят клиентов');
});
