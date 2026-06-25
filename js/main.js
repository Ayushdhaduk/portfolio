document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initTypingEffect();
    initProjectFilters();
    initContactForm();
    initTechStack();
    initAchievementsShowcase();
    initHeroGatewayAnimation();
    initSkillsToggle();
    initBackToTop();
});

/* 1. Theme Management (Dark/Light Mode) */
function initTheme() {
    const themeToggleBtns = document.querySelectorAll('.btn-theme-toggle');
    if (!themeToggleBtns.length) return;

    const htmlEl = document.documentElement;

    // Get theme from local storage or system preferences
    const savedTheme = localStorage.getItem('portfolio-theme');
    const currentTheme = savedTheme || 'light';

    // Apply active theme
    setTheme(currentTheme);

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTheme = htmlEl.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            setTheme(targetTheme);
        });
    });

    function setTheme(theme) {
    htmlEl.setAttribute('data-bs-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    // NEW: sync browser UI color with theme
    const metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#0B0F19' : '#ffffff');
    }

    themeToggleBtns.forEach(btn => {
        const darkIcon = btn.querySelector('.theme-icon-dark, .mobile-theme-icon-dark');
        const lightIcon = btn.querySelector('.theme-icon-light, .mobile-theme-icon-light');
        if (theme === 'dark') {
            if (darkIcon) darkIcon.classList.remove('d-none');
            if (lightIcon) lightIcon.classList.add('d-none');
        } else {
            if (darkIcon) darkIcon.classList.add('d-none');
            if (lightIcon) lightIcon.classList.remove('d-none');
        }
    });
}
}

/* 2. Navbar Styling, Scroll Progress & Scrollspy */
function initNavbarScroll() {
    const navbar = document.querySelector('.custom-navbar');
    const progressIndicator = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.custom-navbar .nav-link, .overlay-nav-link');
    
    if (!navbar) return;

    let scrollTicking = false;

    function handleScroll() {
        const scrollY = window.scrollY;

        // 2a. Shrink Navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 2b. Update Scroll Progress Bar
        if (progressIndicator) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            progressIndicator.style.width = scrollPercent + '%';
        }

        // 2c. Scrollspy Section Highlighting
        let activeSectionId = '';
        const scrollPosition = scrollY + 180; // Offset for navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                activeSectionId = sectionId;
            }
        });

        // Default back to Hero if scrolled to the top
        if (scrollY < 100) {
            activeSectionId = 'hero';
        }

        if (activeSectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${activeSectionId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(handleScroll);
            scrollTicking = true;
        }
    }, { passive: true });

    // Handle initial state on load
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
}

/* 2.5 Mobile Full-Screen Overlay Menu */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('overlay-close');
    const menuOverlay = document.getElementById('mobile-overlay-menu');
    const overlayLinks = document.querySelectorAll('.overlay-nav-link');

    if (!toggleBtn || !menuOverlay) return;

    // Hover-to-open (only for devices with real mouse, not touch)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let hoverCloseTimer;
        toggleBtn.addEventListener('mouseenter', () => {
            clearTimeout(hoverCloseTimer);
            openMenu();
        });
        toggleBtn.addEventListener('mouseleave', () => {
            hoverCloseTimer = setTimeout(() => {
                if (!menuOverlay.matches(':hover')) closeMenu();
            }, 350);
        });
        menuOverlay.addEventListener('mouseleave', () => {
            hoverCloseTimer = setTimeout(closeMenu, 350);
        });
    }

    toggleBtn.addEventListener('click', () => {
        const isOpen = menuOverlay.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on any link
    overlayLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    function openMenu() {
        menuOverlay.classList.add('open');
        toggleBtn.classList.add('open');
        document.body.style.overflow = 'hidden'; // Disable scroll on body
    }

    function closeMenu() {
        menuOverlay.classList.remove('open');
        toggleBtn.classList.remove('open');
        document.body.style.overflow = ''; // Enable scroll on body
    }
}

/* 3. Skill & Section Entrance Scroll Animations */
function initScrollAnimations() {
    // 3a. Sections Fade-In
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => sectionObserver.observe(el));

    // 3b. Skills Progress Bars Fill-in Animation
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-target-width') || '80%';
                bar.style.width = width;
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => skillsObserver.observe(bar));
}

