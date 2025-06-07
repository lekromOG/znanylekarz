const burgerMenu = document.getElementById('burger-menu');
const navLinks = document.querySelector('.nav-links');
const searchButton = document.getElementById('search-button');
const navigation = document.getElementById('nav-links');

function createNavLinks(links, container) {
    links.forEach(linkData => {
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.href = linkData.href;
        a.textContent = linkData.text;
        a.target = "_blank";

        li.appendChild(a);
        container.appendChild(li);
    });
}

burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('phone-nav-active');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('phone-nav-active');
    }
});

searchButton.addEventListener('click', () => {
    window.location.href = 'search.html';
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

    var token = localStorage.getItem('token');

    fetch('http://localhost:3000/api/login', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': "Bearer " + token,
        }
    })
        .then(response => {
            if (!response.ok) {
                const links = [
                    { href: "index.html", text: "Home" },
                    { href: "register.html", text: "Sign in" }
                ];

                createNavLinks(links, navigation);
                throw new Error('Failed to fetch role');
            }
            return response.json();
        })
        .then(data => {
            console.log('User role:', data.role);
            if(data.role == "doctor"){

                const links = [
                    { href: "index.html", text: "Home" },
                    { href: "appointments", text: "Appointments"},
                    { href: "doctor.html", text: "My Profile" },
                    { href: "logout", text: "Logout" }
                ];

                createNavLinks(links, navigation);

            } else if (data.role == "standard"){
                console.log("standardUser")

                const links = [
                    { href: "index.html", text: "Home" },
                    { href: "appointments", text: "Appointments"},
                    { href: "doctor.html", text: "My Profile" },
                    { href: "logout", text: "Logout" }
                ];

                createNavLinks(links, navigation);
            } else if (data.role == "admin"){
                console.log("adminUser")

                const links = [
                    { href: "index.html", text: "Home" },
                    { href: "Admin", text: "Admin"},
                    { href: "logout", text: "Logout" }
                ];

                createNavLinks(links, navigation);
            }else{
                const links = [
                    { href: "index.html", text: "Home" },
                    { href: "register.html", text: "Sign in" }
                ];

                createNavLinks(links, navigation);
            }
        })
        .catch(error => console.error('Error fetching role:', error));
});





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