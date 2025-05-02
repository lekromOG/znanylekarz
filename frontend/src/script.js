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

const inPersonButton = document.getElementById('in-person');
const onlineButton = document.getElementById('online');
const locationSearch = document.getElementById('voivodeships');

inPersonButton.addEventListener('click', () => {
    inPersonButton.classList.add('button-active');
    onlineButton.classList.remove('button-active');
    locationSearch.style.display = 'block';
});

onlineButton.addEventListener('click', () => {
    onlineButton.classList.add('button-active');
    inPersonButton.classList.remove('button-active');
    locationSearch.style.display = 'none';
});

fetch('http://localhost:3000/api/doctors')
    .then(response => response.json())
    .then(data => {
        console.log(data); 
    })
    .catch(error => console.error('Error fetching doctors:', error));