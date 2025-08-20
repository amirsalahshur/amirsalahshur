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
        this.dependencies = new Set();
        
        // Initialize with dependency checking
        this.initWithDependencies();
    }
    
    async initWithDependencies() {
        try {
            // Wait for critical dependencies
            await this.waitForDependencies();
            
            // Initialize main functionality
            this.init();
            
        } catch (error) {
            console.error('NavigationManager initialization failed:', error);
            
            // Fallback initialization
            this.initFallback();
        }
    }
    
    async waitForDependencies() {
        const dependencies = [
            () => document.readyState === 'interactive' || document.readyState === 'complete',
            () => window.i18n !== undefined,
            () => document.querySelector('.navbar') !== null
        ];
        
        const maxWait = 5000; // 5 seconds
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWait) {
            if (dependencies.every(dep => dep())) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        console.warn('Some dependencies not met, proceeding with initialization');
    }
    
    initFallback() {
        // Minimal initialization for when dependencies fail
        console.log('Using fallback navigation initialization');
        
        // Only initialize critical navigation
        this.initializeNavigation();
        this.initializeScrollHandling();
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

    // Initialize contact form
    initializeContactForm() {
        const contactForm = document.querySelector('#contact-form, .contact-form');
        if (contactForm) {
            const submitHandler = (e) => {
                this.handleContactForm(e);
            };
            
            contactForm.addEventListener('submit', submitHandler);
            this.eventListeners.set(contactForm, ['submit']);
            this.boundHandlers.set('contactFormSubmit', submitHandler);
            
            // Initialize form enhancements
            this.initializeFormEnhancements(contactForm);
        }
    }

    // Initialize skill bars animation
    initializeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress, .skill-bar');
        if (skillBars.length > 0) {
            this.animateSkillBars();
        }
    }

    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            const clickHandler = (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            };
            
            link.addEventListener('click', clickHandler);
            this.eventListeners.set(link, ['click']);
            this.boundHandlers.set(`anchorLink-${link.href}`, clickHandler);
        });
    }

    // Initialize touch events for mobile interactions
    initializeTouchEvents() {
        if ('ontouchstart' in window) {
            const touchElements = document.querySelectorAll('.btn, .work-item, .social-link');
            
            touchElements.forEach(element => {
                const touchStartHandler = () => {
                    element.classList.add('touch-active');
                };
                
                const touchEndHandler = () => {
                    setTimeout(() => {
                        element.classList.remove('touch-active');
                    }, 150);
                };
                
                element.addEventListener('touchstart', touchStartHandler, { passive: true });
                element.addEventListener('touchend', touchEndHandler, { passive: true });
                
                this.eventListeners.set(element, ['touchstart', 'touchend']);
                this.boundHandlers.set(`${element.className}-touchstart`, touchStartHandler);
                this.boundHandlers.set(`${element.className}-touchend`, touchEndHandler);
            });
        }
    }

    // Initialize resize handler for responsive behavior
    initializeResizeHandler() {
        const resizeHandler = this.debounce(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && this.navMenu && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
            
            // Update any responsive elements
            this.updateResponsiveElements();
        }, 250);
        
        window.addEventListener('resize', resizeHandler, { passive: true });
        this.eventListeners.set(window, ['resize']);
        this.boundHandlers.set('windowresize', resizeHandler);
    }

    // Helper method for responsive updates
    updateResponsiveElements() {
        // Update navbar state based on screen size
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.innerWidth <= 768) {
                navbar.classList.add('mobile');
            } else {
                navbar.classList.remove('mobile');
            }
        }
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

// Enhanced initialization with error handling and performance monitoring
class ApplicationManager {
    constructor() {
        this.components = new Map();
        this.initializationStart = performance.now();
        this.criticalPath = true;
        
        this.init();
    }
    
    async init() {
        try {
            // Initialize critical components first
            await this.initializeCriticalComponents();
            
            // Initialize non-critical components with delay
            setTimeout(() => {
                this.initializeNonCriticalComponents();
            }, 100);
            
            // Setup cleanup handlers
            this.setupCleanupHandlers();
            
            // Log performance metrics
            this.logPerformanceMetrics();
            
        } catch (error) {
            console.error('Application initialization failed:', error);
            this.handleInitializationFailure(error);
        }
    }
    
    async initializeCriticalComponents() {
        // Navigation is critical for user interaction
        try {
            const navigationManager = new NavigationManager();
            this.components.set('navigation', navigationManager);
        } catch (error) {
            console.error('Critical component (navigation) failed:', error);
            throw error;
        }
    }
    
    initializeNonCriticalComponents() {
        // Initialize other components that don't block initial render
        const nonCriticalComponents = [
            { name: 'animations', init: () => this.initializeAnimations() },
            { name: 'lazyLoading', init: () => this.initializeLazyLoading() },
            { name: 'serviceWorker', init: () => this.initializeServiceWorker() }
        ];
        
        nonCriticalComponents.forEach(({ name, init }) => {
            try {
                init();
            } catch (error) {
                console.warn(`Non-critical component (${name}) failed:`, error);
            }
        });
    }
    
    initializeAnimations() {
        // Only initialize animations if user prefers them
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Initialize scroll animations, etc.
            this.components.set('animations', true);
        }
    }
    
    initializeLazyLoading() {
        // Initialize lazy loading for images and other resources
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            if (lazyImages.length > 0) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => imageObserver.observe(img));
                this.components.set('lazyLoading', imageObserver);
            }
        }
    }
    
    initializeServiceWorker() {
        // Register service worker if supported and in production
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    this.components.set('serviceWorker', registration);
                })
                .catch(error => {
                    console.warn('Service worker registration failed:', error);
                });
        }
    }
    
    setupCleanupHandlers() {
        const cleanup = () => {
            this.components.forEach((component, name) => {
                try {
                    if (component && typeof component.destroy === 'function') {
                        component.destroy();
                    } else if (component && typeof component.disconnect === 'function') {
                        component.disconnect();
                    }
                } catch (error) {
                    console.warn(`Cleanup failed for ${name}:`, error);
                }
            });
            this.components.clear();
        };
        
        window.addEventListener('beforeunload', cleanup, { once: true });
        window.addEventListener('pagehide', cleanup, { once: true });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause non-essential components when page is hidden
                this.pauseNonEssentialComponents();
            } else {
                // Resume components when page becomes visible
                this.resumeComponents();
            }
        });
    }
    
    pauseNonEssentialComponents() {
        // Pause animations, timers, etc. to save resources
        const navigation = this.components.get('navigation');
        if (navigation && navigation.isOpen) {
            navigation.closeMobileMenu();
        }
    }
    
    resumeComponents() {
        // Resume paused components if needed
        // Currently no action needed, but can be extended
    }
    
    handleInitializationFailure(error) {
        // Graceful degradation when initialization fails
        console.error('Application failed to initialize properly:', error);
        
        // Show user-friendly error message
        const errorElement = document.createElement('div');
        errorElement.className = 'init-error';
        errorElement.innerHTML = `
            <p>Some features may not work properly. Please refresh the page.</p>
            <button onclick="window.location.reload()">Refresh Page</button>
        `;
        
        document.body.appendChild(errorElement);
    }
    
    logPerformanceMetrics() {
        const initTime = performance.now() - this.initializationStart;
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`Application initialized in ${initTime.toFixed(2)}ms`);
            console.log('Initialized components:', Array.from(this.components.keys()));
        }
    }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ApplicationManager();
    });
} else {
    // DOM is already ready
    new ApplicationManager();
}
