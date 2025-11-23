/* ==========================================================================
   DEVELOPER PORTFOLIO JAVASCRIPT (Interactivity, Starfield & Animations)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Custom Glowing Cursor Tracking --- */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let outlineX = mouseX;
        let outlineY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth trailing outline animation loop
        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Enlarge cursor on interactive element hover
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-pill, .filter-btn, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* --- 2. Canvas Starfield Particles Engine --- */
    const canvas = document.getElementById('starfield');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        const numStars = 140;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.8 + 0.2;
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.isRed = Math.random() < 0.15; // 15% stars glow in crimson red
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                this.opacity += this.twinkleSpeed;
                if (this.opacity > 1 || this.opacity < 0.2) {
                    this.twinkleSpeed = -this.twinkleSpeed;
                }

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                if (this.isRed) {
                    ctx.fillStyle = `rgba(229, 9, 20, ${this.opacity})`;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#E50914';
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
            }
        }

        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }

        function renderStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            requestAnimationFrame(renderStars);
        }
        renderStars();
    }

    /* --- 3. Typing Effect Loop --- */
    const roles = [
        "an AI & Machine Learning Engineer",
        "an Entry-Level Software Engineer",
        "a Data Analyst",
        "a Full-Stack Developer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingTextElement = document.querySelector('.typing-text');

    function typeLoop() {
        if (!typingTextElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2200; // Pause at full text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400; // Pause before typing next word
        }

        setTimeout(typeLoop, speed);
    }
    typeLoop();

    /* --- 4. Header Scroll & Active Scroll-Spy --- */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Header Scrolled state
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Spy Section Link Active Toggle
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* --- 5. Mobile Navigation Drawer --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    /* --- 6. Project Filter Tabs --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* --- 7. 3D Tilt Card Effect --- */
    const tiltCard = document.getElementById('tilt-card');
    if (tiltCard) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 20;
            const rotateY = (x / rect.width) * 20;

            const avatarBox = tiltCard.querySelector('.avatar-box');
            if (avatarBox) {
                avatarBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        tiltCard.addEventListener('mouseleave', () => {
            const avatarBox = tiltCard.querySelector('.avatar-box');
            if (avatarBox) {
                avatarBox.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
        });
    }

    /* --- 8. Resume Download Button --- */
    // Native browser download triggered via href="Elikante_Charan_Resume.pdf" download

    /* --- 9. Interactive Contact Form Submission --- */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<span>Sent Successfully!</span> <i class="fas fa-check"></i>';
                submitBtn.style.background = '#22c55e';

                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you! Your message has been sent. I will get back to you shortly.';

                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    formStatus.textContent = '';
                }, 4000);
            }, 1200);
        });
    }
});
