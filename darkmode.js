class DarkMode {
    constructor() {
        this.theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.toggleBtn = document.getElementById('darkModeToggle');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.setupEventListeners();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateIcon(theme);
    }

    updateIcon(theme) {
        if (!this.toggleBtn) return;
        
        const icon = this.toggleBtn.querySelector('i');
        if (!icon) return;

        const [showIcon, hideIcon] = theme === 'dark' 
            ? ['fa-sun', 'fa-moon'] 
            : ['fa-moon', 'fa-sun'];

        icon.classList.remove(hideIcon);
        icon.classList.add(showIcon);
    }

    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.theme = newTheme;
        this.setTheme(newTheme);
    }

    setupEventListeners() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Initialize dark mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new DarkMode());

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) { 
        const newTheme = e.matches ? 'dark' : 'light';
        const darkMode = new DarkMode();
        darkMode.setTheme(newTheme);
    }
});
window.toggleTheme = function() {
    const darkMode = new DarkMode();
    darkMode.toggleTheme();
};
