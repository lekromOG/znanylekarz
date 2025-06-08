document.addEventListener('DOMContentLoaded', () => {
    // Pobierz dane doktora (np. na podstawie tokena lub user_id)
    fetch('/api/doctors/me')
        .then(res => res.json())
        .then(doctor => {
            document.getElementById('doctor-name').value = doctor.name || '';
            document.getElementById('doctor-specialty').value = doctor.specialty || '';
            document.getElementById('doctor-location').value = doctor.location || '';
            document.getElementById('doctor-days').value = doctor.availableDays ? doctor.availableDays.join(', ') : '';
            document.getElementById('doctor-hours').value = doctor.availableHours || '';
        });

    document.getElementById('doctor-profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('doctor-name').value,
            specialty: document.getElementById('doctor-specialty').value,
            location: document.getElementById('doctor-location').value,
            availableDays: document.getElementById('doctor-days').value.split(',').map(d => d.trim()),
            availableHours: document.getElementById('doctor-hours').value
        };
        fetch('/api/doctors/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.ok ? 'Profile updated!' : 'Update failed')
        .then(msg => document.getElementById('profile-message').textContent = msg);
    });
});