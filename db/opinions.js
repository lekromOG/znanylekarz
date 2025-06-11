import mongoose from 'mongoose';
const { Schema, Types, model } = mongoose;
const ObjectId = Types.ObjectId;

const opinionSchema = new Schema({
    user_id: { type: ObjectId, ref: 'users', required: true },
    doctor_id: { type: ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String }
});

opinionSchema.index({ user_id: 1, doctor_id: 1 }, { unique: true });

const Opinion = model('opinions', opinionSchema);
export default Opinion;