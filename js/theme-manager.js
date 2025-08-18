// Dark mode and theme management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme();
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
        this.setupMediaQueryListener();
        this.setupColorSchemeMetaTag();
    }

    getStoredTheme() {
        return localStorage.getItem('theme') || 'auto';
    }

    getPreferredTheme() {
        const storedTheme = this.getStoredTheme();
        
        if (storedTheme !== 'auto') {
            return storedTheme;
        }
        
        return this.mediaQuery.matches ? 'dark' : 'light';
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        const resolvedTheme = theme === 'auto' ? this.getPreferredTheme() : theme;
        
        document.documentElement.setAttribute('data-theme', resolvedTheme);
        this.currentTheme = theme;
        
        // Update color-scheme meta tag
        this.updateColorSchemeMeta(resolvedTheme);
        
        // Emit theme change event
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: resolvedTheme, userChoice: theme }
        }));
    }

    updateColorSchemeMeta(theme) {
        let metaTag = document.querySelector('meta[name="color-scheme"]');
        
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'color-scheme';
            document.head.appendChild(metaTag);
        }
        
        metaTag.content = theme === 'dark' ? 'dark light' : 'light dark';
    }

    setupColorSchemeMetaTag() {
        // Set initial color scheme
        const theme = this.getPreferredTheme();
        this.updateColorSchemeMeta(theme);
    }

    setupMediaQueryListener() {
        this.mediaQuery.addEventListener('change', (e) => {
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
            }
        });
    }

    createThemeToggle() {
        // Check if theme toggle already exists
        if (document.querySelector('.theme-toggle')) return;

        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.innerHTML = this.getToggleIcon();

        // Add to navigation if it exists
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            const languageSelector = navContainer.querySelector('.nav-language-selector');
            if (languageSelector) {
                navContainer.insertBefore(themeToggle, languageSelector);
            } else {
                navContainer.appendChild(themeToggle);
            }
        }

        // Theme toggle styles
        this.addThemeToggleStyles();

        // Event listener
        themeToggle.addEventListener('click', () => {
            this.cycleTheme();
            this.updateToggleIcon(themeToggle);
        });

        // Update icon on theme change
        window.addEventListener('themechange', () => {
            this.updateToggleIcon(themeToggle);
        });
    }

    getToggleIcon() {
        const currentTheme = this.getPreferredTheme();
        
        const icons = {
            light: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>`,
            dark: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>`,
            auto: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>`
        };

        return icons[this.currentTheme] || icons.auto;
    }

    updateToggleIcon(toggleButton) {
        if (toggleButton) {
            toggleButton.innerHTML = this.getToggleIcon();
        }
    }

    cycleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        
        this.setStoredTheme(nextTheme);
        this.applyTheme(nextTheme);
    }

    addThemeToggleStyles() {
        if (document.querySelector('#theme-toggle-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'theme-toggle-styles';
        styles.textContent = `
            .theme-toggle {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                padding: 0;
                margin: 0 var(--space-2, 0.5rem);
                background: var(--color-bg-secondary, #f5f5f5);
                border: 1px solid var(--color-border, #e5e5e5);
                border-radius: var(--radius-lg, 0.5rem);
                color: var(--color-text-secondary, #525252);
                cursor: pointer;
                transition: all var(--transition-fast, 0.15s ease);
                outline: none;
            }

            .theme-toggle:hover {
                background: var(--color-bg-hover, #f9f9f9);
                border-color: var(--color-border-strong, #d4d4d4);
                transform: translateY(-1px);
            }

            .theme-toggle:focus-visible {
                outline: 2px solid var(--color-border-focus, #6366f1);
                outline-offset: 2px;
            }

            .theme-toggle:active {
                transform: translateY(0);
                scale: 0.95;
            }

            .theme-toggle svg {
                transition: transform var(--transition-fast, 0.15s ease);
            }

            .theme-toggle:hover svg {
                transform: rotate(15deg);
            }

            /* Dark mode styles */
            [data-theme="dark"] .theme-toggle {
                background: var(--color-bg-secondary);
                border-color: var(--color-border);
                color: var(--color-text-secondary);
            }

            [data-theme="dark"] .theme-toggle:hover {
                background: var(--color-bg-hover);
                border-color: var(--color-border-strong);
            }

            /* Mobile styles */
            @media (max-width: 768px) {
                .theme-toggle {
                    margin: 0;
                    margin-left: var(--space-2, 0.5rem);
                }
            }

            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .theme-toggle {
                    transition: none;
                }

                .theme-toggle:hover {
                    transform: none;
                }

                .theme-toggle svg {
                    transition: none;
                }

                .theme-toggle:hover svg {
                    transform: none;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // Get current theme for other components
    getCurrentTheme() {
        return {
            stored: this.currentTheme,
            resolved: this.getPreferredTheme()
        };
    }

    // Manual theme setting (for external use)
    setTheme(theme) {
        if (['light', 'dark', 'auto'].includes(theme)) {
            this.setStoredTheme(theme);
            this.applyTheme(theme);
        }
    }

    // Check if dark mode is currently active
    isDarkMode() {
        return this.getPreferredTheme() === 'dark';
    }

    // Preload theme-specific resources
    preloadThemeResources() {
        const theme = this.getPreferredTheme();
        
        // Preload theme-specific images or resources
        if (theme === 'dark') {
            // Preload dark mode specific resources
            const darkModeImages = document.querySelectorAll('[data-src-dark]');
            darkModeImages.forEach(img => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.dataset.srcDark;
                document.head.appendChild(link);
            });
        }
    }

    // Theme-aware image loading
    loadThemeAwareImages() {
        const images = document.querySelectorAll('[data-src-dark]');
        const theme = this.getPreferredTheme();

        images.forEach(img => {
            if (theme === 'dark' && img.dataset.srcDark) {
                img.src = img.dataset.srcDark;
            } else if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    // Initialize theme-aware content
    initThemeAwareContent() {
        // Handle theme-specific content visibility
        const lightOnlyElements = document.querySelectorAll('[data-theme-show="light"]');
        const darkOnlyElements = document.querySelectorAll('[data-theme-show="dark"]');
        
        const updateThemeContent = () => {
            const currentTheme = this.getPreferredTheme();
            
            lightOnlyElements.forEach(el => {
                el.style.display = currentTheme === 'light' ? '' : 'none';
            });
            
            darkOnlyElements.forEach(el => {
                el.style.display = currentTheme === 'dark' ? '' : 'none';
            });
        };

        // Update on theme change
        window.addEventListener('themechange', updateThemeContent);
        
        // Initial update
        updateThemeContent();
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}