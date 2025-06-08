import Doctor from '../../db/doctors.js';

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

export {
    getDoctors
}