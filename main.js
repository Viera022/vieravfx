document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       MOBILE MENU NAVIGATION
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        menuToggle.classList.toggle('open');
        nav.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       PORTFOLIO CATEGORY FILTER
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to current button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'flex';
                    // Trigger reflow for animation
                    item.offsetHeight; 
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px) scale(0.95)';
                    setTimeout(() => {
                        if (button.getAttribute('data-filter') === filterValue) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    /* ==========================================================================
       LIGHTBOX / MODAL VIDEO PLAYER
       ========================================================================== */
    const videoModal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const modalPlayer = document.getElementById('modal-player-video');
    const modalTitle = document.getElementById('modal-video-title');
    const openVideoButtons = document.querySelectorAll('.open-video-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-item');

    const openModal = (videoUrl, title) => {
        modalTitle.textContent = title;
        modalPlayer.src = videoUrl;
        videoModal.classList.add('open');
        modalPlayer.play();
        document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        videoModal.classList.remove('open');
        modalPlayer.pause();
        modalPlayer.src = '';
        document.body.classList.remove('no-scroll');
    };

    // Open when clicking the watch text buttons
    openVideoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoUrl = btn.getAttribute('data-video-url');
            const title = btn.getAttribute('data-title');
            openModal(videoUrl, title);
        });
    });

    // Open when clicking anywhere on the thumbnail card
    portfolioCards.forEach(card => {
        const thumb = card.querySelector('.portfolio-thumbnail');
        const playBtn = card.querySelector('.open-video-btn');
        if (thumb && playBtn) {
            thumb.addEventListener('click', () => {
                const videoUrl = playBtn.getAttribute('data-video-url');
                const title = playBtn.getAttribute('data-title');
                openModal(videoUrl, title);
            });
        }
    });

    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the content box
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('open')) {
            closeModal();
        }
    });

    /* ==========================================================================
       ANIMATE SKILL BARS ON SCROLL REVEAL
       ========================================================================== */
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    // Reset widths initially to animate them when scrolled into view
    skillProgressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        bar.setAttribute('data-target-width', targetWidth);
    });

    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-progress');
                bars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-target-width');
                });
                observer.unobserve(entry.target); // Animate only once
            }
        });
    };

    const skillsSection = document.querySelector('.tech-console');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver(animateSkills, {
            root: null,
            threshold: 0.2
        });
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       SCROLL SPY (ACTIVE NAVIGATION LINK)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpy = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);

    /* ==========================================================================
       CONTACT FORM SUBMISSION WITH SIMULATED FEEDBACK
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable button during submission simulation
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Project Details <i class="fa-solid fa-spinner fa-spin"></i>';
            formMessage.className = 'form-message';
            formMessage.textContent = '';

            // Simulate server network latency
            setTimeout(() => {
                // Generate simple verification
                const name = document.getElementById('name').value;
                
                // Show success feedback
                formMessage.textContent = `Thank you, ${name}! Your project brief has been received. Viera will contact you shortly.`;
                formMessage.classList.add('success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Project Brief <i class="fa-solid fa-paper-plane"></i>';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.opacity = '0';
                    setTimeout(() => {
                        formMessage.textContent = '';
                        formMessage.className = 'form-message';
                        formMessage.style.opacity = '1';
                    }, 300);
                }, 5000);

            }, 1500);
        });
    }
});
