import React, { useEffect, useState } from "react";
import api from "../../api";

// Komponen Tabel Permintaan Diterima
const AcceptedRequestsTable = ({ requests, onScheduleClick }) => {
  if (requests.length === 0) {
    return <p className="text-gray-600">Tidak ada permintaan yang diterima.</p>;
  }

  return (
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
        {requests.map((request, index) => (
          <tr key={request.Request_id}>
            <td className="border-b p-2">{index + 1}</td>
            <td className="border-b p-2">{request.Name}</td>
            <td className="border-b p-2">{request.Disease_name}</td>
            <td className="border-b p-2">
              <button
                onClick={() => onScheduleClick(request)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Schedule
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Komponen Modal Jadwal
const ScheduleModal = ({
  isOpen,
  selectedRequest,
  form,
  onInputChange,
  onConfirm,
  onClose,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full transform transition duration-300 scale-100">
        <h2 className="text-xl font-bold mb-4 text-green-700">Schedule Meeting</h2>
        <p className="mb-2">
          <strong>Patient Name:</strong> {selectedRequest?.Name}
        </p>
        <p className="mb-2">
          <strong>Disease Name:</strong> {selectedRequest?.Disease_name}
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Appointment Date</label>
          <input
            type="datetime-local"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={onInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Appointment Place</label>
          <input
            type="text"
            name="appointmentPlace"
            placeholder="Masukkan tempat pertemuan"
            value={form.appointmentPlace}
            onChange={onInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen Utama
const ScheduleMeeting = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form, setForm] = useState({ appointmentDate: "", appointmentPlace: "" });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch accepted requests
  const fetchAcceptedRequests = async () => {
    try {
      const response = await api.get("/accepted-requests");
      setAcceptedRequests(response.data);
      setErrorMessage("");
    } catch (error) {
      // setErrorMessage("Tidak ada permintaan yang diterima. Mohon cek setelah menerima Pending Request.");
    }
  };

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle scheduling a meeting
  const handleScheduleClick = (request) => {
    setSelectedRequest(request);
    setIsPopupOpen(true);
  };

  const handleConfirmSchedule = async () => {
    const { appointmentDate, appointmentPlace } = form;

    // Validasi form
    if (!appointmentDate || !appointmentPlace) {
      alert("Tanggal dan tempat pertemuan harus diisi.");
      return;
    }

    const confirm = window.confirm("Apakah Anda yakin ingin menjadwalkan temu ini?");
    if (!confirm) return;

    setLoading(true);
    try {
      await api.post("/schedule-meeting", {
        request_id: selectedRequest.Request_id,
        appointment_date: appointmentDate,
        appointment_place: appointmentPlace,
      });

      alert("Pertemuan berhasil dijadwalkan.");
      setIsPopupOpen(false);
      setForm({ appointmentDate: "", appointmentPlace: "" });
      fetchAcceptedRequests(); // Refresh daftar
    } catch (error) {
      setErrorMessage(
        error.response?.status === 400
          ? "Gagal menjadwalkan. Permintaan tidak valid atau sudah diproses."
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Schedule Meeting</h1>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 border-l-4 border-red-500 p-4 mb-4">
          {errorMessage}
        </div>
      )}

      {/* List of Accepted Requests */}
      <div className="bg-white shadow rounded p-4">
        <AcceptedRequestsTable
          requests={acceptedRequests}
          onScheduleClick={handleScheduleClick}
        />
      </div>

      {/* Schedule Popup */}
      <ScheduleModal
        isOpen={isPopupOpen}
        selectedRequest={selectedRequest}
        form={form}
        onInputChange={handleInputChange}
        onConfirm={handleConfirmSchedule}
        onClose={() => setIsPopupOpen(false)}
        loading={loading}
      />
    </div>
  );
};

export default ScheduleMeeting;
