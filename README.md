# Znany Lekarz

A modern web application for searching, filtering, and booking appointments with doctors.  
This project demonstrates a full-stack approach with a Node.js/Express backend and a responsive frontend using HTML, CSS, JavaScript, and Bootstrap.

---

## Features

- **Doctor Search:** Find doctors by specialty, location, and date.
- **Appointment Types:** Choose between in-person and online appointments.
- **Responsive Design:** Works on desktop and mobile devices.
- **User Authentication:** Role-based navigation for patients, doctors, and admins.
- **Filtering:** Apply filters to search results.
- **Doctor Reviews:** Patients can leave reviews and ratings for doctors.
- **Favorites Management:** Users can add doctors to their favorites list.
- **Admin Panel:** Manage users and doctors with an admin interface.
- **Modern UI:** Built with custom CSS and Bootstrap.
- **Mock Data Generation:** Easily generate mock users for development.

---

## Project Structure

```
znanylekarz/
│
├── backend/
│   ├── index.js                # Main backend entry point
│   ├── controllers/            # Backend controllers
│   │   ├── auth.js             # Authentication logic
│   │   ├── doctors.js          # Doctor-related logic
│   │   └── users.js            # User-related logic
│   ├── dto/                    # Data Transfer Objects
│   │   ├── doctorDTO.js        # Doctor DTOs
│   ├── db/                     # Database schemas
│   │   ├── doctors.js          # Doctor schema
│   │   ├── favourites.js       # Favorites schema
│   │   ├── opinions.js         # Opinions schema
│   │   ├── users.js            # User schema
│   │   └── scripts/            # Utility scripts
│   │       ├── generate_mock_data.py # Mock data generator
│   │       └── requirements.txt # Python dependencies
│   ├── middlewares/            # Middleware logic
│   │   └── jwt.js              # JWT authentication middleware
│   └── routers/                # API routes
│       ├── auth.js             # Authentication routes
│       ├── doctors.js          # Doctor routes
│       ├── users.js            # User routes
│       └── appointments.js     # Appointment routes
│
├── frontend/
│   ├── img/                    # Images
│   │   ├── gooddoctor.png      # Logo
│   ├── src/                    # Frontend source files
│   │   ├── index.html          # Homepage
│   │   ├── search.html         # Search page
│   │   ├── register.html       # Registration page
│   │   ├── doctor.html         # Doctor profile page
│   │   ├── appointments.html   # Appointments page
│   │   ├── admin.html          # Admin panel
│   │   ├── scripts/            # JavaScript files
│   │   │   ├── script.js       # General scripts
│   │   │   ├── utils.js        # Utility functions
│   │   │   ├── doctor_profile.js # Doctor profile logic
│   │   │   ├── admin.js        # Admin panel logic
│   │   ├── styles/             # CSS files
│   │   │   ├── style.css       # General styles
│   │   │   ├── shared.css      # Shared styles
│   │   │   ├── reset.css       # CSS reset
│   │   │   └── doctor.css      # Doctor-specific styles
│
└── README.md                   # Project documentation
```

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Python** (for mock data generation)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/lekromOG/znanylekarz.git
   ```

2. **Install backend dependencies:**
   ```sh
   cd znanylekarz/backend
   npm install
   ```

3. **Run the backend server:**
   ```sh
   npm start
   ```
   The backend will be available at [http://localhost:3000](http://localhost:3000).

4. **Open the frontend:**
   - Open `frontend/src/index.html` in your browser.

---

## Usage

- **Search Doctors:** Use the search tool on the homepage to find doctors by specialty, location, and availability.
- **Book Appointments:** Choose between in-person and online appointments.
- **Leave Reviews:** Share your experience by leaving reviews and ratings for doctors.
- **Manage Favorites:** Add or remove doctors from your favorites list.
- **Admin Features:** Admins can manage users and doctors via the admin panel.

---

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6), Bootstrap 5
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Other:** JWT authentication, Python (for mock data generation)

---

## Customization

- **Specialties and Filters:** Update specialties and filters in the HTML or via backend.
- **Styles:** Modify styles in `frontend/src/styles/` as needed.
- **Mock Data:** Use `db/scripts/generate_mock_data.py` to generate mock users for development.

---

## License

This project is licensed under the [MIT License](LICENSE).

*This project is for educational purposes and not affiliated with znanylekarz.pl.*
