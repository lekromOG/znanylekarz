import mongoose from 'mongoose';
const { Schema, Types, model } = mongoose;
const ObjectId = Types.ObjectId;

const favouriteSchema = new Schema({
  user_id:   { type: ObjectId, ref: 'User', required: true, unique: true },
  doctor_ids: [{ type: ObjectId, ref: 'Doctor' }]
});

export default model('Favourite', favouriteSchema);