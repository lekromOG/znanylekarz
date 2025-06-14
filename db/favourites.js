import mongoose from 'mongoose';
const { Schema, Types, model } = mongoose;
const ObjectId = Types.ObjectId;

const favouriteSchema = new Schema({
  user_id:   { type: ObjectId, ref: 'users', required: true, unique: true },
  doctor_ids: [{ type: ObjectId, ref: 'Doctor' }]
});

const Favourite = model('Favourite', favouriteSchema);
export default Favourite;