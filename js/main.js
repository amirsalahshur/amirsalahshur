// Enhanced Mobile Navigation Toggle with animations
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

// Add progress bars and loading elements
function createUIElements() {
    // Create scroll progress bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    // Create page transition overlay
    const pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    pageTransition.innerHTML = '<div class="spinner"></div><div>Loading...</div>';
    document.body.appendChild(pageTransition);
    
    return { scrollProgress, pageTransition };
}

const { scrollProgress, pageTransition } = createUIElements();

// Enhanced hamburger menu with better UX
if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Accessibility: Update aria attributes
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        hamburger.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Enhanced navigation link handling
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Close mobile menu
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
        
        // Add page transition for external links
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            // Check if it's a different page
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (href !== currentPage) {
                e.preventDefault();
                showPageTransition();
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        }
    });
    
    // Add keyboard navigation
    link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
        }
    });
});

// Page transition function
function showPageTransition() {
    if (pageTransition) {
        pageTransition.classList.add('active');
    }
}

function hidePageTransition() {
    if (pageTransition) {
        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 100);
    }
}

// Handle page navigation for multi-page portfolio
function initializePageNavigation() {
    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Active navigation highlighting (only for single-page navigation)
function updateActiveNav() {
    // Only run on pages with sections (like the original single-page layout)
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (navLinks.length === 0) return;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Enhanced navbar and scroll progress
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update navbar styling
    if (navbar) {
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Update scroll progress
    if (scrollProgress) {
        scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
    }
}

// Enhanced Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered animation delay
            setTimeout(() => {
                entry.target.classList.add('animate');
                
                // Add specific animation classes based on element type
                if (entry.target.classList.contains('work-item')) {
                    entry.target.classList.add('fade-up');
                } else if (entry.target.classList.contains('about-content')) {
                    entry.target.classList.add('fade-left');
                } else if (entry.target.classList.contains('contact-content')) {
                    entry.target.classList.add('scale-in');
                } else {
                    entry.target.classList.add('fade-up');
                }
            }, index * 100); // Stagger by 100ms
            
            // Unobserve after animation
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Performance optimization: Intersection Observer for lazy loading
const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Lazy load images
            if (element.dataset.src) {
                element.src = element.dataset.src;
                element.classList.remove('lazy');
            }
            
            // Trigger animations
            if (element.classList.contains('animate-on-scroll')) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
            
            lazyObserver.unobserve(element);
        }
    });
}, { threshold: 0.1 });

// Contact form handling
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const projectType = formData.get('project-type');
    
    // Create email body
    let emailBody = `Hello Amir,\\n\\n`;
    emailBody += `Name: ${name}\\n`;
    emailBody += `Email: ${email}\\n`;
    if (projectType) {
        emailBody += `Project Type: ${projectType}\\n`;
    }
    emailBody += `\\nMessage:\\n${message}\\n\\n`;
    emailBody += `Best regards,\\n${name}`;
    
    // Create mailto link
    const mailtoLink = `mailto:amirsalahshur2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
}

// Enhanced skill progress bar animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                
                // Staggered animation
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                    
                    // Add a subtle bounce effect
                    progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    // Add number counter animation
                    const skillItem = progressBar.closest('.skill-item');
                    if (skillItem) {
                        const counter = document.createElement('span');
                        counter.className = 'skill-counter';
                        counter.textContent = '0%';
                        skillItem.appendChild(counter);
                        
                        animateCounter(counter, 0, parseInt(progress), 1500);
                    }
                }, index * 200);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Counter animation helper
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOutCubic);
        
        element.textContent = current + '%';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Enhanced form functionality
function initializeFormEnhancements(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Add floating label effect
        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        // Add focus/blur animations
        input.addEventListener('focus', () => {
            wrapper.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                wrapper.classList.remove('focused');
            }
        });
        
        // Real-time validation feedback
        input.addEventListener('input', () => {
            validateField(input);
        });
        
        // Check initial state
        if (input.value) {
            wrapper.classList.add('focused');
        }
    });
}

// Field validation with visual feedback
function validateField(field) {
    const wrapper = field.closest('.input-wrapper') || field.closest('.form-group');
    
    // Remove existing validation classes
    wrapper.classList.remove('valid', 'invalid');
    
    // Basic validation
    let isValid = true;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
    }
    
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        isValid = emailRegex.test(field.value);
    }
    
    // Apply validation styling
    if (field.value && isValid) {
        wrapper.classList.add('valid');
    } else if (field.value && !isValid) {
        wrapper.classList.add('invalid');
    }
    
    return isValid;
}

// Enhanced scroll animations and performance optimizations
function initializeScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.work-item, .about-content, .contact-content, .timeline-item, .social-card, .skill-category');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        animationObserver.observe(el);
    });
    
    // Initialize lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        img.classList.add('lazy');
        lazyObserver.observe(img);
    });
}

// Smooth reveal animations for page elements
function initializePageAnimations() {
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Enhanced keyboard navigation
function initializeKeyboardNavigation() {
    // Trap focus in mobile menu when open
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.addEventListener('keydown', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            const focusableContent = navMenu.querySelectorAll(focusableElements);
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
    });
}

// Typing animation for hero title (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Performance optimization: debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced debounced scroll handler with RAF optimization
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActiveNav();
            updateNavbar();
            ticking = false;
        });
        ticking = true;
    }
}

const debouncedScrollHandler = debounce(requestTick, 10);

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initializePageNavigation();
    updateActiveNav();
    updateNavbar();
    initializeScrollAnimations();
    initializePageAnimations();
    initializeKeyboardNavigation();
    hidePageTransition();
    
    // Initialize contact form if it exists
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        initializeFormEnhancements(contactForm);
    }
    
    // Initialize skill bar animations if they exist
    animateSkillBars();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Performance: Use passive listeners for scroll events
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    
    // Add resize handler for responsive adjustments
    window.addEventListener('resize', debounce(() => {
        // Recalculate layouts if needed
        updateNavbar();
    }, 250));
});