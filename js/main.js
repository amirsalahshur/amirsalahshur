// Portfolio Website - Core JavaScript
// Clean, modern, functional implementation

class PortfolioApp {
    constructor() {
        this.isScrolling = false;
        this.destroyed = false;
        this.eventListeners = new Map();
        this.observers = new Set();
        this.timeouts = new Set();
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        try {
            // Initialize core components
            this.initNavigation();
            this.initThemeSystem();
            this.initScrollHandling();
            this.initScrollAnimations();
            this.initPerformanceOptimizations();
            this.initAccessibility();
            this.initCleanupHandlers();
            
            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize portfolio app:', error);
        }
    }

    // === NAVIGATION ===
    initNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!hamburger || !navMenu) {
            console.warn('Navigation elements not found');
            return;
        }

        // Hamburger menu toggle
        this.addEventHandler(hamburger, 'click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu(hamburger, navMenu);
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            this.addEventHandler(link, 'click', () => {
                this.closeMobileMenu(hamburger, navMenu);
            });
        });

        // Close menu when clicking outside
        this.addEventHandler(document, 'click', (e) => {
            if (!hamburger.contains(e.target) && 
                !navMenu.contains(e.target) && 
                navMenu.classList.contains('active')) {
                this.closeMobileMenu(hamburger, navMenu);
            }
        });

        // Close menu with Escape key
        this.addEventHandler(document, 'keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                this.closeMobileMenu(hamburger, navMenu);
                hamburger.focus();
            }
        });

        // Close menu on window resize (if going to desktop)
        this.addEventHandler(window, 'resize', this.debounce(() => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                this.closeMobileMenu(hamburger, navMenu);
            }
        }, 250));

        // Set active nav item based on current page
        this.setActiveNavItem();
    }

    // === THEME SYSTEM ===
    initThemeSystem() {
        // Get saved theme or detect system preference
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;
        
        // Apply initial theme
        this.setTheme(initialTheme);
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.addEventHandler(mediaQuery, 'change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Setup theme toggle buttons
        const themeToggleButtons = document.querySelectorAll('[data-theme-toggle]');
        themeToggleButtons.forEach(button => {
            this.addEventHandler(button, 'click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
                localStorage.setItem('portfolio-theme', newTheme);
            });
        });
        
        // Setup theme selector dropdowns
        const themeSelectors = document.querySelectorAll('[data-theme-selector]');
        themeSelectors.forEach(selector => {
            this.addEventHandler(selector, 'change', (e) => {
                const newTheme = e.target.value;
                this.setTheme(newTheme);
                if (newTheme === 'system') {
                    localStorage.removeItem('portfolio-theme');
                } else {
                    localStorage.setItem('portfolio-theme', newTheme);
                }
            });
        });
    }

    setTheme(theme) {
        const html = document.documentElement;
        const body = document.body;
        
        // Handle system theme
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            theme = systemTheme;
        }
        
        // Apply theme
        html.setAttribute('data-theme', theme);
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(`${theme}-theme`);
        
        // Update theme toggle buttons
        const themeToggleButtons = document.querySelectorAll('[data-theme-toggle]');
        themeToggleButtons.forEach(button => {
            const icon = button.querySelector('i, .icon');
            if (icon) {
                icon.className = theme === 'dark' 
                    ? 'fas fa-sun' 
                    : 'fas fa-moon';
            }
            button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
            button.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        });
        
        // Update theme selectors
        const themeSelectors = document.querySelectorAll('[data-theme-selector]');
        themeSelectors.forEach(selector => {
            const savedTheme = localStorage.getItem('portfolio-theme');
            selector.value = savedTheme || 'system';
        });
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent(theme);
    }

    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { 
                theme: theme,
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }

    toggleMobileMenu(hamburger, navMenu) {
        const isOpen = navMenu.classList.contains('active');
        
        if (isOpen) {
            this.closeMobileMenu(hamburger, navMenu);
        } else {
            this.openMobileMenu(hamburger, navMenu);
        }
    }

    openMobileMenu(hamburger, navMenu) {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('nav-open');
        
        // Accessibility
        hamburger.setAttribute('aria-expanded', 'true');
        
        // Focus first nav link
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 150);
        }
    }

    closeMobileMenu(hamburger, navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        
        // Accessibility
        hamburger.setAttribute('aria-expanded', 'false');
    }

    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === currentPage || 
                           (currentPage === '' && href === 'index.html') ||
                           (currentPage === 'index.html' && href === 'index.html');
            
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    // === SCROLL HANDLING ===
    initScrollHandling() {
        const navbar = document.querySelector('.navbar');
        
        this.addEventHandler(window, 'scroll', this.throttle(() => {
            if (this.isScrolling) return;
            
            this.isScrolling = true;
            requestAnimationFrame(() => {
                // Update navbar on scroll
                if (navbar) {
                    const scrolled = window.scrollY > 50;
                    navbar.classList.toggle('scrolled', scrolled);
                }
                
                this.isScrolling = false;
            });
        }, 16), { passive: true });
    }

    // === SCROLL ANIMATIONS ===
    initScrollAnimations() {
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements with scroll animation classes
            const animatedElements = document.querySelectorAll(
                '.scroll-animate, .scroll-animate-left, .scroll-animate-right'
            );
            
            animatedElements.forEach(el => {
                observer.observe(el);
            });
            
            this.observers.add(observer);
        } else {
            // Fallback for browsers without IntersectionObserver or users who prefer reduced motion
            const animatedElements = document.querySelectorAll(
                '.scroll-animate, .scroll-animate-left, .scroll-animate-right'
            );
            animatedElements.forEach(el => el.classList.add('visible'));
        }
    }

    // === PERFORMANCE OPTIMIZATIONS ===
    initPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
            
            this.observers.add(imageObserver);
        }

        // Preload critical next page
        this.preloadCriticalPages();
    }

    preloadCriticalPages() {
        const criticalPages = ['work.html', 'about.html', 'contact.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        criticalPages.forEach(page => {
            if (page !== currentPage) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            }
        });
    }

    // === ACCESSIBILITY ===
    initAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            this.addEventHandler(skipLink, 'click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Keyboard navigation for custom elements
        this.initKeyboardNavigation();
        
        // Focus management
        this.initFocusManagement();
    }

    initKeyboardNavigation() {
        // Handle Tab trapping in mobile menu
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            this.addEventHandler(navMenu, 'keydown', (e) => {
                if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                    const focusableElements = navMenu.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    }

    initFocusManagement() {
        // Visible focus for keyboard users
        let hadKeyboardEvent = true;
        const keyboardThrottleTimeout = 100;

        const markInput = () => {
            hadKeyboardEvent = false;
            clearTimeout(this.keyboardTimeout);
            this.keyboardTimeout = setTimeout(() => {
                hadKeyboardEvent = true;
            }, keyboardThrottleTimeout);
        };

        this.addEventHandler(document, 'keydown', markInput);
        this.addEventHandler(document, 'mousedown', markInput);

        this.addEventHandler(document, 'focusin', (e) => {
            if (hadKeyboardEvent) {
                e.target.classList.add('keyboard-focused');
            }
        });

        this.addEventHandler(document, 'focusout', (e) => {
            e.target.classList.remove('keyboard-focused');
        });
    }

    // === UTILITIES ===
    addEventHandler(element, event, handler, options = {}) {
        try {
            element.addEventListener(event, handler, options);
            
            // Store for cleanup
            if (!this.eventListeners.has(element)) {
                this.eventListeners.set(element, []);
            }
            this.eventListeners.get(element).push({ event, handler, options });
            
        } catch (error) {
            console.error(`Failed to add ${event} handler:`, error);
        }
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            this.timeouts.add(timeout);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                const timeout = setTimeout(() => inThrottle = false, limit);
                this.timeouts.add(timeout);
            }
        };
    }

    // === CLEANUP ===
    initCleanupHandlers() {
        this.addEventHandler(window, 'beforeunload', () => {
            this.destroy();
        }, { once: true });

        this.addEventHandler(document, 'visibilitychange', () => {
            if (document.hidden) {
                // Pause non-essential operations
                this.pauseOperations();
            } else {
                // Resume operations
                this.resumeOperations();
            }
        });
    }

    pauseOperations() {
        // Close any open menus
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu && hamburger && navMenu.classList.contains('active')) {
            this.closeMobileMenu(hamburger, navMenu);
        }
    }

    resumeOperations() {
        // Resume any paused operations if needed
    }

    destroy() {
        if (this.destroyed) return;
        
        this.destroyed = true;

        try {
            // Clear timeouts
            this.timeouts.forEach(timeout => clearTimeout(timeout));
            this.timeouts.clear();

            // Remove event listeners
            this.eventListeners.forEach((handlers, element) => {
                handlers.forEach(({ event, handler, options }) => {
                    try {
                        element.removeEventListener(event, handler, options);
                    } catch (error) {
                        console.warn('Failed to remove event listener:', error);
                    }
                });
            });
            this.eventListeners.clear();

            // Disconnect observers
            this.observers.forEach(observer => {
                if (observer && typeof observer.disconnect === 'function') {
                    observer.disconnect();
                }
            });
            this.observers.clear();
            
            console.log('Portfolio app cleaned up successfully');
            
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
}

// Initialize the app
const portfolioApp = new PortfolioApp();

// Export for debugging
if (typeof window !== 'undefined') {
    window.portfolioApp = portfolioApp;
}