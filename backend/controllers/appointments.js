import Appointment from '../../db/appointments.js';

export const createAppointment = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;
        const userId = req.user_uuid; // or req.user.id, depending on your auth

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