import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../../db/users.js';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email });

        if (user) {
            const isPasswordOk = await bcrypt.compare(password, user.password);
            if (isPasswordOk) {
                try {
                    var token = jwt.sign({sub: user._id }, 'privateKey', { algorithm: 'HS256', expiresIn: "1h"});
                    res.set('Authorization', `Bearer ${token}`);
                    return res
                            .status(200)
                            .json({ message: 'Login successful', token: `Bearer: ${token}`});
                } catch (err) {
                    console.log(err);
                    return res
                            .status(400)
                            .json({ error: "JWT Token error"});
                }
            }
        } res.status(401).json({ error: "Invalid credentials" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const register = async (req, res) => {
    try {
        const { name, lastname, email, password, role } = req.body;

        const existingUser = await users.findOne({ email });
        if (existingUser) {return res.status(400).json({ error: 'User already exists' });}

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new users({ name, lastname, email, password: hashedPassword, role: role || 'standard' });
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);

    } catch (err) {
        return res.status(400).json({ error: 'Failed to register user' });
    }
};

export {
    login,
    register
}