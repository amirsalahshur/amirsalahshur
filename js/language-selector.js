// Language Selector Component
class LanguageSelector {
    constructor() {
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createLanguageSelector();
        this.attachEventListeners();
    }
    
    createLanguageSelector() {
        // Check if language selector already exists
        if (document.querySelector('.language-selector')) {
            return;
        }
        
        // Create language selector container
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = this.getLanguageSelectorHTML();
        
        // Insert into navigation
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            // Insert before hamburger menu
            const hamburger = navContainer.querySelector('.hamburger');
            if (hamburger) {
                navContainer.insertBefore(selector, hamburger);
            } else {
                navContainer.appendChild(selector);
            }
        }
    }
    
    getLanguageSelectorHTML() {
        const supportedLanguages = [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'ar', name: 'العربية', flag: '🇸🇦' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'zh', name: '中文', flag: '🇨🇳' },
            { code: 'fa', name: 'فارسی', flag: '🇮🇷' }
        ];
        
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
        const currentLanguage = supportedLanguages.find(lang => lang.code === currentLang) || supportedLanguages[0];
        
        const optionsHTML = supportedLanguages.map(lang => 
            `<div class="language-option" data-lang="${lang.code}" ${lang.code === currentLang ? 'data-selected="true"' : ''}>
                <span class="language-flag">${lang.flag}</span>
                <span class="language-name">${lang.name}</span>
            </div>`
        ).join('');
        
        return `
            <div class="language-selector-button" aria-label="Language Selector" tabindex="0" role="button">
                <span class="current-language-flag">${currentLanguage.flag}</span>
                <span class="current-language-name">${currentLanguage.name}</span>
                <svg class="language-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 8.825L1.175 4 2.587 2.587 6 6.002 9.413 2.587 10.825 4 6 8.825z"/>
                </svg>
            </div>
            <div class="language-dropdown">
                <div class="language-dropdown-header">
                    <span data-i18n="language_selector.select_language">Select Language</span>
                </div>
                <div class="language-options">
                    ${optionsHTML}
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        // Wait for DOM to be ready and i18n to be loaded
        const attachListeners = () => {
            const selectorButton = document.querySelector('.language-selector-button');
            const dropdown = document.querySelector('.language-dropdown');
            const options = document.querySelectorAll('.language-option');
            
            if (!selectorButton || !dropdown || !options.length) {
                setTimeout(attachListeners, 100);
                return;
            }
            
            // Toggle dropdown
            selectorButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
            
            selectorButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown();
                }
            });
            
            // Language selection
            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const langCode = option.getAttribute('data-lang');
                    this.selectLanguage(langCode);
                });
                
                option.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const langCode = option.getAttribute('data-lang');
                        this.selectLanguage(langCode);
                    }
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.language-selector')) {
                    this.closeDropdown();
                }
            });
            
            // Close dropdown on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeDropdown();
                    selectorButton.focus();
                }
            });
        };
        
        // Start trying to attach listeners
        attachListeners();
    }
    
    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    openDropdown() {
        const dropdown = document.querySelector('.language-dropdown');
        const selectorButton = document.querySelector('.language-selector-button');
        
        if (dropdown && selectorButton) {
            dropdown.classList.add('open');
            selectorButton.classList.add('open');
            this.isOpen = true;
            
            // Focus first option
            const firstOption = dropdown.querySelector('.language-option');
            if (firstOption) {
                firstOption.focus();
            }
        }
    }
    
    closeDropdown() {
        const dropdown = document.querySelector('.language-dropdown');
        const selectorButton = document.querySelector('.language-selector-button');
        
        if (dropdown && selectorButton) {
            dropdown.classList.remove('open');
            selectorButton.classList.remove('open');
            this.isOpen = false;
        }
    }
    
    async selectLanguage(langCode) {
        if (window.i18n) {
            // Add loading state
            document.body.classList.add('language-switching');
            
            try {
                await window.i18n.changeLanguage(langCode);
                this.updateSelectorDisplay(langCode);
                this.closeDropdown();
                
                // Update selected option
                const options = document.querySelectorAll('.language-option');
                options.forEach(option => {
                    option.removeAttribute('data-selected');
                    if (option.getAttribute('data-lang') === langCode) {
                        option.setAttribute('data-selected', 'true');
                    }
                });
                
                // Smooth transition effect
                setTimeout(() => {
                    document.body.classList.remove('language-switching');
                }, 200);
                
                // Show brief success feedback
                this.showLanguageChangeConfirmation(langCode);
                
            } catch (error) {
                console.error('Language change failed:', error);
                document.body.classList.remove('language-switching');
            }
        }
    }
    
    updateSelectorDisplay(langCode) {
        const supportedLanguages = [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'ar', name: 'العربية', flag: '🇸🇦' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'zh', name: '中文', flag: '🇨🇳' },
            { code: 'fa', name: 'فارسی', flag: '🇮🇷' }
        ];
        
        const selectedLanguage = supportedLanguages.find(lang => lang.code === langCode);
        if (selectedLanguage) {
            const flagElement = document.querySelector('.current-language-flag');
            const nameElement = document.querySelector('.current-language-name');
            
            if (flagElement) flagElement.textContent = selectedLanguage.flag;
            if (nameElement) nameElement.textContent = selectedLanguage.name;
        }
    }
    
    showLanguageChangeConfirmation(langCode) {
        const supportedLanguages = [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'ar', name: 'العربية', flag: '🇸🇦' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'zh', name: '中文', flag: '🇨🇳' },
            { code: 'fa', name: 'فارسی', flag: '🇮🇷' }
        ];
        
        const selectedLanguage = supportedLanguages.find(lang => lang.code === langCode);
        if (selectedLanguage) {
            // Create temporary confirmation tooltip
            const confirmation = document.createElement('div');
            confirmation.className = 'language-change-confirmation';
            confirmation.innerHTML = `
                <span class="confirmation-flag">${selectedLanguage.flag}</span>
                <span class="confirmation-text">${selectedLanguage.name}</span>
            `;
            
            const selector = document.querySelector('.language-selector');
            if (selector) {
                selector.appendChild(confirmation);
                
                // Show and hide with animation
                requestAnimationFrame(() => {
                    confirmation.classList.add('show');
                    
                    setTimeout(() => {
                        confirmation.classList.remove('show');
                        setTimeout(() => {
                            if (confirmation.parentNode) {
                                confirmation.parentNode.removeChild(confirmation);
                            }
                        }, 300);
                    }, 1500);
                });
            }
        }
    }
}

// Initialize language selector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for i18n to initialize
    setTimeout(() => {
        new LanguageSelector();
    }, 100);
});