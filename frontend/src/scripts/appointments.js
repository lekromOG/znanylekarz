document.addEventListener('DOMContentLoaded', () => {
    fetchAndSetNav(document.getElementById('nav-links'));

    fetch('/api/appointments', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then(data => {
        const listDiv = document.getElementById('appointments-list');
        if (!data.length) {
            listDiv.innerHTML = '<p>No active appointments.</p>';
            return;
        }
        const ul = document.createElement('ul');
        data.forEach(app => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Date:</strong> ${app.date} 
                <strong>Time:</strong> ${app.time} 
                <strong>Doctor:</strong> ${app.doctorName || '-'}
                <strong>Patient:</strong> ${app.patientName || '-'}
            `;
            // Add cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => {
                if (confirm('Are you sure you want to cancel this appointment?')) {
                    fetch(`/api/appointments/${app._id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then(res => res.json())
                    .then(() => {
                        li.remove();
                    })
                    .catch(() => alert('Failed to cancel appointment'));
                }
            };
            li.appendChild(cancelBtn);
            ul.appendChild(li);
        });
        listDiv.appendChild(ul);
    })
    .catch(() => {
        document.getElementById('appointments-list').innerHTML = '<p>Error loading appointments.</p>';
    });
});