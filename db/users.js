const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['standard', 'doctor', 'admin'], default: 'standard' }
});

const users = mongoose.model('users', usersSchema);
module.exports = users;