/* 4. Typed Animation for Hero Role */
function initTypingEffect() {
    const typedTextEl = document.querySelector('.typed-text');
    if (!typedTextEl) return;

    // Get current text as a starting point, or default to standard titles
    const initialText = typedTextEl.textContent.trim();
    const rolesList = [
        initialText,
        'Java Full Stack Developer',
        'Spring Boot & Microservices Specialist',
        'Problem Solver'
    ].filter(role => role.length > 0);

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = rolesList[roleIndex];
        
        if (isDeleting) {
            typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % rolesList.length;
            typingSpeed = 500; // Brief pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing loop
    type();
}

/* 5. Client-Side Instant Project Searching & Filtering */
function initProjectFilters() {
    const searchField = document.getElementById('project-search');
    const dropdownItems = document.querySelectorAll('#filter-dropdown-menu .dropdown-item');
    const selectedTextSpan = document.querySelector('.dropdown-selected-text');
    const projectCards = document.querySelectorAll('#projects-grid .project-item-card');

    if (!projectCards.length) return;

    let activeCategory = 'All';
    let searchQuery = '';

    // Stagger reveal on page load / scroll
    const projectCardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.style.setProperty('--card-delay', `${idx * 0.08}s`);
                card.classList.add('project-card-visible');
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.1 });

    projectCards.forEach(card => projectCardObserver.observe(card));

    // Dropdown items click listener
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            if (selectedTextSpan) {
                selectedTextSpan.textContent = item.textContent.trim();
            }
            
            activeCategory = item.getAttribute('data-category');
            applyFilters();
        });
    });

    // Search field keyup listener
    if (searchField) {
        searchField.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    function applyFilters() {
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.getAttribute('data-title') || '';
            const cardDesc = card.getAttribute('data-desc') || '';
            const cardTech = card.getAttribute('data-tech') || '';

            const matchesCategory = (activeCategory === 'All' || cardCategory === activeCategory);
            const matchesSearch = (
                cardTitle.includes(searchQuery) ||
                cardDesc.includes(searchQuery) ||
                cardTech.includes(searchQuery)
            );

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                card.style.setProperty('--card-delay', '0s');
                setTimeout(() => {
                    card.classList.add('project-card-visible');
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.92) translateY(15px)';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 250);
            }
        });
    }
    // ── Premium Slider Navigation: arrows, drag, focus-scale, progress ──
    const prevBtn = document.getElementById('projects-prev');
    const nextBtn = document.getElementById('projects-next');
    const sliderTrack = document.getElementById('projects-grid');
    const progressFill = document.getElementById('projects-progress-fill');

    if (sliderTrack) {
        const getVisibleCards = () => Array.from(sliderTrack.querySelectorAll('.project-item-card'))
            .filter(c => c.style.display !== 'none');

        const cardStep = () => {
            const card = getVisibleCards()[0];
            return card ? card.offsetWidth + 28 : 370;
        };

        const updateUI = () => {
            const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;
            const pct = maxScroll > 0 ? (sliderTrack.scrollLeft / maxScroll) * 100 : 0;
            if (progressFill) {
                const fillWidth = 30;
                progressFill.style.width = fillWidth + '%';
                progressFill.style.left = `${pct * (1 - fillWidth / 100)}%`;
            }

            if (prevBtn) prevBtn.classList.toggle('disabled', sliderTrack.scrollLeft <= 5);
            if (nextBtn) nextBtn.classList.toggle('disabled', sliderTrack.scrollLeft >= maxScroll - 5);

        };

        if (prevBtn) prevBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: -cardStep(), behavior: 'smooth' }));
        if (nextBtn) nextBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: cardStep(), behavior: 'smooth' }));

        sliderTrack.addEventListener('scroll', updateUI, { passive: true });
        window.addEventListener('resize', updateUI);
        setTimeout(updateUI, 200);

        let isDown = false, startX = 0, scrollStart = 0;
        sliderTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderTrack.classList.add('dragging');
            startX = e.pageX;
            scrollStart = sliderTrack.scrollLeft;
        });
        window.addEventListener('mouseup', () => {
            isDown = false;
            sliderTrack.classList.remove('dragging');
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            sliderTrack.scrollLeft = scrollStart - (e.pageX - startX);
        });
    }
}

