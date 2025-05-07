import { Schema, model } from 'mongoose';

const doctorSchema = new Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    location: { type: String, required: true },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
});

const Doctor = model('Doctor', doctorSchema);
export default Doctor;