import Doctor from '../../db/doctors.js';

const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find(); // zwraca wszystkich lekarzy
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
}

export {
    getDoctors
}