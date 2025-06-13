document.addEventListener('DOMContentLoaded', () => {
    fetchAndSetNav(document.getElementById('nav-links'));

    fetch('/api/users', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then(users => {
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = users.map(user => `
            <div class="admin-card">
                <strong>${user.name || user.email}</strong> (${user.role})
                <button data-id="${user._id}" class="delete-user">Delete</button>
            </div>
        `).join('');
    });

    fetch('/api/doctors')
        .then(res => res.json())
        .then(doctors => {
            const doctorsList = document.getElementById('doctors-list');
            doctorsList.innerHTML = doctors.map(doc => `
                <div class="admin-card">
                    <strong>${doc.name}</strong> (${doc.specialty}, ${doc.location})
                    <button data-id="${doc._id}" class="delete-doctor">Delete</button>
                </div>
            `).join('');
        });

    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('delete-user')) {
            const id = e.target.getAttribute('data-id');
            fetch(`/api/users/${id}`, { method: 'DELETE' })
                .then(() => location.reload());
        }
        if (e.target.classList.contains('delete-doctor')) {
            const id = e.target.getAttribute('data-id');
            fetch(`/api/doctors/${id}`, { method: 'DELETE' })
                .then(() => location.reload());
        }
    });
});