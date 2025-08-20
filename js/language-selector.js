// Enhanced Language Selector Component with Comprehensive Error Handling and Accessibility
class LanguageSelector {
    constructor() {
        this.isOpen = false;
        this.destroyed = false;
        this.isLoading = false;
        this.timeouts = new Set();
        this.eventListeners = new Map();
        this.boundHandlers = new Map();
        this.observers = new Set();
        this.abortController = null;
        this.currentFocusIndex = -1;
        this.supportedLanguages = [
            { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
            { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
            { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
            { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
            { code: 'fa', name: 'فارسی', flag: '🇮🇷', dir: 'rtl' }
        ];
        
        this.init().catch(error => {
            console.error('Language selector initialization failed:', error);
            this.handleInitError();
        });
    }
    
    async init() {
        try {
            // Wait for DOM to be fully ready
            await this.waitForDOM();
            
            // Wait for i18n to be available
            await this.waitForI18n();
            
            // Create the language selector UI
            this.createLanguageSelector();
            
            // Attach all event listeners with proper error handling
            this.attachEventListeners();
            
            // Setup accessibility features
            this.setupAccessibility();
            
            // Setup mobile optimizations
            this.setupMobileOptimizations();
            
            // Setup loading state management
            this.setupLoadingStates();
            
            console.log('Language selector initialized successfully');
            
        } catch (error) {
            console.error('Language selector initialization error:', error);
            throw error;
        }
    }
    
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            } else {
                resolve();
            }
        });
    }
    
    waitForI18n() {
        return new Promise((resolve) => {
            if (window.i18n) {
                resolve();
            } else {
                const checkI18n = () => {
                    if (window.i18n) {
                        resolve();
                    } else {
                        setTimeout(checkI18n, 50);
                    }
                };
                checkI18n();
            }
        });
    }
    
    handleInitError() {
        // Fallback initialization for when things go wrong
        try {
            console.warn('Using fallback language selector initialization');
            setTimeout(() => {
                this.createMinimalSelector();
            }, 1000);
        } catch (fallbackError) {
            console.error('Fallback initialization also failed:', fallbackError);
        }
    }
    
    createLanguageSelector() {
        // Check if language selector already exists
        if (document.querySelector('.language-selector')) {
            console.log('Language selector already exists, updating instead');
            this.updateExistingSelector();
            return;
        }
        
        try {
            // Create language selector container
            const selector = document.createElement('div');
            selector.className = 'language-selector';
            selector.setAttribute('data-testid', 'language-selector');
            selector.innerHTML = this.getLanguageSelectorHTML();
            
            // Insert into navigation with better error handling
            const navContainer = document.querySelector('.nav-container') || 
                                document.querySelector('nav') || 
                                document.querySelector('header');
            
            if (navContainer) {
                // Insert before hamburger menu or at the end
                const hamburger = navContainer.querySelector('.hamburger');
                if (hamburger) {
                    navContainer.insertBefore(selector, hamburger);
                } else {
                    navContainer.appendChild(selector);
                }
            } else {
                // Fallback: append to body
                console.warn('Navigation container not found, appending to body');
                document.body.appendChild(selector);
            }
            
        } catch (error) {
            console.error('Failed to create language selector:', error);
            this.createMinimalSelector();
        }
    }
    
    createMinimalSelector() {
        try {
            const fallbackSelector = document.createElement('div');
            fallbackSelector.className = 'language-selector language-selector-minimal';
            fallbackSelector.innerHTML = `
                <button type="button" class="language-selector-button">
                    <span>🌐</span>
                    <span>Language</span>
                </button>
            `;
            document.body.appendChild(fallbackSelector);
            
            fallbackSelector.addEventListener('click', () => {
                this.showLanguageOptionsModal();
            });
        } catch (error) {
            console.error('Even minimal selector creation failed:', error);
        }
    }
    
    updateExistingSelector() {
        try {
            const existingSelector = document.querySelector('.language-selector');
            if (existingSelector) {
                existingSelector.innerHTML = this.getLanguageSelectorHTML();
                console.log('Updated existing language selector');
            }
        } catch (error) {
            console.error('Failed to update existing selector:', error);
        }
    }
    
