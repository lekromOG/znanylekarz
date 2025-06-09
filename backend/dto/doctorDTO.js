export const doctorListDTO = (doctor) => ({
  id: doctor._id,
  name: doctor.name,
  profilePicture: doctor.profilePicture,
  specialty: doctor.specialty,
  location: doctor.location,
  rating: doctor.rating,
  opinionsCount: doctor.opinionsCount
});