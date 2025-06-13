document.addEventListener('DOMContentLoaded', () => {
    fetchAndSetNav(document.getElementById('nav-links')).then(() => {
        const burgerMenu = document.getElementById('burger-menu');
        const navLinks = document.getElementById('nav-links');
        if (!burgerMenu || !navLinks) return;

        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('phone-nav-active');
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('phone-nav-active');
            }
        });
    });
});