    getLanguageSelectorHTML() {
        try {
            const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
            const currentLanguage = this.supportedLanguages.find(lang => lang.code === currentLang) || this.supportedLanguages[0];
            
            const optionsHTML = this.supportedLanguages.map((lang, index) => 
                `<div class="language-option" 
                     data-lang="${lang.code}" 
                     data-dir="${lang.dir}"
                     data-index="${index}"
                     role="option"
                     tabindex="-1"
                     aria-selected="${lang.code === currentLang ? 'true' : 'false'}"
                     ${lang.code === currentLang ? 'data-selected="true"' : ''}>
                    <span class="language-flag" aria-hidden="true">${lang.flag}</span>
                    <span class="language-name">${lang.name}</span>
                    ${lang.code === currentLang ? '<span class="language-check" aria-hidden="true">✓</span>' : ''}
                </div>`
            ).join('');
            
            return `
                <button class="language-selector-button" 
                        type="button"
                        aria-label="Select language. Current: ${currentLanguage.name}"
                        aria-expanded="false"
                        aria-haspopup="listbox"
                        id="language-selector-button">
                    <span class="current-language-flag" aria-hidden="true">${currentLanguage.flag}</span>
                    <span class="current-language-name">${currentLanguage.name}</span>
                    <svg class="language-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                        <path d="M6 8.825L1.175 4 2.587 2.587 6 6.002 9.413 2.587 10.825 4 6 8.825z"/>
                    </svg>
                    <span class="loading-spinner" aria-hidden="true"></span>
                </button>
                <div class="language-dropdown" 
                     role="listbox"
                     aria-labelledby="language-selector-button"
                     aria-hidden="true"
                     id="language-dropdown">
                    <div class="language-dropdown-header" role="presentation">
                        <span data-i18n="language_selector.select_language">Select Language</span>
                    </div>
                    <div class="language-options" role="presentation">
                        ${optionsHTML}
                    </div>
                </div>
                <div class="language-change-feedback" aria-live="polite" aria-atomic="true"></div>
            `;
        } catch (error) {
            console.error('Failed to generate language selector HTML:', error);
            return this.getFallbackHTML();
        }
    }
    
    getFallbackHTML() {
        return `
            <button class="language-selector-button language-selector-fallback" type="button">
                <span>🌐</span>
                <span>Language</span>
            </button>
        `;
    }
    
    attachEventListeners() {
        try {
            const selector = document.querySelector('.language-selector');
            const selectorButton = document.querySelector('.language-selector-button');
            const dropdown = document.querySelector('.language-dropdown');
            const options = document.querySelectorAll('.language-option');
            
            if (!selectorButton) {
                throw new Error('Language selector button not found');
            }
            
            // Main button events with proper error handling
            this.addEventHandler(selectorButton, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!this.isLoading) {
                    this.toggleDropdown();
                }
            });
            
            this.addEventHandler(selectorButton, 'keydown', (e) => {
                this.handleButtonKeydown(e);
            });
            
