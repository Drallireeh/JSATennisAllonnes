(() => {
    const toggle = document.getElementById('smartphone-menu');
    const menu = document.getElementById('menu');
    if (!toggle || !menu) return;

    const header = document.querySelector('.header');
    if (header && 'ResizeObserver' in window) {
        const updateHeaderHeight = () => {
            document.documentElement.style.setProperty('--header-height', header.getBoundingClientRect().height + 'px');
        };
        new ResizeObserver(updateHeaderHeight).observe(header);
        updateHeaderHeight();
    }

    const navigation = toggle.closest('nav');
    const mobile = window.matchMedia('(max-width: 1024px)');
    let open = false;

    function setOpen(value, restoreFocus = false) {
        open = mobile.matches && value;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.classList.toggle('open', open);
        menu.classList.toggle('nav-fixed--mobile', open);
        menu.classList.toggle('nav-fixed--desktop', !open);
        menu.hidden = mobile.matches && !open;
        if (restoreFocus) toggle.focus();
    }

    toggle.addEventListener('click', () => setOpen(!open));

    document.addEventListener('keydown', event => {
        if (open && event.key === 'Escape') {
            event.preventDefault();
            setOpen(false, true);
        }
    });

    document.addEventListener('click', event => {
        if (open && !navigation.contains(event.target)) setOpen(false);
    });

    menu.addEventListener('click', event => {
        if (open && event.target.closest('a')) setOpen(false, true);
    });

    // Tab reste libre : fermer une fois le focus sorti de la navigation.
    navigation.addEventListener('focusout', event => {
        if (open && event.relatedTarget && !navigation.contains(event.relatedTarget)) {
            setOpen(false);
        }
    });

    mobile.addEventListener('change', () => {
        const active = document.activeElement;
        const focusWasInMenu = menu.contains(active);
        setOpen(false);
        if (mobile.matches && focusWasInMenu) toggle.focus();
        else if (!mobile.matches && active === toggle) menu.querySelector('a')?.focus();
    });

    navigation.dataset.enhanced = 'true';
    setOpen(false);
})();
