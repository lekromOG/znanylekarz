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
        const appointmentType = params.get('appointmentType');

        const apiParams = [];
        if (specialty) apiParams.push(`specialty=${encodeURIComponent(specialty)}`);
        if (location) apiParams.push(`location=${encodeURIComponent(location)}`);
        if (date) apiParams.push(`date=${encodeURIComponent(date)}`);
        if (appointmentType) apiParams.push(`appointmentType=${encodeURIComponent(appointmentType)}`);
        const apiQuery = apiParams.length ? `?${apiParams.join('&')}` : '';



    function bookAppointment(doctorId, date, time) {
        fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ doctorId, date, time })
        })
        .then(res => res.ok ? alert('Appointment booked!') : alert('Booking failed'));
    }

        // Fetch doctors from API and display them
        fetch(`/api/doctors${apiQuery}`)
            .then(response => response.json())
            .then(data => {
                // Create or select the results container
                let resultsDiv = document.querySelector('.search-results');
                if (!resultsDiv) {
                    resultsDiv = document.createElement('div');
                    resultsDiv.className = 'search-results';
                    searchFilter.appendChild(resultsDiv);
                }
                resultsDiv.innerHTML = '';

                if (!data.length) {
                    resultsDiv.innerHTML = '<p>No doctors found matching your criteria.</p>';
                    return;
                }

                data.forEach(doctor => {
                    const doctorDiv = document.createElement('div');
                    doctorDiv.className = 'doctor-card';
                    doctorDiv.innerHTML = `
                        <h3>${doctor.name}</h3>
                        <p><strong>Specialty:</strong> ${doctor.specialty}</p>
                        <p><strong>Location:</strong> ${doctor.location}</p>
                        <p><strong>Rating:</strong> ${doctor.rating ?? 'N/A'}</p>
                        ${doctor.available ? '<span class="badge bg-success">Available</span>' : '<span class="badge bg-secondary">Unavailable</span>'}
                    `;
                    resultsDiv.appendChild(doctorDiv);

                         // After creating doctorDiv and appending to resultsDiv:
                    const slotsDiv = document.createElement('div');
                    slotsDiv.className = 'slots';
                    doctorDiv.appendChild(slotsDiv);

                    // Assume you have a selectedDate variable from your search/filter UI
                    fetch(`/api/doctors/${doctor._id}/slots?date=${date}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then(res => res.json())
                    .then(slots => {
                        if (slots.length === 0) {
                            slotsDiv.textContent = 'No available slots for this day.';
                        } else {
                            slots.forEach(time => {
                                const btn = document.createElement('button');
                                btn.textContent = time;
                                btn.onclick = () => bookAppointment(doctor._id, date, time);
                                slotsDiv.appendChild(btn);
                            });
                        }
                    });
                });
            })
            .catch(error => {
                let resultsDiv = document.querySelector('.search-results');
                if (!resultsDiv) {
                    resultsDiv = document.createElement('div');
                    resultsDiv.className = 'search-results';
                    searchFilter.appendChild(resultsDiv);
                }
                resultsDiv.innerHTML = '<p>Error loading doctor data.</p>';
            });
    }
});


