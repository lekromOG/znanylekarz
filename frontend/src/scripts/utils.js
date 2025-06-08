function createNavLinks(links, container) {
    container.innerHTML = ""; 
    links.forEach(linkData => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = linkData.href;
        a.textContent = linkData.text;
        li.appendChild(a);
        container.appendChild(li);
    });
}

function fetchAndSetNav(navigation) {
    const token = localStorage.getItem('token');
    return fetch('http://localhost:3000/api/login', {
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
        let links;
        if (data.role === "doctor") {
            links = [
                { href: "index.html", text: "Home" },
                { href: "appointments", text: "Appointments"},
                { href: "doctor.html", text: "My Profile" },
                { href: "logout", text: "Logout" }
            ];
        } else if (data.role === "standard") {
            links = [
                { href: "index.html", text: "Home" },
                { href: "appointments", text: "Appointments"},
                { href: "user.html", text: "My Profile" },
                { href: "logout", text: "Logout" }
            ];
        } else if (data.role === "admin") {
            links = [
                { href: "index.html", text: "Home" },
                { href: "Admin", text: "Admin"},
                { href: "logout", text: "Logout" }
            ];
        } else {
            links = [
                { href: "index.html", text: "Home" },
                { href: "register.html", text: "Sign in" }
            ];
        }
        createNavLinks(links, navigation);
    })
    .catch(error => console.error('Error fetching role:', error));
}