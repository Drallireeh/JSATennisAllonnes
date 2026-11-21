(() => {
    const buttons = Array.from(document.querySelectorAll('.day-filter[data-day]'));
    const panels = Array.from(document.querySelectorAll('.planning-day[data-day]'));

    function selectDay(day) {
        const panel = panels.find(item => item.dataset.day === day);
        const button = buttons.find(item => item.dataset.day === day);
        // Ne pas masquer le planning si la cible est absente ou invalide.
        if (!panel || !button) return;
        buttons.forEach(item => {
            const selected = item === button;
            item.classList.toggle('active', selected);
            item.setAttribute('aria-pressed', String(selected));
        });
        panels.forEach(item => {
            const selected = item === panel;
            item.classList.toggle('active', selected);
            item.hidden = !selected;
        });
    }

    const status = document.getElementById('planning-status');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            selectDay(button.dataset.day);
            if (status) status.textContent = 'Planning du ' + button.textContent.trim().toLowerCase() + ' affiché.';
        });
    });
    const initial = buttons.find(button => button.classList.contains('active')) || buttons[0];
    if (initial) {
        selectDay(initial.dataset.day);
        document.querySelector('.day-filters').hidden = false;
    }
})();
