// Performance optimization utilities
class PerformanceManager {
    constructor() {
        this.observers = new Map();
        this.animations = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollProgressBar();
        this.setupLazyLoading();
        this.setupAnimationOptimizations();
        this.setupPageTransitions();
        this.measurePerformance();
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: [0, 0.1, 0.5, 1]
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Apply staggered animations to child elements
                    const children = entry.target.querySelectorAll('[data-stagger]');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
        );
        
        animatedElements.forEach(el => scrollObserver.observe(el));
        this.observers.set('scroll', scrollObserver);
    }

    // Scroll progress bar
    setupScrollProgressBar() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;

        let ticking = false;

        const updateScrollProgress = () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = scrollTop / scrollHeight;
            
            progressBar.style.transform = `scaleX(${scrollProgress})`;
            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollProgress);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }

    // Lazy loading for images
    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this.loadAllImages();
            return;
        }

        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        lazyImageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => lazyImageObserver.observe(img));
        
        this.observers.set('lazy', lazyImageObserver);
    }

    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
        });
    }

    // Animation performance optimizations
    setupAnimationOptimizations() {
        // Reduced motion check
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.classList.add('reduced-motion');
            return;
        }

        // GPU acceleration for animated elements
        const animatedElements = document.querySelectorAll(
            '.hover-lift, .hover-scale, .work-item, .card, .btn'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('gpu-accelerated');
        });

        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.documentElement.style.setProperty('--animation-play-state', 'paused');
            } else {
                document.documentElement.style.setProperty('--animation-play-state', 'running');
            }
        });
    }

    // Page transitions
    setupPageTransitions() {
        const pageTransition = document.querySelector('.page-transition');
        if (!pageTransition) return;

        // Handle internal link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Check if it's an internal link
            if (href.startsWith('/') || href.startsWith('./') || 
                (!href.startsWith('http') && !href.startsWith('mailto:'))) {
                
                e.preventDefault();
                this.transitionToPage(href);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.transitionToPage(location.pathname, false);
        });
    }

    transitionToPage(href, pushState = true) {
        const pageTransition = document.querySelector('.page-transition');
        if (!pageTransition) {
            window.location.href = href;
            return;
        }

        // Show transition overlay
        pageTransition.classList.add('active');

        setTimeout(() => {
            if (pushState) {
                history.pushState(null, '', href);
            }
            window.location.href = href;
        }, 300);
    }

    // Performance measurement
    measurePerformance() {
        if (!('performance' in window)) return;

        // Measure page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                if (perfData) {
                    const metrics = {
                        dns: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
                        tcp: Math.round(perfData.connectEnd - perfData.connectStart),
                        ttfb: Math.round(perfData.responseStart - perfData.requestStart),
                        download: Math.round(perfData.responseEnd - perfData.responseStart),
                        dom: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                        total: Math.round(perfData.loadEventEnd - perfData.navigationStart)
                    };

                    // Log performance metrics (remove in production)
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        console.log('Performance Metrics:', metrics);
                    }

                    // Send to analytics if available
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'page_load_performance', {
                            custom_map: {
                                'metric1': 'ttfb',
                                'metric2': 'total_load_time'
                            },
                            'ttfb': metrics.ttfb,
                            'total_load_time': metrics.total
                        });
                    }
                }
            }, 100);
        });

        // Measure Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('LCP:', Math.round(lastEntry.startTime));
                }
            });

            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // LCP not supported
            }
        }
    }

    // Debounce utility
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle utility
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Resource hint utilities
    addResourceHints() {
        // Preload critical resources
        const criticalResources = [
            { href: '/js/i18n.js', as: 'script' },
            { href: '/js/language-selector.js', as: 'script' },
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            link.crossOrigin = resource.crossOrigin || '';
            document.head.appendChild(link);
        });
    }

    // Memory management
    cleanup() {
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        // Cancel animations
        this.animations.forEach(animation => animation.cancel());
        this.animations.clear();

        // Remove event listeners
        window.removeEventListener('scroll', this.requestScrollUpdate);
        window.removeEventListener('popstate', this.transitionToPage);
    }

    // Critical path CSS loading
    loadCriticalCSS() {
        const criticalCSS = `
            body { margin: 0; font-family: Inter, system-ui, sans-serif; }
            .navbar { position: fixed; top: 0; width: 100%; z-index: 1000; }
            .hero { min-height: 100vh; display: flex; align-items: center; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.appendChild(style);
    }
}

// Initialize performance manager
const performanceManager = new PerformanceManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceManager;
}