            // Language option events
            options.forEach((option, index) => {
                this.addEventHandler(option, 'click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const langCode = option.getAttribute('data-lang');
                    if (langCode && !this.isLoading) {
                        this.selectLanguage(langCode);
                    }
                });
                
                this.addEventHandler(option, 'keydown', (e) => {
                    this.handleOptionKeydown(e, index);
                });
                
                this.addEventHandler(option, 'mouseenter', () => {
                    this.currentFocusIndex = index;
                    this.updateFocusVisual();
                });
            });
            
            // Global events
            this.addGlobalEventHandler('click', (e) => {
                if (!e.target.closest('.language-selector') && this.isOpen) {
                    this.closeDropdown();
                }
            });
            
            this.addGlobalEventHandler('keydown', (e) => {
                this.handleGlobalKeydown(e);
            });
            
            // Resize handler for mobile optimization
            this.addGlobalEventHandler('resize', this.debounce(() => {
                if (this.isOpen) {
                    this.updateDropdownPosition();
                }
            }, 150));
            
            // Focus management
            this.addGlobalEventHandler('focusin', (e) => {
                if (!e.target.closest('.language-selector') && this.isOpen) {
                    this.closeDropdown();
                }
            });
            
            console.log('Event listeners attached successfully');
            
        } catch (error) {
            console.error('Failed to attach event listeners:', error);
            this.setupFallbackListeners();
        }
    }
    
    addEventHandler(element, event, handler) {
        try {
            const boundHandler = handler.bind(this);
            element.addEventListener(event, boundHandler, { passive: false });
            
            // Store for cleanup
            const key = `${element.constructor.name}-${event}-${Math.random()}`;
            this.boundHandlers.set(key, { element, event, handler: boundHandler });
            
        } catch (error) {
            console.error(`Failed to add ${event} handler:`, error);
        }
    }
    
    addGlobalEventHandler(event, handler) {
        try {
            const boundHandler = handler.bind(this);
            document.addEventListener(event, boundHandler, { passive: true });
            
            const key = `global-${event}-${Math.random()}`;
            this.boundHandlers.set(key, { element: document, event, handler: boundHandler });
            
        } catch (error) {
            console.error(`Failed to add global ${event} handler:`, error);
        }
    }
    
    setupFallbackListeners() {
        // Minimal event listeners for when main setup fails
        try {
            const button = document.querySelector('.language-selector-button');
            if (button) {
                button.addEventListener('click', () => {
                    console.warn('Using fallback language selector');
                    this.showLanguageOptionsModal();
                });
            }
        } catch (error) {
            console.error('Even fallback listeners failed:', error);
        }
    }
    
    handleButtonKeydown(e) {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (!this.isLoading) {
                    this.toggleDropdown();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!this.isOpen && !this.isLoading) {
                    this.openDropdown();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!this.isOpen && !this.isLoading) {
                    this.openDropdown();
                }
                break;
            case 'Escape':
                if (this.isOpen) {
                    this.closeDropdown();
                }
                break;
        }
    }
    
    handleOptionKeydown(e, index) {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                const langCode = e.target.getAttribute('data-lang');
                if (langCode && !this.isLoading) {
                    this.selectLanguage(langCode);
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.focusNextOption(index);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.focusPreviousOption(index);
                break;
            case 'Home':
                e.preventDefault();
                this.focusFirstOption();
                break;
            case 'End':
                e.preventDefault();
                this.focusLastOption();
                break;
            case 'Escape':
                e.preventDefault();
                this.closeDropdown();
                break;
        }
    }
    
    handleGlobalKeydown(e) {
        if (e.key === 'Escape' && this.isOpen) {
            this.closeDropdown();
        }
    }
    
    focusNextOption(currentIndex) {
        const options = document.querySelectorAll('.language-option');
        const nextIndex = (currentIndex + 1) % options.length;
        this.currentFocusIndex = nextIndex;
        options[nextIndex].focus();
        this.updateFocusVisual();
    }
    
    focusPreviousOption(currentIndex) {
        const options = document.querySelectorAll('.language-option');
        const prevIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
        this.currentFocusIndex = prevIndex;
        options[prevIndex].focus();
        this.updateFocusVisual();
    }
    
    focusFirstOption() {
        const options = document.querySelectorAll('.language-option');
        if (options.length > 0) {
            this.currentFocusIndex = 0;
            options[0].focus();
            this.updateFocusVisual();
        }
    }
    
    focusLastOption() {
        const options = document.querySelectorAll('.language-option');
        if (options.length > 0) {
            const lastIndex = options.length - 1;
            this.currentFocusIndex = lastIndex;
            options[lastIndex].focus();
            this.updateFocusVisual();
        }
    }
    
    updateFocusVisual() {
        const options = document.querySelectorAll('.language-option');
        options.forEach((option, index) => {
            option.classList.toggle('focused', index === this.currentFocusIndex);
        });
    }
    
    setupAccessibility() {
        try {
            // Ensure proper ARIA attributes are set
            const button = document.querySelector('.language-selector-button');
            const dropdown = document.querySelector('.language-dropdown');
            
            if (button && dropdown) {
                // Create unique IDs if they don't exist
                if (!button.id) button.id = 'language-selector-button';
                if (!dropdown.id) dropdown.id = 'language-dropdown';
                
                // Set up ARIA relationships
                button.setAttribute('aria-controls', dropdown.id);
                dropdown.setAttribute('aria-labelledby', button.id);
                
                // Add live region for announcements
                if (!document.querySelector('#language-announcements')) {
                    const liveRegion = document.createElement('div');
                    liveRegion.id = 'language-announcements';
                    liveRegion.setAttribute('aria-live', 'polite');
                    liveRegion.setAttribute('aria-atomic', 'true');
                    liveRegion.style.position = 'absolute';
                    liveRegion.style.left = '-10000px';
                    liveRegion.style.width = '1px';
                    liveRegion.style.height = '1px';
                    liveRegion.style.overflow = 'hidden';
                    document.body.appendChild(liveRegion);
                }
            }
            
        } catch (error) {
            console.error('Failed to setup accessibility:', error);
        }
    }
    
    setupMobileOptimizations() {
        try {
            // Add touch event handling
            const button = document.querySelector('.language-selector-button');
            if (button) {
                // Prevent double-tap zoom on mobile
                button.style.touchAction = 'manipulation';
                
                // Add touch feedback
                this.addEventHandler(button, 'touchstart', () => {
                    button.classList.add('touch-active');
                }, { passive: true });
                
                this.addEventHandler(button, 'touchend', () => {
                    setTimeout(() => {
                        button.classList.remove('touch-active');
                    }, 150);
                }, { passive: true });
            }
            
            // Optimize dropdown positioning on mobile
            this.setupMobileDropdownHandling();
            
        } catch (error) {
            console.error('Failed to setup mobile optimizations:', error);
        }
    }
    
    setupMobileDropdownHandling() {
        const isMobile = () => window.innerWidth <= 768;
        
        if (isMobile()) {
            // On mobile, consider using a modal-like approach
            const dropdown = document.querySelector('.language-dropdown');
            if (dropdown) {
                dropdown.classList.add('mobile-optimized');
            }
        }
    }
    
    setupLoadingStates() {
        // Setup loading state visual feedback
        try {
            const button = document.querySelector('.language-selector-button');
            if (button) {
                const spinner = button.querySelector('.loading-spinner');
                if (spinner) {
                    spinner.innerHTML = `
                        <svg class="loading-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                    `;
                }
            }
        } catch (error) {
            console.error('Failed to setup loading states:', error);
        }
    }
    
    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    openDropdown() {
        try {
            const button = document.querySelector('.language-selector-button');
            const dropdown = document.querySelector('.language-dropdown');
            
            if (button && dropdown) {
                // Update ARIA states
                button.setAttribute('aria-expanded', 'true');
                dropdown.setAttribute('aria-hidden', 'false');
                
                // Add CSS classes
                dropdown.classList.add('open');
                button.classList.add('open');
                
                // Update state
                this.isOpen = true;
                
                // Position dropdown correctly
                this.updateDropdownPosition();
                
                // Focus management
                const firstOption = dropdown.querySelector('.language-option');
                if (firstOption) {
                    this.currentFocusIndex = 0;
                    setTimeout(() => {
                        firstOption.focus();
                        this.updateFocusVisual();
                    }, 50);
                }
                
                // Announce to screen readers
                this.announceToScreenReader('Language options opened');
            }
        } catch (error) {
            console.error('Failed to open dropdown:', error);
        }
    }
    
    closeDropdown() {
        try {
            const button = document.querySelector('.language-selector-button');
            const dropdown = document.querySelector('.language-dropdown');
            
            if (button && dropdown) {
                // Update ARIA states
                button.setAttribute('aria-expanded', 'false');
                dropdown.setAttribute('aria-hidden', 'true');
                
                // Remove CSS classes
                dropdown.classList.remove('open');
                button.classList.remove('open');
                
                // Update state
                this.isOpen = false;
                this.currentFocusIndex = -1;
                
                // Return focus to button
                button.focus();
                
                // Announce to screen readers
                this.announceToScreenReader('Language options closed');
            }
        } catch (error) {
            console.error('Failed to close dropdown:', error);
        }
    }
    
    updateDropdownPosition() {
        try {
            const dropdown = document.querySelector('.language-dropdown');
            const button = document.querySelector('.language-selector-button');
            
            if (dropdown && button) {
                const buttonRect = button.getBoundingClientRect();
                const dropdownRect = dropdown.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                
                // Reset positioning
                dropdown.style.top = '';
                dropdown.style.bottom = '';
                dropdown.style.left = '';
                dropdown.style.right = '';
                
                // Check if dropdown should open upward
                const spaceBelow = viewportHeight - buttonRect.bottom;
                const spaceAbove = buttonRect.top;
                const dropdownHeight = dropdownRect.height || 200; // Estimated height
                
                if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                    dropdown.style.bottom = '100%';
                    dropdown.style.marginBottom = '8px';
                } else {
                    dropdown.style.top = '100%';
                    dropdown.style.marginTop = '8px';
                }
                
                // Handle RTL languages
                const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
                if (isRTL) {
                    dropdown.style.left = '0';
                } else {
                    dropdown.style.right = '0';
                }
                
                // Mobile specific positioning
                if (window.innerWidth <= 768) {
                    dropdown.style.right = '0';
                    dropdown.style.left = 'auto';
                    dropdown.style.minWidth = '200px';
                }
            }
        } catch (error) {
            console.error('Failed to update dropdown position:', error);
        }
    }
    
    async selectLanguage(langCode) {
        if (this.isLoading || !langCode) return;
        
        try {
            // Set loading state
            this.setLoadingState(true);
            
            // Get language info
            const selectedLanguage = this.supportedLanguages.find(lang => lang.code === langCode);
            if (!selectedLanguage) {
                throw new Error(`Unsupported language: ${langCode}`);
            }
            
            // Announce language change start
            this.announceToScreenReader(`Changing language to ${selectedLanguage.name}...`);
            
            // Change language through i18n system
            if (window.i18n) {
                await window.i18n.changeLanguage(langCode);
            } else {
                throw new Error('i18n system not available');
            }
            
            // Update the selector display
            this.updateSelectorDisplay(langCode);
            
            // Update selected options
            this.updateSelectedOption(langCode);
            
            // Close dropdown
            this.closeDropdown();
            
            // Show success feedback
            this.showLanguageChangeSuccess(selectedLanguage);
            
            // Announce successful change
            this.announceToScreenReader(`Language changed to ${selectedLanguage.name}`);
            
        } catch (error) {
            console.error('Language change failed:', error);
            this.handleLanguageChangeError(error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    setLoadingState(loading) {
        this.isLoading = loading;
        
        try {
            const button = document.querySelector('.language-selector-button');
            const spinner = document.querySelector('.loading-spinner');
            const arrow = document.querySelector('.language-arrow');
            
            if (button) {
                button.classList.toggle('loading', loading);
                button.disabled = loading;
            }
            
            if (spinner && arrow) {
                if (loading) {
                    spinner.style.display = 'inline-block';
                    arrow.style.display = 'none';
                } else {
                    spinner.style.display = 'none';
                    arrow.style.display = 'inline-block';
                }
            }
            
            // Update ARIA attributes
            if (button) {
                button.setAttribute('aria-busy', loading.toString());
            }
            
        } catch (error) {
            console.error('Failed to set loading state:', error);
        }
    }
    
    updateSelectorDisplay(langCode) {
        try {
            const selectedLanguage = this.supportedLanguages.find(lang => lang.code === langCode);
            if (!selectedLanguage) return;
            
            const flagElement = document.querySelector('.current-language-flag');
            const nameElement = document.querySelector('.current-language-name');
            const button = document.querySelector('.language-selector-button');
            
            if (flagElement) flagElement.textContent = selectedLanguage.flag;
            if (nameElement) nameElement.textContent = selectedLanguage.name;
            if (button) {
                button.setAttribute('aria-label', `Select language. Current: ${selectedLanguage.name}`);
            }
            
        } catch (error) {
            console.error('Failed to update selector display:', error);
        }
    }
    
    updateSelectedOption(langCode) {
        try {
            const options = document.querySelectorAll('.language-option');
            options.forEach(option => {
                const isSelected = option.getAttribute('data-lang') === langCode;
                option.setAttribute('aria-selected', isSelected.toString());
                option.classList.toggle('selected', isSelected);
                
                if (isSelected) {
                    option.setAttribute('data-selected', 'true');
                    // Add checkmark
                    let check = option.querySelector('.language-check');
                    if (!check) {
                        check = document.createElement('span');
                        check.className = 'language-check';
                        check.setAttribute('aria-hidden', 'true');
                        check.textContent = '✓';
                        option.appendChild(check);
                    }
                } else {
                    option.removeAttribute('data-selected');
                    const check = option.querySelector('.language-check');
                    if (check) {
                        check.remove();
                    }
                }
            });
        } catch (error) {
            console.error('Failed to update selected option:', error);
        }
    }
    
    showLanguageChangeSuccess(selectedLanguage) {
        try {
            const feedback = document.querySelector('.language-change-feedback');
            if (feedback) {
                feedback.textContent = `${selectedLanguage.flag} ${selectedLanguage.name}`;
                feedback.classList.add('show');
                
                const timeout = setTimeout(() => {
                    feedback.classList.remove('show');
                    feedback.textContent = '';
                }, 2000);
                
                this.timeouts.add(timeout);
            }
        } catch (error) {
            console.error('Failed to show success feedback:', error);
        }
    }
    
    handleLanguageChangeError(error) {
        try {
            console.error('Language change error:', error);
            
            // Show user-friendly error message
            const feedback = document.querySelector('.language-change-feedback');
            if (feedback) {
                feedback.textContent = 'Language change failed. Please try again.';
                feedback.classList.add('show', 'error');
                
                const timeout = setTimeout(() => {
                    feedback.classList.remove('show', 'error');
                    feedback.textContent = '';
                }, 3000);
                
                this.timeouts.add(timeout);
            }
            
            // Announce error to screen readers
            this.announceToScreenReader('Language change failed. Please try again.');
            
        } catch (handlerError) {
            console.error('Failed to handle language change error:', handlerError);
        }
    }
    
    showLanguageOptionsModal() {
        // Fallback modal for when dropdown fails
        try {
            const modal = document.createElement('div');
            modal.className = 'language-modal';
            modal.innerHTML = `
                <div class="language-modal-content">
                    <h3>Select Language</h3>
                    <div class="language-modal-options">
                        ${this.supportedLanguages.map(lang => `
                            <button type="button" class="language-modal-option" data-lang="${lang.code}">
                                <span>${lang.flag}</span>
                                <span>${lang.name}</span>
                            </button>
                        `).join('')}
                    </div>
                    <button type="button" class="language-modal-close">Close</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            modal.addEventListener('click', (e) => {
                const langCode = e.target.closest('[data-lang]')?.getAttribute('data-lang');
                if (langCode) {
                    this.selectLanguage(langCode);
                    modal.remove();
                } else if (e.target.classList.contains('language-modal-close')) {
                    modal.remove();
                }
            });
            
        } catch (error) {
            console.error('Failed to show language options modal:', error);
        }
    }
    
    announceToScreenReader(message) {
        try {
            const liveRegion = document.querySelector('#language-announcements');
            if (liveRegion) {
                liveRegion.textContent = message;
                
                // Clear after a delay
                const timeout = setTimeout(() => {
                    liveRegion.textContent = '';
                }, 3000);
                
                this.timeouts.add(timeout);
            }
        } catch (error) {
            console.error('Failed to announce to screen reader:', error);
        }
    }
    
    debounce(func, wait) {
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
    
    destroy() {
        this.destroyed = true;
        
        try {
            // Clear all timeouts
            this.timeouts.forEach(timeoutId => {
                clearTimeout(timeoutId);
            });
            this.timeouts.clear();
            
            // Remove all event listeners  
            this.boundHandlers.forEach((handlerInfo) => {
                try {
                    handlerInfo.element.removeEventListener(handlerInfo.event, handlerInfo.handler);
                } catch (error) {
                    console.warn('Failed to remove event listener:', error);
                }
            });
            this.boundHandlers.clear();
            
            // Disconnect observers
            this.observers.forEach(observer => {
                if (observer && typeof observer.disconnect === 'function') {
                    observer.disconnect();
                }
            });
            this.observers.clear();
            
            // Abort any ongoing requests
            if (this.abortController) {
                this.abortController.abort();
            }
            
            console.log('Language selector destroyed successfully');
            
        } catch (error) {
            console.error('Error during language selector destruction:', error);
        }
    }
}

// Global instance management
let languageSelectorInstance = null;

// Initialize language selector when DOM is loaded
function initializeLanguageSelector() {
    try {
        if (!languageSelectorInstance) {
            languageSelectorInstance = new LanguageSelector();
            
            // Store reference for debugging
            if (typeof window !== 'undefined') {
                window.languageSelector = languageSelectorInstance;
            }
        }
    } catch (error) {
        console.error('Failed to initialize language selector:', error);
    }
}

// DOM Content Loaded initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageSelector);
} else {
    // DOM is already loaded
    setTimeout(initializeLanguageSelector, 100);
}

// Cleanup on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
    if (languageSelectorInstance && languageSelectorInstance.destroy) {
        languageSelectorInstance.destroy();
        languageSelectorInstance = null;
    }
});

// Cleanup on page hide (for mobile devices and back/forward cache)
window.addEventListener('pagehide', () => {
    if (languageSelectorInstance && languageSelectorInstance.destroy) {
        languageSelectorInstance.destroy();
        languageSelectorInstance = null;
    }
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && languageSelectorInstance && languageSelectorInstance.isOpen) {
        languageSelectorInstance.closeDropdown();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSelector;
} else if (typeof define === 'function' && define.amd) {
    define([], () => LanguageSelector);
}