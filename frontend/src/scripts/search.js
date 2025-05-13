const navigation = document.getElementById('nav-links');
const burgerMenu = document.getElementById('burger-menu');
const navLinks = document.querySelector('.nav-links'); 
const searchFilter = document.getElementById('search-filter');

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

    if (searchFilter) {
        const params = new URLSearchParams(window.location.search);
        const specialty = params.get('specialty');
        const location = params.get('location');
        const date = params.get('date');

        const apiParams = [];
        if (specialty) apiParams.push(`specialty=${encodeURIComponent(specialty)}`);
        if (location) apiParams.push(`location=${encodeURIComponent(location)}`);
        if (date) apiParams.push(`date=${encodeURIComponent(date)}`);
        const apiQuery = apiParams.length ? `?${apiParams.join('&')}` : '';

        console.log('API Query:', apiQuery);
        console.log('api params:', apiParams);

        fetch(`/api/doctors${apiQuery}`)
            .then(response => response.json())
            .then(data => {
                const resultsDiv = document.createElement('div');
                resultsDiv.className = 'doctor-results';
                data.forEach(doctor => {
                    const doctorDiv = document.createElement('div');
                    doctorDiv.className = 'doctor-card';
                    doctorDiv.innerHTML = ``; // Once db structure is known, relevant information will be added here 
                    resultsDiv.appendChild(doctorDiv);
                });
                searchFilter.innerHTML = '';
                searchFilter.appendChild(resultsDiv);
            })
            .catch(error => {
                searchFilter.innerHTML = '<p>Error loading doctor data.</p>';
            });
    }
});

