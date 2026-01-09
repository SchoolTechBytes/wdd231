const menuButton = document.getElementById('menuButton');
const primaryNav = document.getElementById('primaryNav');

if (menuButton && primaryNav) {
    menuButton.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', isOpen);
    });

    primaryNav.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && primaryNav.classList.contains('open')) {
            primaryNav.classList.remove('open');
            menuButton.setAttribute('aria-expanded', 'false');
        }
    });
}
