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
const locationSearch = document.getElementById('voivodeship-dropdown');

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

document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.custom-dropdown');

    dropdowns.forEach(dropdown => {
        const input = dropdown.querySelector('.dropdown-input');
        const dropdownList = dropdown.querySelector('.dropdown-list');
        const items = dropdownList.querySelectorAll('.dropdown-item');

        input.addEventListener('focus', () => {
            console.log('Input focused');
            dropdownList.classList.add('show');
        });

        items.forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation(); 
                console.log('Item clicked:', this.textContent.trim());
                input.value = this.textContent.trim();
                console.log('Input value after click:', input.value);
                dropdownList.classList.remove('show'); 
                dropdownList.style.display = '';
                input.blur();
            });
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                console.log('Clicked outside dropdown');
                dropdownList.classList.remove('show');
                dropdownList.style.display = ''; 
            }
        });

        dropdownList.addEventListener('mousedown', (e) => {
            e.preventDefault(); 
            console.log('Clicked inside dropdown list');
        });

        input.addEventListener('input', () => {
            const filter = input.value.toLowerCase();
            console.log('Input value:', input.value);
            items.forEach(item => {
                if (item.textContent.toLowerCase().includes(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

fetch('http://localhost:3000/api/login/verify')
    .then(response => response.json())
    .then(data => {
        console.log(data); 
    })
    .catch(error => console.error('Error fetching doctors:', error));

fetch('http://localhost:3000/api/doctors')
    .then(response => response.json())
    .then(data => {
        console.log(data); 
    })
    .catch(error => console.error('Error fetching doctors:', error));

fetch('http://localhost:3000/api/users')
    .then(response => response.json())
    .then(data => {
        console.log(data); 
    })
    .catch(error => console.error('Error fetching users:', error));