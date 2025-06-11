import Doctor from '../../db/doctors.js';
import Opinion from '../../db/opinions.js';
import Appointment from '../../db/appointments.js';
import { doctorListDTO, doctorProfileDTO } from '../dto/doctorDTO.js';

const getDoctorsDefault = async (req, res) => {
    try {
        const { specialty, location, appointmentType} = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const filter = {};

        if (specialty) filter.specialty = specialty;
        if (location) filter.location = location;

        if (appointmentType === 'online') {
            filter.online = true;
        } else {
            filter.online = false;
        }
        
        const doctors = await Doctor
            .find(filter)
            .populate('user_id', 'profilePicture')    
            .sort({ rating: -1 })
            .limit(limit)
            .skip(skip);
        const dtoList = doctors.map(doctorListDTO);    
        res.json(dtoList);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch doctors' });
        console.log(err);
    }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor
      .findById(req.params.id)
      .populate('user_id', 'profilePicture');

    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const opinions = await Opinion
      .find({ doctor_id: req.params.id })
      .populate('user_id', 'name lastname profilePicture')
      .sort({ rating: -1 });

    const dtoProfile = doctorProfileDTO(doctor, opinions);

    return res.status(200).json(dtoProfile);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

const deleteDoctor = async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
};

const getMyDoctorProfile = async (req, res) => {
    const doctor = await Doctor.findOne({ user_id: req.user_uuid });
    if (!doctor) return res.status(404).json({ error: 'Not found' });
    res.json(doctor);
};

const updateMyDoctorProfile = async (req, res) => {
    const { name, specialty, location, availableDays, online } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
        { user_id: req.user_uuid },
        { name, specialty, location, availableDays, online },
        { new: true }
    );
    res.json(doctor);
};

function generateSlots() {
    const slots = [];
    for (let h = 9; h < 17; h++) {
        slots.push(`${h.toString().padStart(2, '0')}:00`);
        slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return slots;
}

const getDoctorSlots = async (req, res) => {
    const doctorId = req.params.id;
    const date = req.query.date;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    if (!doctor.availableDays.includes(date)) {
        const allSlots = generateSlots();
        return res.json(allSlots.map(time => ({ time, available: false })));
    }

    const appointments = await Appointment.find({ doctorId, date });
    const bookedTimes = appointments.map(a => a.time);

    const allSlots = generateSlots();
    const slotsWithStatus = allSlots.map(time => ({
        time,
        available: !bookedTimes.includes(time)
    }));

    res.json(slotsWithStatus);
};

const opinionDoctor = async (req, res) => {
  try {
    const userId = req.user_uuid;
    const doctorId = req.params.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized: missing user ID' });

    const existingOpinion = await Opinion.findOne({ user_id: userId, doctor_id: doctorId });

    if (existingOpinion) return res.status(400).json({ message: 'You have already rated this doctor' });

    const newOpinion = await Opinion.create({
      user_id: userId,
      doctor_id: doctorId,
      date: new Date(),
      rating: req.body.rating,
      content: req.body.content,
    });
    
    const allOpinions = await Opinion.find({ doctor_id: req.params.id });
    const totalRatings = allOpinions.reduce((acc, opinion) => acc + opinion.rating, 0);
    const opinionsCount = allOpinions.length;
    const averageRating = opinionsCount > 0 ? totalRatings / opinionsCount : 0;
    const roundedRating = Math.round(averageRating * 100) / 100;
    
    await Doctor.findByIdAndUpdate(req.params.id, {
        opinionsCount,
        rating: roundedRating
    });
    
    return res.status(201).json({ message: "Successfully rated the doctor" });

  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export {
    getDoctorsDefault, 
    deleteDoctor, 
    getMyDoctorProfile, 
    updateMyDoctorProfile,
    getDoctorSlots,
    getDoctorProfile,
    opinionDoctor
}