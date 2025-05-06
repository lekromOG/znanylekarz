const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

const MONGO_URI = 'mongodb+srv://studia:studiaDBaccessPK2025TIP1@studia.ykishkc.mongodb.net/znanylekarz?retryWrites=true&w=majority';
// const MONGO_URI = "mongodb+srv://krzysio:krzysio1@cluster0.itstbt5.mongodb.net/";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);

        if (err) return res.sendStatus(403);

        req.user = user;

        next();
    });
}

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
const { error } = require('console');

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
        const allUsers = await users.find(); 
        if (!allUsers || allUsers.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }
        res.json(allUsers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, lastname, email, password, role } = req.body;

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new users({ name, lastname, email, password: hashedPassword, role: role || 'standard' });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to register user' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        
        const { email, password } = req.body;
        const user = await users.findOne({ email });

        if (user) {
            const isPasswordOk = await bcrypt.compare(password, user.password);
            console.log(password);

            if (isPasswordOk) {
                jwt.sign({email}, 'privatekey', {'expiresIn': '1h'}, (err, token) => {
                    if (err) {
                        console.log("JWT ERROR" + err);
                    }
                    res.send(token);
                });
                return res.status(200).json({ message: 'Login successful', user });
            }
        }

        return res.status(400).json({ error: "Invalid credentials" });

    } catch (err) {
        res.status(500).json({ error: "Internal server error." })
    }
});

app.use(authenticateToken, (req, res, next) => {
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