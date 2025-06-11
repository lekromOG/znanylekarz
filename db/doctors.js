import mongoose from 'mongoose';
const { Schema, Types, model } = mongoose;
const ObjectId = Types.ObjectId;

const doctorSchema = new Schema({
    user_id: { type: ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    specialty: { type: String, required: false, default: '' },
    location: { type: String, required: false, default: '' },
    online: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    opinionsCount: { type: Number, default: 0 },
    availableDays: [{ type: String }]
});

const Doctor = model('Doctor', doctorSchema);
export default Doctor;