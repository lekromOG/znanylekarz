import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Doctor from '../../db/doctors.js';
import users from '../../db/users.js';
import * as fs from 'node:fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email });

        if (user) {
            const isPasswordOk = await bcrypt.compare(password, user.password);
            if (isPasswordOk) {
                try {
                    var privateKey = fs.readFileSync(path.join(_dirname, '../keys/privkey.pem'), 'utf8');
                    var token = jwt.sign({sub: user._id }, privateKey, { algorithm: 'RS256', expiresIn: "1h"});
                    res.set('Authorization', `Bearer ${token}`);
                    return res
                            .status(200)
                            .json({ message: 'Login successful', token: `${token}`});
                } catch (err) {
                    console.log(err);
                    return res
                            .status(400)
                            .json({ error: "JWT Token error"});
                }
            }
        } return res.status(401).json({ error: "Invalid credentials" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const register = async (req, res) => {
    try {
        const { name, lastname, email, password, role } = req.body;

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new users({ name, lastname, email, password: hashedPassword, role: role || 'standard' });
        const savedUser = await newUser.save();

        // Jeśli rejestruje się doktor, utwórz powiązany wpis w kolekcji doktorów
        if (role === 'doctor') {
            const newDoctor = new Doctor({
                user_id: savedUser._id,
                name: `${name} ${lastname}`,
                specialty: '',   // puste, do uzupełnienia później
                location: '',    // puste, do uzupełnienia później
                online: true
            });
            await newDoctor.save();
        }

        return res.status(201).json(savedUser);

    } catch (err) {
        console.error('Register error:', err); 
        return res.status(400).json({ error: 'Failed to register user' });
    }
};

const verify = async (req, res) => {
    try {
        const user = await users.findById(req.user_uuid);
        return res.status(200).json({ role: `${user.role}` });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export {
    login,
    register,
    verify
}