// Internationalization (i18n) System for Portfolio Website
class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.fallbackLanguage = 'en';
        this.storageKey = 'portfolio_language';
        this.rtlLanguages = ['ar', 'fa'];
        
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
        try {
            const response = await fetch(`js/translations/${this.currentLanguage}.json`);
            if (response.ok) {
                this.translations = await response.json();
            } else {
                console.warn(`Failed to load translations for ${this.currentLanguage}, falling back to ${this.fallbackLanguage}`);
                if (this.currentLanguage !== this.fallbackLanguage) {
                    const fallbackResponse = await fetch(`js/translations/${this.fallbackLanguage}.json`);
                    if (fallbackResponse.ok) {
                        this.translations = await fallbackResponse.json();
                    }
                }
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
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
        
        this.currentLanguage = languageCode;
        
        // Save preference
        localStorage.setItem(this.storageKey, languageCode);
        
        // Load new translations
        await this.loadTranslations();
        
        // Apply translations
        this.translatePage();
        
        // Update document direction
        this.setDocumentDirection();
        
        // Update language selector
        this.updateLanguageSelector();
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: languageCode }
        }));
    }
    
    setDocumentDirection() {
        const isRTL = this.rtlLanguages.includes(this.currentLanguage);
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        document.body.classList.toggle('rtl', isRTL);
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