/* 6. Simulated Contact Form Submission */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const submitBtn = document.getElementById('contact-submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const alertWrapper = document.getElementById('contact-alert-wrapper');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform client-side validation
        if (!contactForm.checkValidity()) {
            contactForm.classList.add('was-validated');
            return;
        }

        // Show spinner / disable submit
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        btnSpinner.classList.remove('d-none');
        alertWrapper.innerHTML = '';

        // Simulate network latency (1.5 seconds)
        setTimeout(() => {
            // Restore button state
            submitBtn.disabled = false;
            btnText.innerHTML = 'Send Message &nbsp;→';
            btnSpinner.classList.add('d-none');

            // Display success notification
            showAlert('success', 'Thank you! Your message has been sent successfully.');
            contactForm.reset();
            contactForm.classList.remove('was-validated');
        }, 1500);
    });

    function showAlert(type, message) {
        alertWrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show glass-alert" role="alert">
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
                ${message}
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        // Automatically close the success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                const activeAlert = alertWrapper.querySelector('.alert');
                if (activeAlert) {
                    const bsAlert = new bootstrap.Alert(activeAlert);
                    bsAlert.close();
                }
            }, 6000);
        }
    }
}

/* 7. Tech Stack Section — Spotlight + Pill Reveal Animations */
function initTechStack() {

    // ── Single card cursor-follow spotlight ──────────────────
    const card = document.getElementById('ts-single-card');
    const spotlight = document.getElementById('ts-spotlight');

    if (card && spotlight) {
        let spotlightTicking = false;
        card.addEventListener('mousemove', (e) => {
            if (!spotlightTicking) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                window.requestAnimationFrame(() => {
                    spotlight.style.left = `${x}px`;
                    spotlight.style.top  = `${y}px`;
                    spotlightTicking = false;
                });
                spotlightTicking = true;
            }
        });
        card.addEventListener('mouseleave', () => {
            spotlight.style.left = '50%';
            spotlight.style.top  = '50%';
        });
    }

    // ── Staggered pill entrance via IntersectionObserver ─────
    const pills = document.querySelectorAll('.ts-pill');
    if (!pills.length) return;

    const pillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pill = entry.target;
                setTimeout(() => pill.classList.add('ts-pill-visible'), 10);
                observer.unobserve(pill);
            }
        });
    }, { threshold: 0.3 });

    pills.forEach(pill => pillObserver.observe(pill));
}

