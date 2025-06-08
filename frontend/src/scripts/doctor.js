document.addEventListener('DOMContentLoaded', () => {
    let availableDays = [];

    // Fetch doctor profile and populate fields
    fetch('/api/doctors/me', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then(doctor => {
        document.getElementById('doctor-name').value = doctor.name || '';
        document.getElementById('doctor-specialty').value = doctor.specialty || '';
        document.getElementById('doctor-location').value = doctor.location || '';
        document.getElementById('doctor-hours').value = doctor.availableHours || '';
        availableDays = doctor.availableDays || [];
        renderAvailableDays();
    });

    // Add available day
    document.getElementById('add-day-btn').onclick = function() {
        const day = document.getElementById('add-available-day').value;
        if (day && !availableDays.includes(day)) {
            availableDays.push(day);
            renderAvailableDays();
        }
        document.getElementById('add-available-day').value = '';
    };

    // Render available days list
    function renderAvailableDays() {
        const ul = document.getElementById('available-days-list');
        ul.innerHTML = '';
        availableDays.forEach(day => {
            const li = document.createElement('li');
            li.textContent = day;
            ul.appendChild(li);
        });
    }

    // Save doctor profile
    document.getElementById('doctor-profile-form').onsubmit = function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('doctor-name').value,
            specialty: document.getElementById('doctor-specialty').value,
            location: document.getElementById('doctor-location').value,
            availableDays: availableDays,
            availableHours: document.getElementById('doctor-hours').value
        };
        fetch('/api/doctors/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })
        .then(res => res.ok ? 'Profile updated!' : 'Update failed')
        .then(msg => document.getElementById('profile-message').textContent = msg);
    };
});