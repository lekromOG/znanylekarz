const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 
const app = express();
const PORT = 3000;


const MONGO_URI = 'mongodb+srv://studia:studiaDBaccessPK2025TIP1@studia.ykishkc.mongodb.net/znanylekarz?retryWrites=true&w=majority';

// MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


// do parsowania JSONa
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend/src')));
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));

const Doctor = require('../db/doctor.js'); 
const users = require('../db/users.js');

// przykładowy endpoint do pobierania lekarzy
app.get('/api/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find(); // zwraca wszystkich lekarzy
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await users.findOne({ email: 'example@example.com' }); 
        if (!users) {
            return res.status(404).json({ error: 'users not found' });
        }
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users information' });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        console.log('Register endpoint hit:', req.body); 
        const { name, lastname, email, password, role } = req.body;

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new users({ name, lastname, email, password, role: role || 'standard' });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        console.error('Error in /api/register:', err); 
        res.status(500).json({ error: 'Failed to register user' });
    }
});

app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
        return next(); 
    }
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '../frontend/src/index.html'));
    } else {
        next();
    }
});

// Start serwera
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});