document.addEventListener('DOMContentLoaded', () => {
    let availableDays = [];

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
        document.getElementById('doctor-type').value = doctor.online ? 'online' : 'in-person';
        availableDays = doctor.availableDays || [];
        renderAvailableDays();
    });

    document.getElementById('add-day-btn').onclick = function() {
        const day = document.getElementById('add-available-day').value;
        if (day && !availableDays.includes(day)) {
            availableDays.push(day);
            renderAvailableDays();
        }
        document.getElementById('add-available-day').value = '';
    };

    function renderAvailableDays() {
        const ul = document.getElementById('available-days-list');
        ul.innerHTML = '';
        availableDays.forEach(day => {
            const li = document.createElement('li');
            li.textContent = day;
            ul.appendChild(li);
        });
    }

    document.getElementById('doctor-profile-form').onsubmit = function(e) {
        e.preventDefault();
        const type = document.getElementById('doctor-type').value;
        const online = type === 'online'; // true if online, false if in-person

        const data = {
            name: document.getElementById('doctor-name').value,
            specialty: document.getElementById('doctor-specialty').value,
            location: document.getElementById('doctor-location').value,
            availableDays: availableDays,
            online // <-- send this to backend
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

