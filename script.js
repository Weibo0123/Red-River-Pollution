/* ===========================
   THE RED RIVER — main.js
   =========================== */

// ── Page map: id → file ──
const PAGE_FILES = {
    home:         'index.html',
    history:      'history.html',
    wastewater:   'wastewater.html',
    environment:  'environment.html',
    bibliography: 'bibliography.html'
};

const NAV_LINKS = [
    { page: 'home',         label: 'HOME' },
    { page: 'history',      label: 'HISTORY' },
    { page: 'wastewater',   label: 'WASTEWATER' },
    { page: 'environment',  label: 'ENVIRONMENT' },
    { page: 'bibliography', label: 'BIBLIOGRAPHY' },
];

// ── Detect current page ──
function getCurrentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    for (const [key, file] of Object.entries(PAGE_FILES)) {
        if (file === path) return key;
    }
    return 'home';
}

// ── Navigate ──
function navigateTo(page) {
    window.location.href = PAGE_FILES[page];
}

// ── Toggle mobile menu ──
function toggleMobile() {
    const menu   = document.getElementById('mobile-menu');
    const icon   = document.getElementById('burger-icon');
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    // swap icon: menu ↔ x
    if (icon) icon.setAttribute('data-lucide', isOpen ? 'menu' : 'x');
    if (window.lucide) lucide.createIcons();
}

// ── Inject nav HTML from one source of truth ──
function injectNav() {
    const root = document.getElementById('nav-root');
    if (!root) return;

    const current = getCurrentPage();

    // Desktop links
    const desktopLinks = NAV_LINKS.map(({ page, label }) => `
        <a class="nav-link text-white/40 cursor-pointer transition-colors duration-300 hover:text-white/80"
           data-page="${page}"
           onclick="navigateTo('${page}')">${label}</a>
    `).join('');

    // Mobile links
    const mobileLinks = NAV_LINKS.map(({ page, label }) => `
        <a class="nav-link block cursor-pointer tracking-widest text-xs text-white/40 transition-colors duration-300 hover:text-white/80"
           data-page="${page}"
           onclick="navigateTo('${page}'); toggleMobile()">${label}</a>
    `).join('');

    root.innerHTML = `
        <nav class="fixed top-0 left-0 w-full z-50 transition-all duration-700" id="main-nav" style="background: transparent;">
            <div class="px-6 md:px-12 py-6 flex items-center justify-between">
                <!-- Logo -->
                <div class="font-display text-lg tracking-widest cursor-pointer text-white/60 hover:text-white/100 transition-colors"
                     onclick="navigateTo('home')">
                    RED RIVER
                </div>
                <!-- Desktop links -->
                <div class="hidden md:flex items-center gap-12 text-xs tracking-widest">
                    ${desktopLinks}
                </div>
                <!-- Burger button -->
                <button class="md:hidden text-white/70 transition-colors hover:text-white" onclick="toggleMobile()">
                    <i id="burger-icon" data-lucide="menu" class="w-5 h-5"></i>
                </button>
            </div>
            <!-- Mobile menu -->
            <div id="mobile-menu" class="hidden md:hidden bg-black/90 backdrop-blur px-6 py-6 space-y-4 border-t border-white/5">
                ${mobileLinks}
            </div>
        </nav>
    `;

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('mobile-menu');
        const nav  = document.getElementById('main-nav');
        if (menu && !menu.classList.contains('hidden') && nav && !nav.contains(e.target)) {
            toggleMobile();
        }
    });

    setActiveNav();
    initNavScroll();
}

// ── Highlight active nav link ──
function setActiveNav() {
    const current = getCurrentPage();
    document.querySelectorAll('.nav-link').forEach(l => {
        const isActive = l.dataset.page === current;
        l.classList.toggle('active-link',   isActive);
        l.classList.toggle('text-white/90', isActive);
        l.classList.toggle('text-white/40', !isActive);
    });
}

// ── Nav background on scroll ──
function initNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background      = 'rgba(0,0,0,0.7)';
            nav.style.backdropFilter  = 'blur(8px)';
        } else {
            nav.style.background      = 'transparent';
            nav.style.backdropFilter  = 'none';
        }
    });
}

// ── Scroll reveal ──
function observeSections() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    requestAnimationFrame(() => {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    injectNav();
    setTimeout(observeSections, 200);
    if (window.lucide) lucide.createIcons();
});
