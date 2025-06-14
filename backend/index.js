import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import auth from './routers/auth.js';
import doctors from './routers/doctors.js';
import users from './routers/users.js';
import appointmentsRouter from './routers/appointments.js';


const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const app = express();
const PORT = 3000;

const MONGO_URI = 'mongodb+srv://studia:studiaDBaccessPK2025TIP1@studia.ykishkc.mongodb.net/znanylekarz?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use(express.static(path.join(_dirname, '../frontend/src')));
app.use('/img', express.static(path.join(_dirname, '../frontend/img')));

app.use('/api', auth);
app.use('/api/doctors', doctors);
app.use('/api/users', users);
app.use('/api/appointments', appointmentsRouter);

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.get('/Admin', (req, res) => {
    res.sendFile(path.join(_dirname, '../frontend/src/admin.html'));
});

app.get('/logout', (req, res) => {
    res.sendFile(path.join(_dirname, '../frontend/src/logout.html'));
});

app.get('/api/doctors/profile/:id', (req, res) => {
    res.sendFile(path.join(_dirname, '../frontend/src/doctorProfile.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/appointments', (req, res) => {
    res.sendFile(path.join(_dirname, '../frontend/src/appointments.html'));
});