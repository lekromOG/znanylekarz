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
                                    <p class="doctor-card-profile-name">${doctor.name}</p>
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
                        <textarea id="review-text" placeholder="Write your review" style="height: 80px; resize: vertical;"></textarea>
                        <div class="submit-review-container">
                            <button id="submit-review-btn" class="submit-button">Submit</button>
                            <div class="review-grade-container">
                                <button type="button" class="rating-btn" data-rating="1">1</button>
                                <button type="button" class="rating-btn" data-rating="2">2</button>
                                <button type="button" class="rating-btn" data-rating="3">3</button>
                                <button type="button" class="rating-btn" data-rating="4">4</button>
                                <button type="button" class="rating-btn" data-rating="5">5</button>
                            </div>
                        </div>
                        </div>
                        <hr>
                        <div class="reviews-container">
                            <div class="reviews-header">
                                <h4>Review Count: (${doctor.opinionsCount})</h4>
                                <h5 id="review-count">Average Rating: (${doctor.rating})</h5>
                            </div>
                            <div id="reviews-list"></div>
                        </div>   
                    </div>
                </div>
            `;

            let isFavorited = false;

            const favoriteBtn = document.getElementById('favorite-btn');
            const favoriteStar = document.getElementById('favorite-star');

            fetch('/api/users/me/favourites', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(res => res.json())
            .then(favourites => {
                const isFavorited = favourites.doctors.some(doc => doc.id === doctorId);
                if (isFavorited) {
                    favoriteStar.style.color = '#FFD700';
                    favoriteStar.innerHTML = '&#9733;';
                } else {
                    favoriteStar.style.color = '#ccc';
                    favoriteStar.innerHTML = '&#9734;';
                }
            });

            favoriteBtn.addEventListener('click', () => {
                if (isFavorited) {
                    fetch('/api/users/me/favourites', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({ doctorId: doctorId })
                    })
                    .then(res => {
                        if (res.ok) {
                            isFavorited = false;
                            favoriteStar.style.color = '#ccc';
                            favoriteStar.innerHTML = '&#9734;';
                        } else {
                            alert('Failed to remove from favorites.');
                        }
                    });
                } else {
                    fetch('/api/users/me/favourites', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({ doctorId: doctorId })
                    })
                    .then(res => {
                        if (res.ok) {
                            isFavorited = true;
                            favoriteStar.style.color = '#FFD700';
                            favoriteStar.innerHTML = '&#9733;';
                        } else {
                            alert('Failed to add to favorites.');
                        }
                    });
                }
            });
            let selectedRating = 0;

            document.querySelectorAll('.rating-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    selectedRating = parseInt(this.getAttribute('data-rating'));
                    document.querySelectorAll('.rating-btn').forEach(star => {
                        star.style.color = parseInt(star.getAttribute('data-rating')) <= selectedRating ? '#FFD700' : '#ccc';
                    });
                });
            });

            
            const submitReviewBtn = document.getElementById('submit-review-btn');
            const reviewTextArea = document.getElementById('review-text');

            submitReviewBtn.addEventListener('click', () => {
                const content = reviewTextArea.value.trim();
                if (!content) {
                    alert('Please write a review before submitting.');
                    return;
                }

                fetch(`/api/doctors/profile/${doctorId}/opinions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ rating: selectedRating, content: content })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert('Review submitted!');
                        location.reload();
                    }
                });
            });




            const reviewsList = document.getElementById('reviews-list');
            reviewsList.innerHTML = doctor.opinions.map(opinion => `
            <div class="review-item" style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                <img src="${opinion.user?.profilePicture || '/img/default-user.png'}" alt="User photo" style="width:48px; height:48px; border-radius:50%; object-fit:cover; margin-right:12px;">
                <div>
                <h4 style="margin:0 0 4px 0;">${opinion.user?.name || 'Anonymous'}</h4>
                <p style="margin:0;">${opinion.content}</p>
                </div>
            </div>
            `).join('');
        });
});