/* 8. Achievements & Certificates Showcase Logic */
function initAchievementsShowcase() {
    const container = document.getElementById('cert-marquee-container');
    const track = document.getElementById('cert-marquee-track');
    if (!container || !track) return;

    // ── 8a. JS-based Infinite Scrolling & Wrapping ──────────────────
    container.classList.add('js-marquee-active');
    
    let scrollSpeed = 0.25; // px per frame - elegant and slow scrolling
    let isPaused = false;
    let isDragActive = false;
    let dragStartX = 0;
    let dragScrollLeft = 0;
    let currentScrollPos = container.scrollLeft;
    
    // Auto Scroll Loop
    function autoScroll() {
        if (!isPaused && !isDragActive) {
            currentScrollPos += scrollSpeed;
            
            // Loop wrapper logic
            const oneThird = track.offsetWidth / 3;
            if (oneThird > 0) {
                if (currentScrollPos >= oneThird * 2) {
                    currentScrollPos -= oneThird;
                } else if (currentScrollPos <= 0) {
                    currentScrollPos += oneThird;
                }
            }
            container.scrollLeft = currentScrollPos;
        } else {
            currentScrollPos = container.scrollLeft;
        }
        updateActiveCertificate();
        requestAnimationFrame(autoScroll);
    }
    
    // Start loop after load
    if (document.readyState === 'complete') {
        requestAnimationFrame(autoScroll);
    } else {
        window.addEventListener('load', () => {
            requestAnimationFrame(autoScroll);
        });
    }

    // Pause on Hover
    container.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    container.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // ── 8b. Drag / Swipe Scroll Support ──────────────────
    let isDown = false;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragActive = true;
        container.classList.add('dragging');
        dragStartX = e.pageX - container.offsetLeft;
        dragScrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        isDragActive = false;
        container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        isDragActive = false;
        container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - dragStartX) * 1.5; // Scroll speed multiplier
        container.scrollLeft = dragScrollLeft - walk;
    });

    // Mobile Swipe Support
    container.addEventListener('touchstart', (e) => {
        isDragActive = true;
        dragStartX = e.touches[0].pageX - container.offsetLeft;
        dragScrollLeft = container.scrollLeft;
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isDragActive = false;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isDragActive) return;
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - dragStartX) * 1.5;
        container.scrollLeft = dragScrollLeft - walk;
    }, { passive: true });

    // Handle seamless wrapping during scroll (both auto & manual scroll)
    container.addEventListener('scroll', () => {
        const oneThird = track.offsetWidth / 3;
        if (oneThird <= 0) return;
        if (container.scrollLeft >= oneThird * 2) {
            container.scrollLeft -= oneThird;
            currentScrollPos = container.scrollLeft;
        } else if (container.scrollLeft <= 0) {
            container.scrollLeft += oneThird;
            currentScrollPos = container.scrollLeft;
        }
        updateActiveCertificate();
    });

    // ── 8c. 3D Tilt / Parallax Effect on Hover ──────────────────
    const cards = container.querySelectorAll('.cert-card-wrapper');
    cards.forEach(card => {
        let cardTicking = false;
        card.addEventListener('mousemove', (e) => {
            if (!cardTicking) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // X position inside card
                const y = e.clientY - rect.top;  // Y position inside card
                const width = rect.width;
                const height = rect.height;
                
                // Percentage offset from center (-0.5 to 0.5)
                const xPct = (x / width) - 0.5;
                const yPct = (y / height) - 0.5;
                
                // Max rotation angles
                const rotateX = -yPct * 12;
                const rotateY = xPct * 12;
                
                window.requestAnimationFrame(() => {
                    const inner = card.querySelector('.cert-card-inner');
                    if (inner) {
                        inner.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    }
                    
                    const glow = card.querySelector('.cert-card-glow-bg');
                    if (glow) {
                        glow.style.transform = `translate(${xPct * 18}px, ${yPct * 18}px)`;
                    }
                    cardTicking = false;
                });
                cardTicking = true;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.cert-card-inner');
            if (inner) {
                inner.style.transform = '';
            }
            const glow = card.querySelector('.cert-card-glow-bg');
            if (glow) {
                glow.style.transform = '';
            }
        });
    });

    // ── 8d. Floating Particles Generator ──────────────────
    const particleContainer = document.getElementById('achievements-particles');
    if (particleContainer) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random styling
            const size = Math.random() * 6 + 4; // 4px to 10px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            
            const duration = Math.random() * 12 + 10; // 10s to 22s
            const delay = Math.random() * -20; // negative delay to start immediately
            
            particle.style.animation = `particleFloat ${duration}s ease-in-out infinite`;
            particle.style.animationDelay = `${delay}s`;
            
            particleContainer.appendChild(particle);
        }
    }

    // ── 8e. Center Card Focus & Glow Detection ──────────────────
    function updateActiveCertificate() {
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        let closestCard = null;
        let minDistance = Infinity;
        
        const cards = container.querySelectorAll('.cert-card-wrapper');
        if (!cards.length) return;
        
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - containerCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });
        
        cards.forEach(card => {
            if (card === closestCard) {
                card.classList.add('active-cert');
            } else {
                card.classList.remove('active-cert');
            }
        });
    }

    // Bind events to update center focus
    window.addEventListener('resize', updateActiveCertificate);
    setTimeout(updateActiveCertificate, 150);
}

