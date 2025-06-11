import mongoose from 'mongoose';
const { Schema, Types, model } = mongoose;
const ObjectId = Types.ObjectId;

const appointmentSchema = new Schema({
    doctorId: { type: ObjectId, ref: 'Doctor', required: true },
    userId: { type: ObjectId, ref: 'users', required: true },
    date: { type: String, required: true }, 
    time: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }
});

const Appointment = model('Appointment', appointmentSchema);
export default Appointment;