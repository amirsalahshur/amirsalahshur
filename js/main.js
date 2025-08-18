class NavigationManager {
    constructor() {
        this.hamburger = null;
        this.navMenu = null;
        this.body = document.body;
        this.scrollProgress = null;
        this.pageTransition = null;
        this.observers = new Set();
        this.timeouts = new Set();
        this.eventListeners = new Map();
        this.boundHandlers = new Map();
        this.destroyed = false;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.createUIElements();
        this.initializePageAnimations();
        this.initializeKeyboardNavigation();
        this.initializeContactForm();
        this.initializeSkillBars();
        this.initializeSmoothScrolling();
        this.initializeTouchEvents();
        this.initializeResizeHandler();
        this.hidePageTransition();
        this.initializeNavigation();
        this.initializeNavigationLinks();
        this.initializeScrollHandling();
        this.initializeObservers();
        this.initializePageNavigation();
        this.initializeScrollAnimations();
    }

    // Add progress bars and loading elements
    createUIElements() {
        // Create scroll progress bar
        this.scrollProgress = document.createElement('div');
        this.scrollProgress.className = 'scroll-progress';
        document.body.appendChild(this.scrollProgress);
        
        // Create page transition overlay
        this.pageTransition = document.createElement('div');
        this.pageTransition.className = 'page-transition';
        this.pageTransition.innerHTML = '<div class="spinner"></div><div>Loading...</div>';
        document.body.appendChild(this.pageTransition);
    }

    // Enhanced hamburger menu with better UX and memory management
    initializeNavigation() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        
        if (this.hamburger && this.navMenu) {
            // Create bound handlers
            const hamburgerClickHandler = (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            };
            
            const escapeKeyHandler = (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            };
            
            const outsideClickHandler = (e) => {
                if (!this.hamburger.contains(e.target) && 
                    !this.navMenu.contains(e.target) && 
                    this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            };
            
            // Store handlers for cleanup
            this.boundHandlers.set('hamburgerClick', hamburgerClickHandler);
            this.boundHandlers.set('escapeKey', escapeKeyHandler);
            this.boundHandlers.set('outsideClick', outsideClickHandler);
            
            // Add event listeners
            this.hamburger.addEventListener('click', hamburgerClickHandler);
            document.addEventListener('keydown', escapeKeyHandler);
            document.addEventListener('click', outsideClickHandler);
            
            // Track listeners for cleanup
            this.eventListeners.set(this.hamburger, ['click']);
            this.eventListeners.set(document, ['keydown', 'click']);
        }
    }
    
    toggleMobileMenu() {
        if (this.destroyed) return;
        
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.body.classList.toggle('menu-open');
        this.body.classList.toggle('nav-open');
        
        // Accessibility: Update aria attributes
        const isExpanded = this.hamburger.classList.contains('active');
        this.hamburger.setAttribute('aria-expanded', isExpanded.toString());
    }
    
    closeMobileMenu() {
        if (this.destroyed) return;
        
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.body.classList.remove('menu-open');
        this.body.classList.remove('nav-open');
        this.hamburger.setAttribute('aria-expanded', 'false');
    }

    // Enhanced navigation link handling
    initializeNavigationLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const clickHandler = (e) => {
                // Close mobile menu
                if (this.hamburger && this.navMenu) {
                    this.closeMobileMenu();
                }
                
                // Add page transition for external links
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                    // Check if it's a different page
                    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                    if (href !== currentPage) {
                        e.preventDefault();
                        this.showPageTransition();
                        setTimeout(() => {
                            window.location.href = href;
                        }, 300);
                    }
                }
            };
            
            const keydownHandler = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            };
            
            link.addEventListener('click', clickHandler);
            link.addEventListener('keydown', keydownHandler);
            
            // Store handlers for cleanup
            this.boundHandlers.set(`navLink-${link.href}-click`, clickHandler);
            this.boundHandlers.set(`navLink-${link.href}-keydown`, keydownHandler);
            this.eventListeners.set(link, ['click', 'keydown']);
        });
    }

    // Page transition functions
    showPageTransition() {
        if (this.pageTransition) {
            this.pageTransition.classList.add('active');
        }
    }

    hidePageTransition() {
        if (this.pageTransition) {
            setTimeout(() => {
                this.pageTransition.classList.remove('active');
            }, 100);
        }
    }

    // Handle page navigation for multi-page portfolio
    initializePageNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const isCurrentPage = linkHref === currentPage || 
                                  (currentPage === '' && linkHref === 'index.html') ||
                                  (currentPage === 'index.html' && linkHref === 'index.html');
            
            link.classList.toggle('active', isCurrentPage);
        });
    }

    // Active navigation highlighting (only for single-page navigation)
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        if (navLinks.length === 0) return;

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const isCurrent = linkHref === `#${currentSectionId}`;
            link.classList.toggle('active', isCurrent);
        });
    }

    // Enhanced navbar and scroll progress
    updateNavbar() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        // Update navbar styling
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Update scroll progress
        if (this.scrollProgress) {
            this.scrollProgress.style.transform = `scaleX(${Math.min(scrollPercent, 100) / 100})`;
        }
    }

    // Initialize scroll handling
    initializeScrollHandling() {
        // Performance: Use passive listeners for scroll events
        const scrollHandler = this.debounce(() => {
            this.requestTick();
        }, 10);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        this.eventListeners.set(window, ['scroll']);
        this.boundHandlers.set('windowscroll', scrollHandler);
    }

    // Enhanced debounced scroll handler with RAF optimization
    requestTick() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateActiveNav();
                this.updateNavbar();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    // Performance optimization: debounce utility
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Enhanced Intersection Observer for scroll animations with memory management
    initializeObservers() {
        const animationObserverOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.animationObserver = new IntersectionObserver((entries) => {
            if (this.destroyed) return;

            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const timeoutId = setTimeout(() => {
                        if (this.destroyed) return;

                        entry.target.classList.add('animate', 'fade-up');

                        if (entry.target.classList.contains('about-content')) {
                            entry.target.classList.add('fade-left');
                        } else if (entry.target.classList.contains('contact-content')) {
                            entry.target.classList.add('scale-in');
                        }
                    }, index * 100);

                    this.timeouts.add(timeoutId);
                    this.animationObserver.unobserve(entry.target);
                }
            });
        }, animationObserverOptions);

        const lazyObserverOptions = { threshold: 0.1 };

        this.lazyObserver = new IntersectionObserver((entries) => {
            if (this.destroyed) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    try {
                        if (element.dataset.src) {
                            element.src = element.dataset.src;
                            element.classList.remove('lazy');
                        }

                        if (element.classList.contains('animate-on-scroll')) {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                        }

                        this.lazyObserver.unobserve(element);
                    } catch (error) {
                        console.warn('Error in lazy observer:', error);
                    }
                }
            });
        }, lazyObserverOptions);

        this.observers.add(this.animationObserver);
        this.observers.add(this.lazyObserver);
    }

    // Contact form handling
    handleContactForm(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        const projectType = formData.get('project-type');

        const emailBody = `Hello Amir,

` +
                        `Name: ${name}
` +
                        `Email: ${email}
` +
                        (projectType ? `Project Type: ${projectType}
` : '') +
                        `
Message:
${message}

` +
                        `Best regards,
${name}`;

        const mailtoLink = `mailto:amirsalahshur2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    }

    // Enhanced skill progress bar animation
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.dataset.progress;

                    setTimeout(() => {
                        progressBar.style.width = `${progress}%`;
                        progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';

                        const skillItem = progressBar.closest('.skill-item');
                        if (skillItem) {
                            const counter = document.createElement('span');
                            counter.className = 'skill-counter';
                            counter.textContent = '0%';
                            skillItem.appendChild(counter);

                            this.animateCounter(counter, 0, parseInt(progress), 1500);
                        }
                    }, index * 200);

                    skillObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    // Counter animation helper
    animateCounter(element, start, end, duration) {
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * easeOutCubic);

            element.textContent = `${current}%`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Enhanced form functionality
    initializeFormEnhancements(form) {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-wrapper';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            input.addEventListener('focus', () => wrapper.classList.add('focused'));
            input.addEventListener('blur', () => {
                if (!input.value) {
                    wrapper.classList.remove('focused');
                }
            });
            input.addEventListener('input', () => this.validateField(input));

            if (input.value) {
                wrapper.classList.add('focused');
            }
        });
    }

    // Field validation with visual feedback
    validateField(field) {
        const wrapper = field.closest('.input-wrapper') || field.closest('.form-group');
        const isValid = !field.hasAttribute('required') || field.value.trim() !== '';
        const isEmail = field.type === 'email' && field.value;
        const isEmailValid = !isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);

        wrapper.classList.toggle('valid', isValid && isEmailValid);
        wrapper.classList.toggle('invalid', !isValid || !isEmailValid);

        return isValid && isEmailValid;
    }

    // Enhanced scroll animations and performance optimizations
    initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.work-item, .about-content, .contact-content, .timeline-item, .social-card, .skill-category');
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            this.animationObserver.observe(el);
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            this.lazyObserver.observe(img);
        });
    }

    // Smooth reveal animations for page elements
    initializePageAnimations() {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            const timeoutId = setTimeout(() => {
                if (this.destroyed) return;
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
            this.timeouts.add(timeoutId);
        });
    }

    // Enhanced keyboard navigation
    initializeKeyboardNavigation() {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        const keydownHandler = (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                const focusableContent = this.navMenu.querySelectorAll(focusableElements);
                const firstFocusableElement = focusableContent[0];
                const lastFocusableElement = focusableContent[focusableContent.length - 1];
                
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        };
        
        document.addEventListener('keydown', keydownHandler);
        this.boundHandlers.set('documentkeydown', keydownHandler);
        
        // Update event listeners tracking
        const existingEvents = this.eventListeners.get(document) || [];
        this.eventListeners.set(document, [...existingEvents, 'keydown']);
    }

    // Typing animation for hero title (optional enhancement)
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';

        const type = () => {
            if (i < text.length && !this.destroyed) {
                element.innerHTML += text.charAt(i);
                i++;
                const timeoutId = setTimeout(type, speed);
                this.timeouts.add(timeoutId);
            }
        };

        type();
    }

    // Cleanup method to prevent memory leaks
    destroy() {
        this.destroyed = true;

        this.timeouts.forEach(clearTimeout);
        this.timeouts.clear();

        this.eventListeners.forEach((events, element) => {
            events.forEach(eventType => {
                const handlerKey = this.getHandlerKey(element, eventType);
                const handler = this.boundHandlers.get(handlerKey);
                if (handler) {
                    element.removeEventListener(eventType, handler);
                }
            });
        });
        this.eventListeners.clear();
        this.boundHandlers.clear();

        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        if (this.scrollProgress) this.scrollProgress.remove();
        if (this.pageTransition) this.pageTransition.remove();
    }
    
    getHandlerKey(element, eventType) {
        if (element === document) return `document${eventType}`;
        if (element === window) return `window${eventType}`;
        return `${element.className || 'element'}${eventType}`;
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    const navigationManager = new NavigationManager();

    window.addEventListener('beforeunload', () => {
        if (navigationManager) {
            navigationManager.destroy();
            navigationManager = null;
        }
    });

    window.addEventListener('pagehide', () => {
        if (navigationManager) {
            navigationManager.destroy();
            navigationManager = null;
        }
    });
});