/* 9. Futuristic AI Tech Gateway Hero Animation */
function initHeroGatewayAnimation() {
    const canvas = document.getElementById('hero-gateway-canvas');
    const container = document.getElementById('tech-logo-container');
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const logos = Array.from(container.querySelectorAll('.gateway-logo'));
    if (!logos.length) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Handle Resize
    window.addEventListener('resize', () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    });

    // Mouse parallax tracking
    let mouseX = 0, mouseY = 0;
    let parallaxX = 0, parallaxY = 0;
    let mouseTicking = false;

    window.addEventListener('mousemove', (e) => {
        if (!mouseTicking) {
            const halfWidth = window.innerWidth / 2;
            const halfHeight = window.innerHeight / 2;
            mouseX = (e.clientX - halfWidth) / halfWidth;
            mouseY = (e.clientY - halfHeight) / halfHeight;
            mouseTicking = true;
            window.requestAnimationFrame(() => {
                mouseTicking = false;
            });
        }
    }, { passive: true });

    // Initialize individual logo states
    const logoStates = logos.map((logo, idx) => {
        const color = logo.getAttribute('data-color') || '#ffffff';
        // Assign depth layers
        const depth = 0.5 + Math.random() * 0.7; // 0.5 to 1.2
        
        // Large size variation
        const size = Math.floor(52 * depth + Math.random() * 8); // ~26px to ~72px
        logo.style.width = `${size}px`;
        logo.style.height = `${size}px`;
        logo.style.fontSize = `${size * 0.72}px`;
        logo.style.setProperty('--color', color);
        logo.style.color = color;
        
        // Blur filter for depth perception
        const blurAmount = (1.2 - depth) * 3; // farther are blurrier
        logo.style.filter = `drop-shadow(0 0 10px ${color}) blur(${blurAmount}px)`;
        
        // Position - scatter randomly inside viewport
        const x = Math.random() * width;
        const y = Math.random() * height;

        // Diagonal velocities for X-crossing streams
        const isA = idx % 2 === 0;
        const speed = (0.55 + Math.random() * 0.4) * depth;
        const vx = speed;
        const vy = isA ? speed : -speed;

        return {
            element: logo,
            color: color,
            depth: depth,
            size: size,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            history: [] // for trail tracking
        };
    });

    let isVisible = false;
    let animationFrameId = null;

    // Animation Loop
    function animate() {
        if (!isVisible) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Smooth parallax displacement
        parallaxX += (mouseX * 55 - parallaxX) * 0.08;
        parallaxY += (mouseY * 55 - parallaxY) * 0.08;

        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';

        // Update & Render positions
        logoStates.forEach(logo => {
            // Update movement along diagonal vectors
            logo.x += logo.vx;
            logo.y += logo.vy;

            // Wrap boundaries diagonally
            if (logo.x > width + 100) {
                logo.x = -100;
                logo.y = logo.vy > 0 ? -100 : height + 100;
            } else if (logo.x < -100) {
                logo.x = width + 100;
                logo.y = logo.vy > 0 ? height + 100 : -100;
            }

            if (logo.y > height + 100) {
                logo.y = -100;
                logo.x = logo.vx > 0 ? -100 : width + 100;
            } else if (logo.y < -100) {
                logo.y = height + 100;
                logo.x = logo.vx > 0 ? width + 100 : -100;
            }

            // Apply Parallax shift
            const renderX = logo.x + parallaxX * logo.depth;
            const renderY = logo.y + parallaxY * logo.depth;

            // Update DOM element positions
            logo.element.style.transform = `translate3d(${renderX}px, ${renderY}px, 0)`;

            // Opacity: 40% - 70% in dark mode, slightly softer in light mode for readability
            const baseOpacity = isDark ? (0.4 + (logo.depth - 0.5) * 0.4) : (0.22 + (logo.depth - 0.5) * 0.3);
            logo.element.style.opacity = baseOpacity;

            // Add position to trail history
            logo.history.push({ x: renderX + logo.size / 2, y: renderY + logo.size / 2 });
            if (logo.history.length > 8) {
                logo.history.shift();
            }

            // Draw soft particle trails on canvas
            if (logo.history.length > 1) {
                ctx.beginPath();
                ctx.moveTo(logo.history[0].x, logo.history[0].y);
                for (let i = 1; i < logo.history.length; i++) {
                    ctx.lineTo(logo.history[i].x, logo.history[i].y);
                }
                ctx.lineWidth = logo.size * 0.12;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                
                // Trail gradient fading out
                const trailGrad = ctx.createLinearGradient(
                    logo.history[0].x, logo.history[0].y,
                    logo.history[logo.history.length - 1].x, logo.history[logo.history.length - 1].y
                );
                trailGrad.addColorStop(0, 'transparent');
                trailGrad.addColorStop(1, `${logo.color}25`); // ~15% opacity at head
                
                ctx.strokeStyle = trailGrad;
                ctx.stroke();
            }
        });

        // Draw connections between nearby logos (constellation network lines)
        const maxDist = 280;
        for (let i = 0; i < logoStates.length; i++) {
            for (let j = i + 1; j < logoStates.length; j++) {
                const l1 = logoStates[i];
                const l2 = logoStates[j];

                const rX1 = l1.x + parallaxX * l1.depth + l1.size / 2;
                const rY1 = l1.y + parallaxY * l1.depth + l1.size / 2;
                const rX2 = l2.x + parallaxX * l2.depth + l2.size / 2;
                const rY2 = l2.y + parallaxY * l2.depth + l2.size / 2;

                const dx = rX2 - rX1;
                const dy = rY2 - rY1;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const factor = 1 - dist / maxDist;
                    const lineOpacity = isDark ? factor * 0.28 : factor * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(rX1, rY1);
                    ctx.lineTo(rX2, rY2);
                    ctx.lineWidth = 1;
                    
                    // Create gradient color for connection line
                    const lineGrad = ctx.createLinearGradient(rX1, rY1, rX2, rY2);
                    lineGrad.addColorStop(0, `${l1.color}${Math.floor(lineOpacity * 255).toString(16).padStart(2, '0')}`);
                    lineGrad.addColorStop(1, `${l2.color}${Math.floor(lineOpacity * 255).toString(16).padStart(2, '0')}`);
                    
                    ctx.strokeStyle = lineGrad;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // IntersectionObserver to pause/resume loop
    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const wasVisible = isVisible;
            isVisible = entry.isIntersecting;
            if (isVisible && !wasVisible) {
                animate();
            }
        });
    }, { threshold: 0.01 });

    canvasObserver.observe(canvas);
}

