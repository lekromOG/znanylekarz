import Appointment from '../../db/appointments.js';
import Doctor from '../../db/doctors.js';
import User from '../../db/users.js';

export const createAppointment = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;
        const userId = req.user_uuid;

        if (!doctorId || !date || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const appointment = new Appointment({
            doctorId,
            userId,
            date,
            time
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment booked', appointment });
    } catch (err) {
        res.status(500).json({ error: 'Failed to book appointment' });
    }
};

export const getUserAppointments = async (req, res) => {
    try {
        const userId = req.user_uuid;
        const user = await User.findById(userId);
        let appointments = [];

        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user_id: userId });
            if (!doctor) return res.json([]);
            appointments = await Appointment.find({ doctorId: doctor._id })
                .populate('userId', 'name')
                .populate('doctorId', 'name')
                .sort({ date: 1, time: 1 });
        } else {
            appointments = await Appointment.find({ userId })
                .populate('doctorId', 'name')
                .populate('userId', 'name')
                .sort({ date: 1, time: 1 });
        }

        const result = appointments.map(app => ({
            _id: app._id,
            date: app.date,
            time: app.time,
            doctorName: app.doctorId?.name,
            patientName: app.userId?.name
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user_uuid;
        const appointmentId = req.params.id;
        const user = await User.findById(userId);

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        let allowed = false;
        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user_id: userId });
            if (doctor && appointment.doctorId.equals(doctor._id)) allowed = true;
        }
        if (user.role !== 'doctor' && appointment.userId.equals(userId)) allowed = true;

        if (!allowed) return res.status(403).json({ error: 'Not authorized to cancel this appointment' });

        await Appointment.findByIdAndDelete(appointmentId);
        res.json({ message: 'Appointment cancelled' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
};