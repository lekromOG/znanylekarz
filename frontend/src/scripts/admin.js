document.addEventListener('DOMContentLoaded', () => {

    fetchAndSetNav(document.getElementById('nav-links')).then(() => {
        setupBurgerMenu();
    });

    fetch('/api/users', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
    .then(res => res.json())
    .then(users => {
        const standardUsers = users.filter(user => user.role === 'standard');
        const doctorUsers = users.filter(user => user.role === 'doctor');

        renderUsersList(standardUsers);
        renderDoctorsList(doctorUsers);
    });

    fetch('/api/users', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then(users => {
        const standardUsers = users.filter(user => user.role === 'standard');
        const doctorUsers = users.filter(user => user.role === 'doctor');

        const usersList = document.getElementById('users-list');
        const doctorsList = document.getElementById('doctors-list');

        usersList.innerHTML = standardUsers.map(user => `
            <div class="admin-card">
                <p class="admin-card-text">${user.name || user.email} (${user.role})</p>
                <button data-id="${user._id}" class="delete-user">Delete</button>
            </div>
        `).join('');

        doctorsList.innerHTML = doctorUsers.map(user => `
            <div class="admin-card">
                <p class="admin-card-text">${user.name || user.email} (${user.role})</p>
                <button data-id="${user._id}" class="delete-user">Delete</button>
            </div>
        `).join('');
    });


    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-user')) {
            const userId = e.target.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this user?')) {
                fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(res => {
                    if (res.ok) {
                        // Optionally remove the card from the DOM:
                        e.target.closest('.admin-card').remove();
                    } else {
                        alert('Failed to delete user.');
                    }
                });
            }
        }
    });
});