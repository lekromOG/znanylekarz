export const doctorListDTO = (doctor) => ({
  id: doctor._id,
  name: doctor.name,
  profilePicture: doctor.user_id.profilePicture,
  specialty: doctor.specialty,
  location: doctor.location,
  rating: doctor.rating,
  online: doctor.online,
  opinionsCount: doctor.opinionsCount,
  availableDays: doctor.availableDays,
});

export const doctorProfileDTO = (doctor, opinions) => ({
  name: doctor.name,
  profilePicture: doctor.user_id.profilePicture,
  specialty: doctor.specialty,
  location: doctor.location,
  rating: doctor.rating,
  opinionsCount: doctor.opinionsCount,
  opinions: opinions.map(opinion => ({
    rating: opinion.rating,
    content: opinion.content,
    date: opinion.date,
    user: {
      name: opinion.user_id.name,
      lastname: opinion.user_id.lastname,
      profilePicture: opinion.user_id.profilePicture
    }
  }))
});
