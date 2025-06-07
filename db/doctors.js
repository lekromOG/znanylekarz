import { Schema, model } from 'mongoose';

const doctorSchema = new Schema({
    user_id: { type: ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    location: { type: String, required: true },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    opinions: [{
        user_id: { type: ObjectId, ref: 'users', required: true },
        rating: { type: Number, required: true },
        content: { type: String }
    }]
});

const Doctor = model('Doctor', doctorSchema);
export default Doctor;