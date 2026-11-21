// Renseigner ici l'identifiant du flux Web Google Analytics 4 du club.
// Tant qu'il est vide, aucun bandeau ni appel à Google n'est effectué.
(() => {
    const measurementId = '';
    if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;

    const storageKey = 'jsa-analytics-consent-v1';
    const maxAge = 180 * 24 * 60 * 60 * 1000;
    const scriptUrl = document.currentScript.src;
    const privacyUrl = new URL('../pages/mentionslegales.html', scriptUrl).href;
    let started = false;
    let returnFocus = null;
    window['ga-disable-' + measurementId] = true;

    function readConsent() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));
            if (saved && ['accepted', 'refused'].includes(saved.choice)
                && Number.isFinite(saved.time) && Date.now() >= saved.time
                && Date.now() - saved.time < maxAge) return saved.choice;
        } catch { /* Le stockage peut être indisponible. */ }
        return null;
    }

    function saveConsent(choice) {
        try {
            localStorage.setItem(storageKey, JSON.stringify({ choice, time: Date.now() }));
            return true;
        } catch { return false; }
    }

    function startAnalytics() {
        window['ga-disable-' + measurementId] = false;
        if (started) return;
        started = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', {
            analytics_storage: 'denied', ad_storage: 'denied',
            ad_user_data: 'denied', ad_personalization: 'denied'
        });
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            // Ne pas transmettre de paramètres de recherche ou d'ancres.
            page_location: location.origin + location.pathname,
            page_referrer: document.referrer.split(/[?#]/)[0],
            cookie_expires: 180 * 24 * 60 * 60,
            cookie_update: false
        });
        const tag = document.createElement('script');
        tag.async = true;
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
        document.head.append(tag);
    }

    function removeAnalyticsCookies() {
        const names = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0]);
        const parts = location.hostname.split('.');
        const domains = [''];
        for (let i = 0; i < parts.length; i++) domains.push(parts.slice(i).join('.'));
        names.filter(name => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)).forEach(name => {
            domains.forEach(domain => {
                document.cookie = name + '=; Max-Age=0; Path=/'
                    + (domain ? '; Domain=' + domain : '') + '; SameSite=Lax';
            });
        });
    }

    const banner = document.createElement('section');
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-labelledby', 'analytics-consent-title');
    banner.hidden = true;
    banner.innerHTML = `
        <h2 id="analytics-consent-title" tabindex="-1">Mesure d’audience</h2>
        <p>Avec votre accord, Google Analytics utilise des cookies pour mesurer la fréquentation du site.
        Vous pouvez refuser et changer d’avis à tout moment via « Gérer les cookies ».
        Votre choix est conservé pendant six mois.
        <a href="${privacyUrl}">En savoir plus</a></p>
        <div class="analytics-consent-actions">
            <button type="button" data-choice="refused">Refuser</button>
            <button type="button" data-choice="accepted">Accepter</button>
        </div>`;
    document.body.append(banner);

    const settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'analytics-settings';
    settings.textContent = 'Gérer les cookies';
    (document.querySelector('.footer .container') || document.body).append(settings);
    settings.addEventListener('click', () => {
        returnFocus = settings;
        banner.hidden = false;
        banner.querySelector('h2').focus();
    });

    banner.querySelectorAll('[data-choice]').forEach(button => {
        button.addEventListener('click', () => {
            const choice = button.dataset.choice;
            // Désactiver immédiatement avant toute autre opération.
            if (choice === 'refused') window['ga-disable-' + measurementId] = true;
            const persisted = saveConsent(choice);
            banner.hidden = true;
            if (choice === 'accepted') startAnalytics();
            else {
                removeAnalyticsCookies();
                // Décharger aussi le script déjà chargé après un retrait du consentement.
                if (started && persisted) { location.reload(); return; }
            }
            (returnFocus || settings).focus();
        });
    });

    // Répercuter un retrait effectué dans un autre onglet.
    window.addEventListener('storage', event => {
        if (event.key !== storageKey && event.key !== null) return;
        const choice = readConsent();
        if (choice !== 'accepted') {
            window['ga-disable-' + measurementId] = true;
            removeAnalyticsCookies();
            if (started) { location.reload(); return; }
        }
        banner.hidden = choice !== null;
        if (choice === 'accepted') startAnalytics();
    });

    const choice = readConsent();
    if (choice === 'accepted') startAnalytics();
    else {
        removeAnalyticsCookies();
        banner.hidden = choice === 'refused';
    }
})();
