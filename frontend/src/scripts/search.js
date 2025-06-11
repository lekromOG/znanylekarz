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

    const onlineButton = document.getElementById('online');
    const inPersonButton = document.getElementById('in-person');
    const locationSearch = document.getElementById('voivodeship-dropdown');

    // Restore the selected appointment type
    const savedType = localStorage.getItem('appointmentType');
    if (savedType === 'online') {
        onlineButton.classList.add('button-active');
        inPersonButton.classList.remove('button-active');
        locationSearch.style.display = 'none';
    } else if (savedType === 'in-person') {
        inPersonButton.classList.add('button-active');
        onlineButton.classList.remove('button-active');
        locationSearch.style.display = 'block';
    }

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



    function bookAppointment(doctorId, date, time, btn) {
        console.log('Booking:', { doctorId, date, time }); 
        fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ doctorId, date, time })
        })
        .then(async res => {
                if (res.ok) {
                    alert('Appointment booked!');
                    if (btn) {
                        btn.disabled = true;
                        btn.classList.add('unavailable-slot');
                    }
                } else {
                    const data = await res.json();
                    alert(data.error || 'Booking failed');
                }
        });
    }

        fetch(`/api/doctors${apiQuery}`)
            .then(response => response.json())
            .then(data => {
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
                        <div class="doctor-card-header">
                            <h3>${doctor.name}</h3>
                            <p><strong>Rating:</strong> ${doctor.rating ?? 'N/A'}</p>
                        </div>
                        <div class="doctor-card-body">
                            <p><strong>Specialty:</strong> ${doctor.specialty}</p>
                            <p><strong>Location:</strong> ${doctor.location}</p>
                        </div>
                    `;
                    resultsDiv.appendChild(doctorDiv);

                    const slotsDiv = document.createElement('div');
                    slotsDiv.className = 'slots';
                    doctorDiv.appendChild(slotsDiv);

                    console.log(doctor);
                    fetch(`/api/doctors/${doctor.id}/slots?date=${date}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then(res => res.json())
                    .then(slots => {
                        if (slots.length === 0) {
                            slotsDiv.textContent = 'No slots defined for this day.';
                        } else {
                            slots.forEach(slot => {
                            const btn = document.createElement('button');
                            btn.textContent = slot.time;
                           if (slot.available) {
                                btn.onclick = () => {
                                    if (!localStorage.getItem('token')) {
                                        window.location.href = '/register.html'; 
                                        return;
                                    }

                                    bookAppointment(doctor.id, date, slot.time, btn);
                                };
                            } else {
                                btn.disabled = true;
                                btn.classList.add('unavailable-slot');
                            }
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

    const dropdowns = document.querySelectorAll('.custom-dropdown');
    dropdowns.forEach(dropdown => {
        const input = dropdown.querySelector('.dropdown-input');
        const dropdownList = dropdown.querySelector('.dropdown-list');
        const items = dropdownList.querySelectorAll('.dropdown-item');

        input.addEventListener('focus', () => {
            dropdownList.classList.add('show');
        });

        items.forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                input.value = this.textContent.trim();
                dropdownList.classList.remove('show');
                input.blur();
            });
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdownList.classList.remove('show');
            }
        });

        input.addEventListener('input', () => {
            const filter = input.value.toLowerCase();
            items.forEach(item => {
                if (item.textContent.toLowerCase().includes(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    if (inPersonButton && onlineButton && locationSearch) {
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
    }

    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();

            const specialtyInput = document.querySelector('#dropdown-input');
            const locationInput = document.querySelector('#voivodeship-dropdown input');
            const dateInput = document.querySelector('input[type="date"]');
            let specialty = specialtyInput ? specialtyInput.value : '';
            let location = locationInput ? locationInput.value : '';
            let date = dateInput ? dateInput.value : '';

            let appointmentType = '';
            if (document.getElementById('in-person').classList.contains('button-active')) {
                appointmentType = 'in-person';
            } else if (document.getElementById('online').classList.contains('button-active')) {
                appointmentType = 'online';
            }

            const params = [];
            if (specialty) params.push(`specialty=${encodeURIComponent(specialty)}`);
            if (location) params.push(`location=${encodeURIComponent(location)}`);
            if (date) params.push(`date=${encodeURIComponent(date)}`);
            if (appointmentType) params.push(`appointmentType=${encodeURIComponent(appointmentType)}`);
            const query = params.length ? `?${params.join('&')}` : '';

            if (onlineButton.classList.contains('button-active')) {
                localStorage.setItem('appointmentType', 'online');
            } else if (inPersonButton.classList.contains('button-active')) {
                localStorage.setItem('appointmentType', 'in-person');
            }

            window.location.href = `/search.html${query}`;
        });
    }
});


