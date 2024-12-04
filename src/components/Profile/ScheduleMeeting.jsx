import React, { useEffect, useState } from "react";
import api from "../../api";

const ScheduleMeeting = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentPlace, setAppointmentPlace] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch accepted requests
  const fetchAcceptedRequests = async () => {
    try {
      const response = await api.get("/accepted-requests");
      setAcceptedRequests(response.data);
    } catch (error) {
      alert("Gagal memuat permintaan yang diterima.");
    }
  };

  // Handle schedule button click
  const handleScheduleClick = (request) => {
    setSelectedRequest(request);
    setIsPopupOpen(true);
  };

  // Handle confirm scheduling
  const handleConfirmSchedule = async () => {
    if (!appointmentDate || !appointmentPlace) {
      alert("Tanggal dan tempat pertemuan harus diisi.");
      return;
    }

    const confirm = window.confirm("Apakah Anda yakin ingin menjadwalkan temu ini?");
    if (!confirm) return;

    try {
      await api.post("/schedule-meeting", {
        request_id: selectedRequest.Request_id,
        appointment_date: appointmentDate,
        appointment_place: appointmentPlace,
      });

      alert("Pertemuan berhasil dijadwalkan.");
      setIsPopupOpen(false);
      fetchAcceptedRequests(); // Refresh list
    } catch (error) {
      alert("Gagal menjadwalkan pertemuan.");
    }
  };

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Schedule Meeting</h1>
      <div className="bg-white shadow rounded p-4">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">No</th>
              <th className="border-b p-2 text-left">Name</th>
              <th className="border-b p-2 text-left">Disease Name</th>
              <th className="border-b p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {acceptedRequests.map((request, index) => (
              <tr key={request.Request_id}>
                <td className="border-b p-2">{index + 1}</td>
                <td className="border-b p-2">{request.Name}</td>
                <td className="border-b p-2">{request.Disease_name}</td>
                <td className="border-b p-2">
                  <button
                    onClick={() => handleScheduleClick(request)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Schedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-green-700">Schedule Meeting</h2>
            <p className="mb-2">
              <strong>Patient Name:</strong> {selectedRequest.Name}
            </p>
            <p className="mb-2">
              <strong>Disease Name:</strong> {selectedRequest.Disease_name}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Appointment Date</label>
              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Appointment Place</label>
              <input
                type="text"
                placeholder="Masukkan tempat pertemuan"
                value={appointmentPlace}
                onChange={(e) => setAppointmentPlace(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSchedule}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleMeeting;
