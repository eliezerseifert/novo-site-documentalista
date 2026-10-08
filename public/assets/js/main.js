        // Global smooth scroll instance
        let lenisInstance = null;

        function initLenis() {
            // Em dispositivos móveis, desativa o Lenis para usar o scroll suave nativo a 120Hz do SO e economizar CPU/bateria
            const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);
            if (isMobile) {
                if (lenisInstance) {
                    try { lenisInstance.destroy(); } catch (e) {}
                    lenisInstance = null;
                }
                return null;
            }

            if (!lenisInstance && typeof Lenis !== 'undefined') {
                lenisInstance = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    direction: 'vertical',
                    gestureDirection: 'vertical',
                    smooth: true,
                    mouseMultiplier: 1,
                    smoothTouch: false,
                    touchMultiplier: 2,
                    infinite: false,
                });

                function raf(time) {
                    if (lenisInstance) {
                        lenisInstance.raf(time);
                        requestAnimationFrame(raf);
                    }
                }
                requestAnimationFrame(raf);
            }
            return lenisInstance;
        }

        // Persistent Header Scroll Logic
        function initHeaderScroll() {
            const header = document.getElementById('header');
            if (header && !header._hasScrollListener) {
                header._hasScrollListener = true;
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }, { passive: true });
            }
        }

        // Persistent Mobile Drawer Logic
        function initMobileMenu(lenis) {
            const mobileToggle = document.getElementById('mobileToggle');
            const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const mobileClose = document.getElementById('mobileClose');

            function openMobileMenu() {
                if (!mobileMenuDrawer) return;
                mobileMenuDrawer.classList.add('is-open');
                if (mobileMenuOverlay) mobileMenuOverlay.classList.add('is-open');
                if (mobileToggle) {
                    mobileToggle.setAttribute('aria-expanded', 'true');
                    mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                }
                document.body.classList.add('mobile-menu-locked');
                if (lenis) lenis.stop();
            }

            function closeMobileMenu() {
                if (!mobileMenuDrawer) return;
                mobileMenuDrawer.classList.remove('is-open');
                if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('is-open');
                if (mobileToggle) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
                document.body.classList.remove('mobile-menu-locked');
                if (lenis) lenis.start();
            }

            if (mobileToggle && !mobileToggle._hasToggleListener) {
                mobileToggle._hasToggleListener = true;
                mobileToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (mobileMenuDrawer && mobileMenuDrawer.classList.contains('is-open')) {
                        closeMobileMenu();
                    } else {
                        openMobileMenu();
                    }
                });
            }

            if (mobileClose && !mobileClose._hasCloseListener) {
                mobileClose._hasCloseListener = true;
                mobileClose.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeMobileMenu();
                });
            }

            if (mobileMenuOverlay && !mobileMenuOverlay._hasOverlayListener) {
                mobileMenuOverlay._hasOverlayListener = true;
                mobileMenuOverlay.addEventListener('click', () => {
                    closeMobileMenu();
                });
            }

            if (!document._hasEscapeListener) {
                document._hasEscapeListener = true;
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && mobileMenuDrawer && mobileMenuDrawer.classList.contains('is-open')) {
                        closeMobileMenu();
                    }
                });

                window.addEventListener('resize', () => {
                    if (window.innerWidth > 1024 && mobileMenuDrawer && mobileMenuDrawer.classList.contains('is-open')) {
                        closeMobileMenu();
                    }
                });
            }

            return { openMobileMenu, closeMobileMenu };
        }

        // Main Page Initialization
        function initPage() {
            const lenis = initLenis();
            initHeaderScroll();
            const { closeMobileMenu } = initMobileMenu(lenis);

            const isMobile = window.innerWidth <= 768;

            // GSAP Animations (re-initialized per page)
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);

                // Setup initial states (menores deslocamentos no celular para resposta visual imediata)
                gsap.set('.g-fade-up', { y: isMobile ? 15 : 40, opacity: 0 });
                gsap.set('.g-fade-in', { opacity: 0, scale: isMobile ? 0.98 : 0.95 });

                const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: isMobile ? 0.7 : 1 } });
                tl.to('.g-fade-up', {
                    y: 0,
                    opacity: 1,
                    stagger: isMobile ? 0.08 : 0.15,
                    delay: 0.1
                })
                .to('.g-fade-in', {
                    opacity: 1,
                    scale: 1,
                    duration: isMobile ? 0.8 : 1.5,
                    ease: 'power2.out'
                }, "-=0.5");

                // Scroll animations
                gsap.utils.toArray('.scroll-anim').forEach((el) => {
                    gsap.fromTo(el, 
                        { y: isMobile ? 25 : 60, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: isMobile ? 0.6 : 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: el,
                                start: isMobile ? 'top 92%' : 'top 85%',
                                toggleActions: isMobile ? 'play none none none' : 'play none none reverse'
                            }
                        }
                    );
                });

                gsap.utils.toArray('.scroll-anim-left').forEach((el) => {
                    gsap.fromTo(el, 
                        { x: isMobile ? -20 : -50, opacity: 0 },
                        {
                            x: 0,
                            opacity: 1,
                            duration: isMobile ? 0.7 : 1.2,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: el,
                                start: isMobile ? 'top 90%' : 'top 80%',
                                toggleActions: isMobile ? 'play none none none' : 'play none none reverse'
                            }
                        }
                    );
                });

                gsap.utils.toArray('.scroll-anim-right').forEach((el) => {
                    gsap.fromTo(el, 
                        { x: isMobile ? 20 : 50, opacity: 0 },
                        {
                            x: 0,
                            opacity: 1,
                            duration: isMobile ? 0.7 : 1.2,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: el,
                                start: isMobile ? 'top 90%' : 'top 80%',
                                toggleActions: isMobile ? 'play none none none' : 'play none none reverse'
                            }
                        }
                    );
                });

                gsap.utils.toArray('.security-item').forEach((item, i) => {
                    gsap.fromTo(item,
                        { opacity: 0, y: isMobile ? 10 : 15 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            delay: isMobile ? i * 0.08 : i * 0.15,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: '.security-list',
                                start: isMobile ? 'top 92%' : 'top 85%'
                            }
                        }
                    );
                });

                ScrollTrigger.refresh();
            }

            // Tab Switching Logic for Features Section
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabPanels = document.querySelectorAll('.tab-panel');

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetTab = btn.getAttribute('data-tab');

                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabPanels.forEach(p => p.classList.remove('active'));

                    btn.classList.add('active');
                    const activePanel = document.getElementById(targetTab);
                    if (activePanel) {
                        activePanel.classList.add('active');
                    }
                });
            });

            // Parallax effect on mouse move for background blobs (apenas Desktop)
            if (!document._hasMouseMoveListener) {
                document._hasMouseMoveListener = true;
                document.addEventListener('mousemove', (e) => {
                    if (window.innerWidth <= 768) return;
                    if (typeof gsap === 'undefined') return;
                    const x = (e.clientX / window.innerWidth - 0.5) * 20;
                    const y = (e.clientY / window.innerHeight - 0.5) * 20;
                    gsap.to('.blob-1', { x: x, y: y, duration: 1, ease: 'power1.out' });
                    gsap.to('.blob-2', { x: -x * 1.5, y: -y * 1.5, duration: 1, ease: 'power1.out' });
                }, { passive: true });
            }

            // Smooth Anchor Navigation
            const isHomePage = window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname.endsWith('/index.html');

            document.querySelectorAll('a[href*="#"]').forEach((link) => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (!href) return;

                    const hashIndex = href.indexOf('#');
                    if (hashIndex === -1) return;

                    const hash = href.substring(hashIndex);
                    if (!hash || hash === '#') return;

                    const targetPath = href.substring(0, hashIndex);
                    const isSamePage = !targetPath || targetPath === '/' || targetPath === window.location.pathname;

                    if (isHomePage && isSamePage) {
                        const targetElem = document.querySelector(hash);
                        if (targetElem) {
                            e.preventDefault();
                            closeMobileMenu();
                            if (lenis) {
                                lenis.scrollTo(targetElem, { offset: -80, duration: 1.2 });
                            } else {
                                targetElem.scrollIntoView({ behavior: 'smooth' });
                            }
                            history.pushState(null, '', hash);
                            return;
                        }
                    }

                    closeMobileMenu();
                });
            });

            // Direct hash on URL
            if (window.location.hash) {
                const targetElem = document.querySelector(window.location.hash);
                if (targetElem) {
                    setTimeout(() => {
                        if (lenis) {
                            lenis.scrollTo(targetElem, { offset: -80, duration: 1.2 });
                        } else {
                            targetElem.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 400);
                }
            }
        }

        // Astro View Transitions Hooks
        document.addEventListener('astro:page-load', initPage);
        document.addEventListener('astro:after-swap', () => {
            const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const mobileToggle = document.getElementById('mobileToggle');
            if (mobileMenuDrawer) mobileMenuDrawer.classList.remove('is-open');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('is-open');
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
            document.body.classList.remove('mobile-menu-locked');
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        });

        // Initial Load Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPage);
        } else {
            initPage();
        }
