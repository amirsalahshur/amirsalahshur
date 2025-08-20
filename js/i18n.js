// Enhanced Internationalization (i18n) System with Error Recovery
class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.fallbackLanguage = 'en';
        this.storageKey = 'portfolio_language';
        this.rtlLanguages = ['ar', 'fa'];
        this.cache = new Map();
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        this.isLoading = false;
        this.loadPromise = null;
        
        this.init();
    }
    
    async init() {
        // Load saved language preference
        const savedLanguage = localStorage.getItem(this.storageKey);
        if (savedLanguage && this.isValidLanguage(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        }
        
        // Load translation files
        await this.loadTranslations();
        
        // Apply translations to current page
        this.translatePage();
        
        // Set document direction for RTL languages
        this.setDocumentDirection();
        
        // Update language selector if it exists
        this.updateLanguageSelector();
    }
    
    async loadTranslations() {
        // Prevent multiple simultaneous loads
        if (this.isLoading) {
            return this.loadPromise;
        }
        
        // Check cache first
        const cacheKey = this.currentLanguage;
        if (this.cache.has(cacheKey)) {
            this.translations = this.cache.get(cacheKey);
            return;
        }
        
        this.isLoading = true;
        this.loadPromise = this.loadTranslationsWithRetry();
        
        try {
            await this.loadPromise;
        } finally {
            this.isLoading = false;
            this.loadPromise = null;
        }
    }
    
    async loadTranslationsWithRetry(attempt = 1) {
        try {
            const response = await fetch(`js/translations/${this.currentLanguage}.json`, {
                cache: 'default',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load ${this.currentLanguage} translations`);
            }
            
            this.translations = await response.json();
            
            // Cache successful translations
            this.cache.set(this.currentLanguage, this.translations);
            
            // Store backup language preference
            localStorage.setItem('portfolio_language_backup', this.currentLanguage);
            
        } catch (error) {
            console.warn(`Translation loading failed for ${this.currentLanguage} (attempt ${attempt}):`, error);
            
            if (attempt < this.retryAttempts) {
                await this.delay(this.retryDelay * attempt);
                return this.loadTranslationsWithRetry(attempt + 1);
            }
            
            // Final attempt: try fallback language
            if (this.currentLanguage !== this.fallbackLanguage) {
                console.warn(`Falling back to ${this.fallbackLanguage}`);
                await this.loadFallbackTranslations();
            } else {
                // Use hardcoded fallbacks as last resort
                this.translations = this.getHardcodedFallbacks();
            }
        }
    }
    
    async loadFallbackTranslations() {
        try {
            const response = await fetch(`js/translations/${this.fallbackLanguage}.json`);
            if (response.ok) {
                this.translations = await response.json();
                this.cache.set(this.fallbackLanguage, this.translations);
            } else {
                this.translations = this.getHardcodedFallbacks();
            }
        } catch (error) {
            console.error('Fallback translation loading failed:', error);
            this.translations = this.getHardcodedFallbacks();
        }
    }
    
    getHardcodedFallbacks() {
        return {
            page_title_home: 'Amir Salahshur - Portfolio',
            page_title_work: 'My Work - Amir Salahshur',
            page_title_about: 'About Me - Amir Salahshur',
            page_title_contact: 'Contact - Amir Salahshur',
            meta_description: 'Passionate software developer crafting innovative solutions with modern technologies.',
            nav: {
                home: 'Home',
                work: 'Work',
                about: 'About',
                contact: 'Contact'
            },
            hero: {
                greeting: 'Hi, I\'m',
                name: 'Amir Salahshur',
                subtitle: 'Passionate software developer crafting innovative solutions with modern technologies.',
                view_work: 'View My Work',
                get_in_touch: 'Get In Touch'
            },
            footer: {
                copyright: '© 2025 Amir Salahshur. All rights reserved.',
                quote: '"Code is poetry written in logic"'
            },
            language_selector: {
                select_language: 'Select Language'
            }
        };
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    translatePage() {
        // Update page title
        const titleKey = this.getPageTitleKey();
        if (titleKey && this.translations[titleKey]) {
            document.title = this.translations[titleKey];
        }
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && this.translations.meta_description) {
            metaDescription.setAttribute('content', this.translations.meta_description);
        }
        
        // Update html lang attribute
        document.documentElement.setAttribute('lang', this.currentLanguage);
        
        // Translate all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Translate elements with data-i18n-placeholder attribute
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });
        
        // Translate elements with data-i18n-title attribute
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.getTranslation(key);
            if (translation) {
                element.setAttribute('title', translation);
            }
        });
        
        // Translate elements with data-i18n-aria-label attribute
        const ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
        ariaElements.forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            const translation = this.getTranslation(key);
            if (translation) {
                element.setAttribute('aria-label', translation);
            }
        });
    }
    
    getPageTitleKey() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageMap = {
            'index.html': 'page_title_home',
            'work.html': 'page_title_work',
            'about.html': 'page_title_about',
            'contact.html': 'page_title_contact'
        };
        return pageMap[currentPage] || 'page_title_home';
    }
    
    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations;
        
        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                return null;
            }
        }
        
        return typeof translation === 'string' ? translation : null;
    }
    
    async changeLanguage(languageCode) {
        if (!this.isValidLanguage(languageCode) || languageCode === this.currentLanguage) {
            return;
        }
        
        const previousLanguage = this.currentLanguage;
        this.currentLanguage = languageCode;
        
        // Show loading state
        this.showLanguageLoadingState();
        
        try {
            // Save preference immediately for faster perceived performance
            localStorage.setItem(this.storageKey, languageCode);
            
            // Use Promise.all for parallel operations where possible
            const [translationsResult] = await Promise.all([
                this.loadTranslations(),
                // Preload fonts for better performance
                this.preloadLanguageFonts(languageCode)
            ]);
            
            // Batch DOM updates for better performance
            this.batchDOMUpdates(() => {
                this.translatePage();
                this.setDocumentDirection();
                this.updateLanguageSelector();
            });
            
            // Hide loading state
            this.hideLanguageLoadingState();
            
            // Trigger custom event for other components
            this.dispatchLanguageChangeEvent(languageCode, previousLanguage);
            
        } catch (error) {
            console.error('Language change failed:', error);
            
            // Hide loading state on error
            this.hideLanguageLoadingState();
            
            // Revert to previous language
            this.currentLanguage = previousLanguage;
            localStorage.setItem(this.storageKey, previousLanguage);
            
            // Attempt graceful recovery
            await this.handleLanguageChangeError(previousLanguage);
            
            // Re-throw error for upstream handling
            throw error;
        }
    }
    
    showLanguageLoadingState() {
        document.body.classList.add('language-switching');
        
        // Add loading indicator to language selector
        const selector = document.querySelector('.language-selector-button');
        if (selector) {
            selector.classList.add('loading');
            selector.disabled = true;
        }
    }
    
    hideLanguageLoadingState() {
        document.body.classList.remove('language-switching');
        
        // Remove loading indicator
        const selector = document.querySelector('.language-selector-button');
        if (selector) {
            selector.classList.remove('loading');
            selector.disabled = false;
        }
    }
    
    async preloadLanguageFonts(languageCode) {
        try {
            if (languageCode === 'ar' || languageCode === 'fa') {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap';
                document.head.appendChild(link);
            } else if (languageCode === 'zh') {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;700&display=swap';
                document.head.appendChild(link);
            }
        } catch (error) {
            console.warn('Failed to preload fonts:', error);
        }
    }
    
    batchDOMUpdates(updateFunction) {
        requestAnimationFrame(() => {
            updateFunction();
        });
    }
    
    dispatchLanguageChangeEvent(languageCode, previousLanguage) {
        const event = new CustomEvent('languageChanged', {
            detail: { 
                language: languageCode,
                previousLanguage: previousLanguage,
                timestamp: Date.now()
            }
        });
        
        // Dispatch with a slight delay to ensure DOM updates are complete
        setTimeout(() => {
            window.dispatchEvent(event);
        }, 100);
    }
    
    async handleLanguageChangeError(previousLanguage) {
        try {
            await this.loadTranslations();
            this.batchDOMUpdates(() => {
                this.translatePage();
                this.setDocumentDirection();
                this.updateLanguageSelector();
            });
        } catch (revertError) {
            console.error('Failed to revert language:', revertError);
            // Use hardcoded fallbacks as last resort
            this.translations = this.getHardcodedFallbacks();
            this.translatePage();
        }
    }
    
    setDocumentDirection() {
        const isRTL = this.rtlLanguages.includes(this.currentLanguage);
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        document.body.classList.toggle('rtl', isRTL);
        
        // Enhanced RTL support
        if (isRTL) {
            document.body.style.fontFamily = this.getRTLFontFamily();
            document.body.classList.add('rtl-active');
            
            // Update CSS custom properties for RTL
            document.documentElement.style.setProperty('--text-align', 'right');
            document.documentElement.style.setProperty('--flex-direction', 'row-reverse');
            
            // Add language-specific classes for typography
            document.body.classList.remove('lang-ar', 'lang-fa', 'lang-en', 'lang-ru', 'lang-de', 'lang-fr', 'lang-zh');
            document.body.classList.add(`lang-${this.currentLanguage}`);
            
        } else {
            document.body.style.fontFamily = '';
            document.body.classList.remove('rtl-active');
            
            // Reset CSS custom properties
            document.documentElement.style.setProperty('--text-align', 'left');
            document.documentElement.style.setProperty('--flex-direction', 'row');
            
            // Add language-specific classes for typography
            document.body.classList.remove('lang-ar', 'lang-fa', 'lang-en', 'lang-ru', 'lang-de', 'lang-fr', 'lang-zh');
            document.body.classList.add(`lang-${this.currentLanguage}`);
        }
        
        // Trigger layout recalculation for better rendering
        this.optimizeRTLRendering();
    }
    
    updateLanguageSelector() {
        const selector = document.querySelector('.language-selector select');
        if (selector) {
            selector.value = this.currentLanguage;
        }
        
        // Update language selector button text
        const selectorButton = document.querySelector('.language-selector-button');
        if (selectorButton) {
            const languageNames = {
                'en': 'English',
                'ru': 'Русский',
                'ar': 'العربية',
                'de': 'Deutsch',
                'fr': 'Français',
                'zh': '中文',
                'fa': 'فارسی'
            };
            selectorButton.textContent = languageNames[this.currentLanguage] || 'English';
        }
    }
    
    isValidLanguage(code) {
        const supportedLanguages = ['en', 'ru', 'ar', 'de', 'fr', 'zh', 'fa'];
        return supportedLanguages.includes(code);
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getRTLFontFamily() {
        const fontMap = {
            'ar': "'Noto Sans Arabic', 'Amiri', 'Traditional Arabic', 'Tahoma', sans-serif",
            'fa': "'Vazir', 'Noto Sans Arabic', 'IRANSans', 'Tahoma', sans-serif"
        };
        return fontMap[this.currentLanguage] || '';
    }
    
    optimizeRTLRendering() {
        // Improved RTL rendering optimization
        if (this.rtlLanguages.includes(this.currentLanguage)) {
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                // Add smooth transition class
                document.body.classList.add('language-transition');
                
                // Force layout recalculation
                void document.body.offsetHeight;
                
                // Complete transition
                requestAnimationFrame(() => {
                    document.body.classList.add('rtl-rendered');
                    
                    // Optimize text rendering asynchronously
                    this.optimizeTextRenderingAsync();
                    
                    // Remove transition class after animation
                    setTimeout(() => {
                        document.body.classList.remove('language-transition');
                    }, 300);
                });
            });
        } else {
            // For LTR languages, simple cleanup
            document.body.classList.remove('rtl-rendered');
        }
    }
    
    optimizeTextRenderingAsync() {
        if (this.currentLanguage === 'ar' || this.currentLanguage === 'fa') {
            // Use Intersection Observer for performance
            this.createTextRenderingObserver();
            
            // Handle visible elements immediately
            this.optimizeVisibleText();
            
            // Handle numeric content
            this.handleNumericContent();
        }
    }
    
    createTextRenderingObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.optimizeElementText(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });
            
            // Observe text elements
            const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
            elements.forEach(element => {
                if (element.textContent && element.textContent.trim()) {
                    observer.observe(element);
                }
            });
        } else {
            // Fallback for older browsers
            this.optimizeVisibleText();
        }
    }
    
    optimizeVisibleText() {
        try {
            // Only optimize visible elements
            const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
            
            // Use document fragment for better performance
            const visibleElements = Array.from(elements).filter(element => {
                const rect = element.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            });
            
            // Process in chunks to avoid blocking
            this.processElementsInChunks(visibleElements, 5);
            
        } catch (error) {
            console.error('Failed to optimize visible text:', error);
        }
    }
    
    processElementsInChunks(elements, chunkSize) {
        let index = 0;
        
        const processChunk = () => {
            const chunk = elements.slice(index, index + chunkSize);
            
            chunk.forEach(element => {
                this.optimizeElementText(element);
            });
            
            index += chunkSize;
            
            if (index < elements.length) {
                requestAnimationFrame(processChunk);
            }
        };
        
        processChunk();
    }
    
    optimizeElementText(element) {
        try {
            if (element.textContent && element.textContent.trim()) {
                element.style.fontFeatureSettings = "'liga' 1, 'calt' 1, 'kern' 1";
                element.style.textRendering = 'optimizeQuality';
                element.style.WebkitFontSmoothing = 'antialiased';
                element.style.MozOsxFontSmoothing = 'grayscale';
                
                // Add subtle text shadow for headings
                if (['H1', 'H2', 'H3'].includes(element.tagName)) {
                    element.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
                }
            }
        } catch (error) {
            console.warn('Failed to optimize element text:', error);
        }
    }
    
    handleNumericContent() {
        try {
            // Convert Western numerals to appropriate script if needed
            const numericElements = document.querySelectorAll('.stat-number, .timeline-date, .skill-progress');
            numericElements.forEach(element => {
                try {
                    // Keep Western numerals but ensure proper direction
                    element.style.direction = 'ltr';
                    element.style.unicodeBidi = 'embed';
                } catch (elementError) {
                    console.warn('Failed to handle numeric content for element:', elementError);
                }
            });
        } catch (error) {
            console.error('Failed to handle numeric content:', error);
        }
    }
    
    getSupportedLanguages() {
        return [
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'ru', name: 'Russian', nativeName: 'Русский' },
            { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
            { code: 'de', name: 'German', nativeName: 'Deutsch' },
            { code: 'fr', name: 'French', nativeName: 'Français' },
            { code: 'zh', name: 'Chinese', nativeName: '中文' },
            { code: 'fa', name: 'Persian', nativeName: 'فارسی' }
        ];
    }
}

// Initialize i18n system
const i18n = new I18n();

// Export for use in other scripts
window.i18n = i18n;