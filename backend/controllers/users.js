import User from '../../db/users.js';
import Doctor from '../../db/doctors.js';
import Opinion from '../../db/opinions.js';
import Appointment from '../../db/appointments.js';
import Favourite from '../../db/favourites.js';
import formidable from 'formidable';
import mongoose from 'mongoose';
import { favouriteDoctorDTO } from '../dto/doctorDTO.js';

const client_ID = "99edec02c798ed5"
const imgur_api = "https://api.imgur.com/3/image"

const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find(); 
        if (!allUsers || allUsers.length === 0) {
            res.status(404).json({ error: 'No users found' });
        } res.json(allUsers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(req.params.id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(user._id).session(session);

    if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ user_id: user._id }).session(session);
    }

    await Opinion.deleteMany({ user_id: user._id }).session(session);
    await Appointment.deleteMany({ userId: user._id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res
        .status(200)
        .json({ message: 'User and related data deleted' });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    return res
        .status(500)
        .json({ error: err.message });
  }
};

const getMyUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user_uuid);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

const updateMyUserProfile = async (req, res) => {
    try {
        const { name, lastname } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user_uuid,
            { name, lastname },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

export const saveUserPicture = async (req, res) => {
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields) => {
        if (err) return res.status(400).json({ error: 'Form parse error' });
        const base64Image = fields.image;
        if (!base64Image) return res.status(400).json({ error: 'No image provided' });

        try {
            const formdata = new FormData();
            formdata.append("image", base64Image);
            formdata.append("type", "base64");
            formdata.append("title", req.user_uuid);
            formdata.append("description", req.user_uuid);

            const response = await fetch(imgur_api, {
                method: "POST",
                body: formdata,
                headers: {
                    'Authorization': `Client-ID ${client_ID}`
                }
            });
            const response_json = await response.json();
            if (response.ok) {
                await User.findByIdAndUpdate(
                    req.user_uuid,
                    { profilePicture: response_json.data.link }
                );
                return res.status(201).json({ message: response_json.data.link });
            } else {
                return res.status(400).json({ message: response_json });
            }
        } catch (err) {
            console.error('Error saving user picture:', err);
            return res.status(500).json({ error: err });
        }
    });
};

const addtoFavourites = async (req, res) => {
    try {
        const doctorId = req.body.doctorId;
        await Favourite.findOneAndUpdate(
            { user_id: req.user_uuid },
            { $addToSet: { doctor_ids: doctorId } },
            { upsert: true, new: true }
        );
        const updated = await Favourite.findOne({ user_id: req.user_uuid });
        return res.status(201).json({
            message: 'Added to favourites successfully',
            doctor_ids: updated.doctor_ids
        });
    } catch (err) {
        console.error('Error in adding to favourites:', err);
        return res
            .status(500)
            .json({ error: 'Error in adding to favourites' });
    }
};

const removeFromFavourites = async (req, res) => {
    try {
        await Favourite.findOneAndUpdate(
            { user_id: req.user_uuid }, // filter
            { $pull: { doctor_ids: req.body.doctorId } }, // update
            { new: true } // options
        );
        return res
            .status(204)
            .json({ message: 'Removed from favourites succesfully' });
    } catch (err) {
        return res
            .status(500)
            .json({ error: 'Error in removing from favourites' });
    }
};

const listUserFavourites = async (req, res) => {
    try {
        const favourites = await Favourite.findOne({ user_id: req.user_uuid }).populate('doctor_ids');
        if (!favourites) {
            return res.json({ doctors: [] });
        }
        const doctors = favourites.doctor_ids
            .filter(doctor => doctor) 
            .map(favouriteDoctorDTO);

        return res.json({ doctors });
    } catch (err) {
        console.error('Error in listing favourites:', err);
        return res.status(500).json({ error: 'Error in listing favourites' });
    }
};

export {
    getUsers, 
    deleteUser, 
    updateMyUserProfile, 
    getMyUserProfile,
    addtoFavourites,
    removeFromFavourites,
    listUserFavourites
}