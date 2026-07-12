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

    /* ==========================================================================
       INTERNATIONALIZATION (i18n) ENGINE
       ========================================================================== */
    const translations = {
        en: {
            "nav-showreel": "Showreel",
            "nav-portfolio": "Portfolio",
            "nav-workflow": "Workflow",
            "nav-testimonials": "Client Love",
            "nav-contact": "Start a Project",
            "header-cta": "<i class=\"fa-solid fa-bolt\"></i> Go Viral",
            "hero-subtitle": "VIRAL DESIGN ENGINEER — 100M+ VIEWS GENERATED",
            "hero-title": "VIRAL SHORT-FORM VIDEOS THAT KEEP <span class=\"gradient-text serif-text\">Viewers Hooked</span>",
            "hero-desc": "High-retention editing, custom sound design, speed ramping, and dynamic captions engineered to dominate TikTok, Reels, and YouTube Shorts.",
            "btn-watch-showreel": "<i class=\"fa-solid fa-play\"></i> Watch Showreel",
            "btn-explore-reels": "Explore Reels <i class=\"fa-solid fa-arrow-right\"></i>",
            "showreel-badge": "THE SHOWREEL",
            "showreel-title": "2026 Short-Form Reel",
            "showreel-desc": "A vertical 30-second compilation showing hooks, dynamic motion layouts, pacing, sound effects, and retention tricks.",
            "portfolio-badge": "PORTFOLIO",
            "portfolio-title": "Featured Reels",
            "portfolio-desc": "Filter through recent high-performance vertical clips by editing style.",
            "filter-all": "All Projects",
            "filter-hooks": "Motion Design",
            "filter-captions": "Dynamic Captions",
            "filter-ads": "Short Ads",
            "filter-gaming": "Gaming / Hype",
            "btn-watch-reel": "Watch Reel <i class=\"fa-solid fa-chevron-right\"></i>",
            "p1-tag": "Motion Design",
            "p1-title": "AI Feature Animation",
            "p1-desc": "Sleek keyframe transitions, dynamic typography overlays, and custom graphics styled to explain complex metrics.",
            "p2-tag": "Dynamic Captions",
            "p2-title": "Real Estate",
            "p2-desc": "High-retention real estate reel. Rhythmic pacing, bold captions, and clean grading to drive buyer leads.",
            "p3-tag": "Short Ad",
            "p3-title": "Fitness Energy Drink",
            "p3-desc": "High-energy speed ramping, sound effects layering, and flashing text hooks to boost CTR.",
            "p4-tag": "Gaming / Hype",
            "p4-title": "Pro E-Sports Clutch",
            "p4-desc": "Glitch overlays, screen shakes, beat-synced highlights, and sound design impacts.",
            "p5-tag": "Hooks & Motion",
            "p5-title": "Creator Hype Intro",
            "p5-desc": "Sticker animations, zoom hooks, and seamless visual loops to increase completion rate.",
            "p6-tag": "Short Ad",
            "p6-title": "SaaS Web Tool Promo",
            "p6-desc": "Direct-response UI zoom-ins, cursor click effects, and fast-paced text formatting.",
            "tech-ai": "<i class=\"fa-solid fa-square-check\"></i> AI Video & Audio Tools (ElevenLabs / Topaz / Runway)",
            "tech-davinci": "<i class=\"fa-solid fa-square-check\"></i> DaVinci Resolve (Color Grading)",
            "tech-remotion": "<i class=\"fa-solid fa-square-check\"></i> Remotion (React Video Engineering)",
            "workflow-badge": "THE RETENTION FORMULA",
            "workflow-title": "Engineered to Retain Viewers",
            "workflow-desc": "Short-form videos require a specific science. Here is how I build clips that stand out in the feed.",
            "w1-title": "First 3-Sec Hooks",
            "w1-desc": "Creating immediate visual or audio pattern-interrupts (zoom hooks, custom text, audio cues) to stop the user from scrolling.",
            "w2-title": "Pacing & Sound FX",
            "w2-desc": "Aggressive rhythmic cuts, speed ramping, Foley integration, and audio whooshes to maintain high engagement every single second.",
            "w3-title": "Kinetic Subtitles",
            "w3-desc": "Stylized, high-contrast subtitles styled after viral creators (Alex Hormozi/Ali Abdaal style) to keep users engaged even on mute.",
            "w4-title": "Infinite Loop Setup",
            "w4-desc": "Arranging the end of the script and final frames to transition seamlessly back to the start, inflating the average view count.",
            "console-title": "<i class=\"fa-solid fa-terminal\"></i> Post-Production Tech Stack",
            "test-badge": "CREATOR RESULTS",
            "test-title": "Proven Engagement",
            "test-desc": "Delivering viral loops, higher completions, and client satisfaction.",
            "t1-text": "\"Viera completely transformed our vertical video ads. Average watch time jumped from 4 seconds to 12 seconds, resulting in a 40% reduction in our CAC.\"",
            "t1-author-title": "Marketing Director, Urban Edge",
            "t2-text": "\"Our TikTok account gained 150k followers in less than 2 months after working with Viera. The speed ramps, custom sound effects, and kinetic subtitles are flawless.\"",
            "t2-author-title": "Fitness Influencer (1.2M followers)",
            "t3-text": "\"The editing is extremely dynamic. The custom loops work so well that many viewers watch our Reels multiple times. Outstanding communication.\"",
            "t3-author-title": "Tech Content Creator",
            "stat-1": "Reels Delivered",
            "stat-2": "Viral Views Generated",
            "stat-3": "Avg. Completion Rate",
            "stat-4": "Creators Scaled",
            "contact-badge": "LET'S COLLABORATE",
            "contact-title": "Ready to dominate the feed?",
            "contact-desc": "Have a custom campaign, want to scale your personal brand, or need batch video editing? Leave a message detailing your project scope and reference channels.",
            "contact-email-title": "Email Me",
            "contact-location-title": "Location",
            "contact-location-desc": "Remote / Global Bookings",
            "form-name": "Your Name",
            "form-email": "Your Email",
            "form-format": "Project Format",
            "form-select": "Select format",
            "form-option-batch": "TikTok / Instagram Reels Batch",
            "form-option-ads": "Short Form Video Ads",
            "form-option-channel": "Continuous Channel Editing",
            "form-option-other": "Other Collaboration",
            "form-details": "Project Details & References",
            "form-submit": "Pitch Project <i class=\"fa-solid fa-bolt\"></i>",
            "footer-text": "&copy; 2026 Viera Visuals. All rights reserved. Engineering high-retention content worldwide."
        },
        pt: {
            "nav-showreel": "Showreel",
            "nav-portfolio": "Portfólio",
            "nav-workflow": "Processo",
            "nav-testimonials": "Clientes",
            "nav-contact": "Iniciar Projeto",
            "header-cta": "<i class=\"fa-solid fa-bolt\"></i> Viralizar",
            "hero-subtitle": "ENGENHEIRO DE DESIGN VIRAL — +100M DE VIEWS GERADOS",
            "hero-title": "VÍDEOS CURTOS VIRAIS QUE MANTÊM O <span class=\"gradient-text serif-text\">Público Preso</span>",
            "hero-desc": "Edição de alta retenção, sound design personalizado, speed ramping e legendas dinâmicas projetadas para dominar o TikTok, Reels e YouTube Shorts.",
            "btn-watch-showreel": "<i class=\"fa-solid fa-play\"></i> Assistir Showreel",
            "btn-explore-reels": "Explorar Reels <i class=\"fa-solid fa-arrow-right\"></i>",
            "showreel-badge": "O SHOWREEL",
            "showreel-title": "Reel Curto 2026",
            "showreel-desc": "Uma compilação vertical de 30 segundos mostrando ganchos, layouts de movimento dinâmicos, ritmo, efeitos sonoros e truques de retenção.",
            "portfolio-badge": "PORTFÓLIO",
            "portfolio-title": "Trabalhos em Destaque",
            "portfolio-desc": "Filtre os trabalhos recentes por estilo de edição.",
            "filter-all": "Todos os Projetos",
            "filter-hooks": "Motion Design",
            "filter-captions": "Legendas Dinâmicas",
            "filter-ads": "Anúncios Curtos",
            "filter-gaming": "Jogos / Hype",
            "btn-watch-reel": "Assistir Reel <i class=\"fa-solid fa-chevron-right\"></i>",
            "p1-tag": "Motion Design",
            "p1-title": "Animação de Recurso de IA",
            "p1-desc": "Transições fluidas de quadro-chave, sobreposições tipográficas dinâmicas e gráficos personalizados para explicar métricas complexas.",
            "p2-tag": "Legendas Dinâmicas",
            "p2-title": "Real Estate",
            "p2-desc": "Reel imobiliário de alta retenção. Ritmo dinâmico, legendas chamativas e gradação limpa para atrair compradores.",
            "p3-tag": "Anúncio Curto",
            "p3-title": "Bebida Energética Fitness",
            "p3-desc": "Aceleração de ritmo de alta energia, camadas de efeitos sonoros e textos piscantes para aumentar o CTR.",
            "p4-tag": "Jogos / Hype",
            "p4-title": "Jogada Pro E-Sports",
            "p4-desc": "Sobreposições de falhas (glitch), tremores de tela, destaques sincronizados com a batida e efeitos de áudio.",
            "p5-tag": "Ganchos & Movimento",
            "p5-title": "Intro de Hype de Criador",
            "p5-desc": "Animações de adesivos, ganchos de zoom e loops visuais integrados para aumentar a taxa de visualização completa.",
            "p6-tag": "Anúncio Curto",
            "p6-title": "Promoção de Ferramenta SaaS",
            "p6-desc": "Aproximações (zooms) de interface de resposta direta, efeitos de clique do cursor e formatação rápida de texto.",
            "tech-ai": "<i class=\"fa-solid fa-square-check\"></i> Ferramentas de IA (ElevenLabs / Topaz / Runway)",
            "tech-davinci": "<i class=\"fa-solid fa-square-check\"></i> DaVinci Resolve (Correção de Cor)",
            "tech-remotion": "<i class=\"fa-solid fa-square-check\"></i> Remotion (Engenharia de Vídeo em React)",
            "workflow-badge": "A FÓRMULA DA RETENÇÃO",
            "workflow-title": "Projetado para Reter Espectadores",
            "workflow-desc": "Vídeos curtos exigem uma ciência específica. Veja como crio clipes que se destacam no feed.",
            "w1-title": "Ganchos nos Primeiros 3 Segundos",
            "w1-desc": "Criação de interrupções de padrão imediatas (zooms, textos personalizados, efeitos sonoros) para fazer o usuário parar de rolar.",
            "w2-title": "Ritmo e Sound Design",
            "w2-desc": "Cortes rítmicos acelerados, speed ramping, efeitos sonoros realistas (Foley) e transições de som para manter o engajamento.",
            "w3-title": "Legendas Cinéticas",
            "w3-desc": "Legendas estilizadas de alto contraste inspiradas em criadores virais (estilo Alex Hormozi/Ali Abdaal) para reter quem assiste sem som.",
            "w4-title": "Estrutura de Loop Infinito",
            "w4-desc": "Ajuste do final do roteiro e dos quadros de encerramento para transicionar de volta ao início, inflando o tempo médio de visualização.",
            "console-title": "<i class=\"fa-solid fa-terminal\"></i> Ferramentas de Pós-Produção",
            "test-badge": "RESULTADOS DOS CRIADORES",
            "test-title": "Engajamento Comprovado",
            "test-desc": "Entregando loops virais, maior retenção e satisfação dos clientes.",
            "t1-text": "\"Viera transformou completamente nossos anúncios em vídeo. O tempo médio de visualização saltou de 4 para 12 segundos, reduzindo nosso CAC em 40%.\"",
            "t1-author-title": "Diretor de Marketing, Urban Edge",
            "t2-text": "\"Nossa conta do TikTok ganhou 150 mil seguidores em menos de 2 meses após começarmos a trabalhar com o Viera. As transições de velocidade, efeitos sonoros e legendas são impecáveis.\"",
            "t2-author-title": "Influenciadora Fitness (1.2M de seguidores)",
            "t3-text": "\"A edição é extremamente dinâmica. A estrutura de loops funciona tão bem que muitos espectadores assistem aos Reels várias vezes. Comunicação excelente.\"",
            "t3-author-title": "Criador de Conteúdo Tech",
            "stat-1": "Reels Entregues",
            "stat-2": "Visualizações Virais Geradas",
            "stat-3": "Taxa Média de Retenção",
            "stat-4": "Criadores Impulsionados",
            "contact-badge": "VAMOS COLABORAR",
            "contact-title": "Pronto para dominar o feed?",
            "contact-desc": "Quer escalar seus canais orgânicos? Fale comigo ou copie o meu e-mail para começarmos a colaborar.",
            "contact-email-title": "Enviar E-mail",
            "contact-location-title": "Localização",
            "contact-location-desc": "Remoto / Atendimento Global",
            "form-name": "Seu Nome",
            "form-email": "Seu E-mail",
            "form-format": "Formato do Projeto",
            "form-select": "Selecione o formato",
            "form-option-batch": "Lote de TikTok / Instagram Reels",
            "form-option-ads": "Anúncios em Vídeo Curto",
            "form-option-channel": "Edição Contínua para Canal",
            "form-option-other": "Outro Tipo de Parceria",
            "form-details": "Detalhes do Projeto e Referências",
            "form-submit": "Enviar Briefing <i class=\"fa-solid fa-bolt\"></i>",
            "footer-text": "&copy; 2026 Viera Visuals. Todos os direitos reservados. Projetando conteúdo de alta retenção no mundo inteiro."
        }
    };

    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    
    const translatePage = (lang) => {
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        
        // Update data-title attributes on video buttons dynamically to keep them in sync
        const videoButtons = document.querySelectorAll('.open-video-btn');
        videoButtons.forEach(btn => {
            const card = btn.closest('.portfolio-item');
            if (card) {
                const titleEl = card.querySelector('.project-title');
                if (titleEl) {
                    btn.setAttribute('data-title', titleEl.textContent.trim());
                }
            }
        });

        // Translate placeholders dynamically
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const msgTextarea = document.getElementById('message');
        
        if (nameInput) nameInput.placeholder = lang === 'pt' ? 'Fulano de Tal' : 'John Doe';
        if (emailInput) emailInput.placeholder = lang === 'pt' ? 'fulano@exemplo.com' : 'john@example.com';
        if (msgTextarea) msgTextarea.placeholder = lang === 'pt' 
            ? 'Cole links de referência do TikTok/Reels, detalhes sobre volume mensal, prazos, etc...' 
            : 'Paste reference TikTok/Reels links, details on monthly volume, deadliness, etc...';
        
        // Update document lang
        document.documentElement.lang = lang;
    };

    // Auto-detect language
    let currentLang = localStorage.getItem('viera-lang');
    if (!currentLang) {
        const userLangs = navigator.languages || [navigator.language || ''];
        const prefersPt = userLangs.some(l => l.toLowerCase().startsWith('pt'));
        currentLang = prefersPt ? 'pt' : 'en';
    }
    
    // Initial translation execution
    translatePage(currentLang);

    // Lang toggle functionality
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        
        const updateToggleUI = (lang) => {
            langText.textContent = lang === 'pt' ? 'EN' : 'PT';
        };
        
        // Initialize UI toggle text
        updateToggleUI(currentLang);
        
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            localStorage.setItem('viera-lang', currentLang);
            translatePage(currentLang);
            updateToggleUI(currentLang);
        });
    }
});