/* Skills Toggle - single source of truth */
function initSkillsToggle() {
    const btn = document.getElementById("toggleSkills");
    const moreSkills = document.getElementById("moreSkills");
    if (!btn || !moreSkills) return;

    btn.addEventListener("click", () => {
        const isHidden = moreSkills.classList.toggle("show");
        btn.textContent = isHidden ? "Show Less" : "View More Skills";
    });
}

// Slider Arrow Navigation
    const prevBtn = document.getElementById('projects-prev');
    const nextBtn = document.getElementById('projects-next');
    const sliderTrack = document.getElementById('projects-grid');

    if (prevBtn && nextBtn && sliderTrack) {
        const scrollAmount = () => {
            const card = sliderTrack.querySelector('.project-item-card');
            return card ? card.offsetWidth + 24 : 360; // 24 = gap
        };

        prevBtn.addEventListener('click', () => {
            sliderTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            sliderTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        });
    }

    /* 10. Back to Top / Home — Floating Glass Button */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const ringProgress = btn.querySelector('.btt-ring-progress');
    const circumference = 157; // 2 * Math.PI * 25
    let ticking = false;

    function update() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? scrollY / docHeight : 0;

        btn.classList.toggle('show', scrollY > 300);

        if (ringProgress) {
            ringProgress.style.strokeDashoffset = circumference - (pct * circumference);
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}




