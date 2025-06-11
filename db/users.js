import { Schema, model } from 'mongoose';

const usersSchema = new Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String , default: '' }, 
    password: { type: String, required: true },
    role: { type: String, enum: ['standard', 'doctor', 'admin'], default: 'standard' }
});

const User = model('users', usersSchema);
export default User;