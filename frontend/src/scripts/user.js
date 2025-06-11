document.addEventListener('DOMContentLoaded', () => {
    let userData = {};

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

    // Fetch user profile
    fetch('/api/users/me', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then(user => {
        userData = user;
        document.getElementById('view-name').textContent = user.name || '';
        document.getElementById('view-lastname').textContent = user.lastname || '';
        document.getElementById('view-email').textContent = user.email || '';
        document.getElementById('user-name').value = user.name || '';
        document.getElementById('user-lastname').value = user.lastname || '';
        document.getElementById('user-email').value = user.email || '';
    });

    document.getElementById('edit-btn').addEventListener('click', function() {
        document.getElementById('user-profile-view').style.display = 'none';
        document.getElementById('user-profile-form').style.display = 'block';
    });

    document.getElementById('cancel-btn').addEventListener('click', function() {
        document.getElementById('user-profile-form').style.display = 'none';
        document.getElementById('user-profile-view').style.display = 'block';
        document.getElementById('user-name').value = userData.name || '';
        document.getElementById('user-lastname').value = userData.lastname || '';
    });

    document.getElementById('user-profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('user-name').value,
            lastname: document.getElementById('user-lastname').value
        };
        fetch('/api/users/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(updatedUser => {
            userData = updatedUser;
            document.getElementById('view-name').textContent = updatedUser.name || '';
            document.getElementById('view-lastname').textContent = updatedUser.lastname || '';
            document.getElementById('user-profile-form').style.display = 'none';
            document.getElementById('user-profile-view').style.display = 'block';
            document.getElementById('profile-message').textContent = 'Profile updated!';
        })
        .catch(() => {
            document.getElementById('profile-message').textContent = 'Update failed';
        });
    });
});