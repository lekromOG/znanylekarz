import Doctor from '../../db/doctors.js';

const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find(); // zwraca wszystkich lekarzy
        res
            .json(doctors);
    } catch (err) {
        res
            .status(500)
            .json({ error: 'Failed to fetch doctors' });
    }
}

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