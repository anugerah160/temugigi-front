import React, { useEffect, useState } from "react";
import api from "../../api";

function CoassSchedule() {
  const [schedules, setSchedules] = useState([]);

  // Fetch schedules from API
  const fetchSchedules = async () => {
    try {
      const response = await api.get("/coass-schedule", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
        },
      });
      setSchedules(response.data);
    } catch (error) {
      alert("Gagal memuat jadwal temu.");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Format date and time
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("id-ID", options);
  };

  // Generate WhatsApp URL
  const generateWhatsAppURL = (phone, patientName) => {
    const message = `Hello ${patientName},\n\nI would like to confirm our appointment. Thank you!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Jadwal Temu Saya
      </h1>
      {schedules.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-md rounded-lg">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Appointment Place</th>
                <th className="px-4 py-2">Date&Time</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Disease Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr
                  key={schedule.Schedule_id}
                  className="text-center border-t hover:bg-gray-100"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{schedule.Appointment_place}</td>
                  <td className="px-4 py-2">
                    {formatDate(schedule.Appointment_date)}
                  </td>
                  <td className="px-4 py-2">{schedule.Patient_name}</td>
                  <td className="px-4 py-2">{schedule.Patient_gender}</td>
                  <td className="px-4 py-2">{schedule.Disease_name}</td>
                  <td className="px-4 py-2">{schedule.Description}</td>
                  <td className="px-4 py-2">
                    <a
                      href={generateWhatsAppURL(
                        schedule.Patient_phone,
                        schedule.Patient_name
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                    >
                      Contact
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">Tidak ada jadwal temu.</p>
      )}
    </div>
  );
}

export default CoassSchedule;
