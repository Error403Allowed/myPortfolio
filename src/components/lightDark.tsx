// script.ts

// Define a type for the theme mode for better type safety
type ThemeMode = 'light' | 'dark';

const storageKey = 'theme-mode';

/**
 * Calculates the initial theme setting based on localStorage or system preference.
 */
function getInitialTheme(): ThemeMode {
    const storedTheme = localStorage.getItem(storageKey) as ThemeMode | null;
    if (storedTheme) {
        return storedTheme;
    }
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
}

/**
 * Applies the given theme to the document element and saves it to localStorage.
 */
function applyTheme(theme: ThemeMode): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(storageKey, theme);
    updateButtonText(theme);
}

/**
 * Toggles the theme between light and dark.
 */
function toggleTheme(): void {
    const currentTheme = document.documentElement.getAttribute('data-theme') as ThemeMode;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

/**
 * Updates the button text based on the current theme.
 */
function updateButtonText(theme: ThemeMode): void {
    const toggleBtn = document.getElementById('toggle-mode');
    if (toggleBtn) {
        toggleBtn.textContent = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
    }
}

// Initial application of the theme on page load
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

// Add event listener to the toggle button
document.getElementById('toggle-mode')?.addEventListener('click', toggleTheme);
