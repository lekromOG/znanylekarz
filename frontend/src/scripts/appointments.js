document.addEventListener('DOMContentLoaded', () => {  
    
    fetchAndSetNav(document.getElementById('nav-links')).then(() => {
        const burgerMenu = document.getElementById('burger-menu');
        const navLinks = document.getElementById('nav-links');
        if (!burgerMenu || !navLinks) return;

        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('phone-nav-active');
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('phone-nav-active');
            }
        });
    });

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
        ul.className = 'appointments-list-ul';
        data.forEach(app => {
            const li = document.createElement('li');
            li.className = 'appointment-item';
            li.innerHTML = `
                <div class="appointment-header">
                    <p>Doctor: ${app.doctorName || '-'}</p> 
                    <p>Patient: ${app.patientName || '-'}</p> 
                    <p>Time: ${app.time} </p> 
                </div>
                <div class="appointment-details" id="appointment-details">
                    <p>Date: ${app.date}</p> 
                </div>
            `;
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.className = 'cancel-appointment-btn';
            cancelBtn.onclick = () => {
                if (confirm('Are you sure you want to cancel this appointment?')) {
                    fetch(`/api/appointments/${app.id}`, {
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
            const detailsDiv = li.querySelector('.appointment-details');
            detailsDiv.appendChild(cancelBtn);
            ul.appendChild(li);
        });
        listDiv.appendChild(ul);
    })
    .catch(() => {
        document.getElementById('appointments-list').innerHTML = '<p>Error loading appointments.</p>';
    });
});