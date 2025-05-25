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
- **Modern UI:** Built with custom CSS and Bootstrap.
- **Mock Data Generation:** Easily generate mock users for development.

---

## Project Structure

```
znanylekarz/
│
├── backend/
│   ├── index.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── doctors.js
│   │   └── users.js
│   ├── keys/
│   │   ├── privkey.pem
│   │   └── pubkey.pem
│   ├── middlewares/
│   │   └── jwt.js
│   └── routers/
│       ├── auth.js
│       ├── doctors.js
│       └── users.js
│
├── db/
│   ├── doctors.js
│   ├── reviews.js
│   ├── users.js
│   └── scripts/
│       ├── generate_mock_data.py
│       └── requirements.txt
│
├── frontend/
│   ├── img/
│   │   ├── gooddoctor.png
│   │   └── ...
│   └── src/
│       ├── index.html
│       ├── search.html
│       ├── register.html
│       ├── doctor.html
│       ├── scripts/
│       │   ├── script.js
│       │   ├── search.js
│       │   └── utils.js
│       └── styles/
│           ├── style.css
│           ├── search.css
│           ├── shared.css
│           └── reset.css
│
└── README.md
```

---

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/znanylekarz.git
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

- Use the search tool on the homepage to find doctors.
- Filter results by specialty, location, and date.
- Switch between in-person and online appointments.
- Sign in or register for personalized features.
- Admins and doctors have access to additional navigation options.

---

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6), Bootstrap 5
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Other:** JWT authentication, Python (for mock data generation)

---

## Customization

- Update specialties and filters in the HTML or via backend.
- Modify styles in `frontend/src/styles/` as needed.
- Use `db/scripts/generate_mock_data.py` to generate mock users for development.

---

## License

MIT

---

*This project is for educational purposes and not affiliated with znanylekarz.pl.*