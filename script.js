/* ===========================
   THE RED RIVER — main.js
   =========================== */

// ── Page map: id → file ──
const PAGE_FILES = {
    home:        'index.html',
    history:     'history.html',
    wastewater:  'wastewater.html',
    environment: 'environment.html'
};

// Detect current page from filename
function getCurrentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    for (const [key, file] of Object.entries(PAGE_FILES)) {
        if (file === path) return key;
    }
    return 'home';
}

// ── Navigation ──
function navigateTo(page) {
    window.location.href = PAGE_FILES[page];
}

function toggleMobile() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

// ── Highlight active nav link ──
function setActiveNav() {
    const current = getCurrentPage();
    document.querySelectorAll('.nav-link').forEach(l => {
        const isActive = l.dataset.page === current;
        l.classList.toggle('active-link', isActive);
        l.classList.toggle('text-white/90', isActive);
        l.classList.toggle('text-white/40', !isActive);
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

    // Immediately reveal anything already in viewport
    requestAnimationFrame(() => {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    });
}

// ── Nav background on scroll ──
function initNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(0,0,0,0.7)';
            nav.style.backdropFilter = 'blur(8px)';
        } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
        }
    });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initNavScroll();
    setTimeout(observeSections, 200);

    // Init Lucide icons if available
    if (window.lucide) lucide.createIcons();
});