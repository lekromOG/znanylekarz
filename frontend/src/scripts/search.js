const navigation = document.getElementById('nav-links');
const burgerMenu = document.getElementById('burger-menu');
const navLinks = document.querySelector('.nav-links');

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


document.addEventListener('DOMContentLoaded', () => {


    var token = localStorage.getItem('token');
    console.log('Token:', token);
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
})