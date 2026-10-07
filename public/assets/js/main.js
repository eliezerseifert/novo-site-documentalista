        document.addEventListener("DOMContentLoaded", () => {
            // 1. Initialize Lenis Smooth Scroll
            const lenis = new Lenis({
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
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            // 2. Header Scroll Effect
            const header = document.getElementById('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // 3. GSAP Animations
            gsap.registerPlugin(ScrollTrigger);

            // Setup initial states for elements
            gsap.set('.g-fade-up', { y: 40, opacity: 0 });
            gsap.set('.g-fade-in', { opacity: 0, scale: 0.95 });

            // Create timeline for Hero entrance
            const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

            tl.to('.g-fade-up', {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                delay: 0.2
            })
            .to('.g-fade-in', {
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: 'power2.out'
            }, "-=0.8");

            // 4. Features Scroll Animations
            gsap.utils.toArray('.scroll-anim').forEach((el) => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            gsap.utils.toArray('.scroll-anim-left').forEach((el) => {
                gsap.fromTo(el, 
                    { x: -50, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            gsap.utils.toArray('.scroll-anim-right').forEach((el) => {
                gsap.fromTo(el, 
                    { x: 50, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Staggered animation for Security Items
            gsap.utils.toArray('.security-item').forEach((item, i) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 15 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: i * 0.15,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.security-list',
                            start: 'top 85%'
                        }
                    }
                );
            });

            // 5. Tab Switching Logic for Features Section
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

            // Subtle parallax effect on mouse move for the background blobs
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;

                gsap.to('.blob-1', { x: x, y: y, duration: 1, ease: 'power1.out' });
                gsap.to('.blob-2', { x: -x * 1.5, y: -y * 1.5, duration: 1, ease: 'power1.out' });
            });

            // 6. Mobile Navigation Drawer & Anchor Links
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
                lenis.stop();
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
                lenis.start();
            }

            if (mobileToggle) {
                mobileToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (mobileMenuDrawer && mobileMenuDrawer.classList.contains('is-open')) {
                        closeMobileMenu();
                    } else {
                        openMobileMenu();
                    }
                });
            }

            if (mobileClose) {
                mobileClose.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeMobileMenu();
                });
            }

            if (mobileMenuOverlay) {
                mobileMenuOverlay.addEventListener('click', () => {
                    closeMobileMenu();
                });
            }

            // Close with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenuDrawer && mobileMenuDrawer.classList.contains('is-open')) {
                    closeMobileMenu();
                }
            });

            // Close on window resize if transitioning to desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 1024 && mobileMenuDrawer && mobileMenuDrawer.classList.contains('is-open')) {
                    closeMobileMenu();
                }
            });

            // 7. Smooth Anchor Navigation (Desktop & Mobile)
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
                            lenis.scrollTo(targetElem, { offset: -80, duration: 1.2 });
                            history.pushState(null, '', hash);
                            return;
                        }
                    }

                    // Se estiver em outra página e clicou no menu mobile, apenas fecha o menu
                    closeMobileMenu();
                });
            });

            // Scroll suave se entrar diretamente com hash na URL
            if (window.location.hash) {
                const targetElem = document.querySelector(window.location.hash);
                if (targetElem) {
                    setTimeout(() => {
                        lenis.scrollTo(targetElem, { offset: -80, duration: 1.2 });
                    }, 400);
                }
            }
        });
