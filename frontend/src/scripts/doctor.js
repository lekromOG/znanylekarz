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

        const welcome = document.getElementById("doctor-welcome");
        if (welcome && doctor.name) {
            welcome.textContent = `Welcome, Dr. ${doctor.name.split(" ")[0]}!`;
        }

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
        availableDays.forEach((day, idx) => {
            const li = document.createElement('li');
            li.textContent = day;

            // Create a remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.type = 'button';
            removeBtn.style.marginLeft = '10px';
            removeBtn.onclick = function() {
                availableDays.splice(idx, 1);
                renderAvailableDays();
            };

            li.appendChild(removeBtn);
            ul.appendChild(li);
        });
    }

    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
        const input = dropdown.querySelector('.dropdown-input');
        const dropdownList = dropdown.querySelector('.dropdown-list');
        const items = dropdownList.querySelectorAll('.dropdown-item');

        input.addEventListener('focus', (e) => {
            e.stopPropagation();
            dropdownList.classList.add('show');
        });

    items.forEach(item => {
        // Use mousedown instead of click
        item.addEventListener('mousedown', function (e) {
            e.preventDefault(); // Prevent input from refocusing
            e.stopPropagation(); // Prevent global handler
            input.value = this.textContent.trim();
            dropdownList.classList.remove('show');
            input.blur();
        });
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

    // Only one global click handler, outside the forEach!
    document.addEventListener('click', (e) => {
        document.querySelectorAll('.custom-dropdown .dropdown-list').forEach(list => {
            if (!list.parentElement.contains(e.target)) {
                list.classList.remove('show');
            }
        });
    });

    let doctorImageBase64 = "";

    document.getElementById('doctor-image-input').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;
            if (file.size > 20 * 1024 * 1024) { // 2MB limit
                alert('Image is too large! Please select an image under 2MB.');
                return;
            }
        const reader = new FileReader();
        reader.onload = function(e) {
            doctorImageBase64 = e.target.result; // base64 string with data:image/... prefix
            document.getElementById('doctor-image-preview').src = doctorImageBase64;
        };
        reader.readAsDataURL(file);
    });

    fetch('/api/users/me', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then(user => {
        if (user.profilePicture) {
            document.getElementById('doctor-image-preview').src = user.profilePicture;
        }
    });

    document.getElementById('doctor-profile-form').onsubmit = function(e) {
        e.preventDefault();
        const type = document.getElementById('doctor-type').value;
        const online = type === 'online'; // true if online, false if in-person

        const data = {
            name: document.getElementById('doctor-name').value,
            specialty: document.getElementById('doctor-specialty').value,
            location: document.getElementById('doctor-location').value,
            availableDays: availableDays,
            online, // <-- send this to backend
        };

        if (doctorImageBase64) {
            const formData = new FormData();
            const base64Data = doctorImageBase64.split(',')[1];
            formData.append('image', base64Data);

            fetch('/api/users/me/avatar', {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                    // Do NOT set Content-Type! The browser will set it for FormData.
                },
                body: formData
            });
        }

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

