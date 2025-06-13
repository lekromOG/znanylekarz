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

    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get('id');
    if (!doctorId) return;

    fetch(`/api/doctors/profile/${doctorId}`)
        .then(res => res.json())
        .then(doctor => {
            const profileContainer = document.getElementById('profile-container');
            if (!profileContainer) return;

            profileContainer.innerHTML = `
                <div class="doctor-card-container">
                    <div class="doctor-card-inner-container">
                        <div class="doctor-card-image-container">
                            <img src="${doctor.profilePicture}" alt="Doctor Image" class="doctor-image">
                        </div>
                        <div class="doctor-card-text-container">
                            <div class="doctor-card-header">
                                <div class="doctor-card-header-text">
                                    <h3>Doctor:</h3>
                                    <a href="/doctorProfile.html?id=${doctor.id}">${doctor.name}</a>
                                </div>
                                <button id="favorite-btn" title="Add to favorites" style="background:none;border:none;cursor:pointer;font-size:1.5rem;">
                                    <span id="favorite-star" style="color: #ccc;">&#9734;</span>
                                </button>
                            </div>
                            <div class="doctor-card-body">
                                <p>Specialty: ${doctor.specialty}</p>
                                <p>Location: ${doctor.location}</p>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="write-review-container">
                        <h4>Had an appointment? Don't forget to leave a review!</h4>
                        <textarea placeholder="Write your review" style="height: 80px; resize: vertical;"></textarea>
                        <button id="submit-review-btn" class="submit-button">Submit</button>
                        </div>
                        <hr>
                        <div class="reviews-container">
                            <div class="reviews-header">
                                <h4>Review Count: (0)</h4>
                                <h5 id="review-count">Average Rating: (0)</h5>
                            </div>
                            <div id="reviews-list"></div>
                        </div>   
                    </div>
                </div>
            `;

            const favoriteBtn = document.getElementById('favorite-btn');
            const favoriteStar = document.getElementById('favorite-star');
            favoriteBtn.addEventListener('click', () => {
                fetch('/api/users/me/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ doctorId: doctor.id })
                })
                .then(res => {
                    if (res.ok) {
                        favoriteStar.style.color = '#FFD700'; 
                        favoriteStar.innerHTML = '&#9733;'; 
                    } else {
                        alert('Failed to add to favorites.');
                    }
                });
            });
        });
});