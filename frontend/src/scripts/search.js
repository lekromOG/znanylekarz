const navigation = document.getElementById('nav-links');
const burgerMenu = document.getElementById('burger-menu');
const navLinks = document.querySelector('.nav-links');

burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('phone-nav-active');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('phone-nav-active');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    fetchAndSetNav(navigation);
});