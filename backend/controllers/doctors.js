import Doctor from '../../db/doctors.js';
import Appointment from '../../db/appointments.js';

const getDoctors = async (req, res) => {
    try {
        const { specialty, location, date, appointmentType } = req.query;
        const filter = {};

        if (specialty) filter.specialty = specialty;
        if (location) filter.location = location;
        if (appointmentType) filter.available = appointmentType === 'online' ? true : true; // Adjust if you store type

        // If you want to filter by date, add logic here (e.g., availableDates: { $in: [date] })

        const doctors = await Doctor.find(filter);
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch doctors' });
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
    const { name, specialty, location, availableDays, availableHours } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
        { user_id: req.user_uuid },
        { name, specialty, location, availableDays, availableHours },
        { new: true }
    );
    res.json(doctor);
};

// TO DO
const getDoctorsByParameters = async (req, res) => {
    const parameters = req.params;
    try {
        console.log(parameters);
        res.
            status(200)
            .json({ parameters });
    } catch (err) {
        res
            .status(400)
            .json({ error: `${err}` });
    }
}

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
        return res.json([]); // Not available that day
    }

    const appointments = await Appointment.find({ doctorId, date });
    const bookedTimes = appointments.map(a => a.time);

    const allSlots = generateSlots();
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    res.json(availableSlots);
};


export {
    getDoctors, deleteDoctor, getMyDoctorProfile, updateMyDoctorProfile, getDoctorsByParameters, getDoctorSlots
}