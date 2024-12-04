import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function RequestMeeting() {
  const [coassList, setCoassList] = useState([]);
  const [filteredCoass, setFilteredCoass] = useState([]);
  const [selectedCoass, setSelectedCoass] = useState(null); // Menyimpan data Co-Ass yang dipilih
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State untuk pop-up detail
  const [showConfirmation, setShowConfirmation] = useState(false); // State untuk konfirmasi
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State untuk pop-up error

  const navigate = useNavigate();

  // Validasi token JWT
  useEffect(() => {
    const cekToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    };
    cekToken();
  }, [navigate]);

  // Fetch list of Co-Ass
  useEffect(() => {
    const fetchCoass = async () => {
      try {
        const response = await api.get("/list-coass", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Sertakan token
          },
        });
        setCoassList(response.data);
        setFilteredCoass(response.data); // Default to show all data
      } catch (error) {
        alert("Failed to load Co-Ass list. Please try again.");
      }
    };
    fetchCoass();
  }, []);

  // Filter data based on search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = coassList.filter(
      (coass) =>
        coass.Name.toLowerCase().includes(query) ||
        coass.University.toLowerCase().includes(query) ||
        coass.Appointment_Place.toLowerCase().includes(query)
    );
    setFilteredCoass(filtered);
  };

  // Handle meeting request
  const handleRequest = async () => {
    setLoading(true);
    try {
      await api.post(
        "/request-meeting",
        { coassId: selectedCoass.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Berhasil mengajukan, mohon menunggu.");
      setShowPopup(false);
      setShowConfirmation(false);
      setSelectedCoass(null);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.message === "You already have a pending or accepted request.") {
        setShowErrorPopup(true); // Tampilkan pop-up error
      } else {
        alert("Gagal mengajukan permintaan temu. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Request a Meeting with a Co-Ass
      </h1>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Name, University, or place of practice..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Cards for Co-Ass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCoass.map((coass) => (
          <div
            key={coass.id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center text-center"
          >
            {/* Profile Picture */}
            <img
              src={coass.Img_profile || "https://via.placeholder.com/150"}
              alt={coass.Name}
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800">{coass.Name}</h2>
            {/* Appointment_Place with truncation */}
            <p
              className="text-sm text-gray-700 mt-2 truncate"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
              title={coass.Appointment_Place} // Menampilkan teks lengkap sebagai tooltip
            >
              {coass.Appointment_Place.length > 20
                ? `${coass.Appointment_Place.substring(0, 20)}...`
                : coass.Appointment_Place}
            </p>
            <button
              onClick={() => {
                setSelectedCoass(coass);
                setShowPopup(true);
              }}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              Pilih
            </button>
          </div>
        ))}
      </div>

      {/* Pop-Up Detail */}
      {showPopup && selectedCoass && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Co-Ass Details</h2>
            <img
              src={selectedCoass.Img_profile || "https://via.placeholder.com/150"}
              alt={selectedCoass.Name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
            <p><strong>Name:</strong> {selectedCoass.Name}</p>
            <p><strong>University:</strong> {selectedCoass.University}</p>
            <p><strong>Place of Practice:</strong> {selectedCoass.Appointment_Place}</p>
            <p><strong>Phone:</strong> {selectedCoass.Phone}</p>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                onClick={() => setShowConfirmation(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800">
              Konfirmasi Pengajuan
            </h2>
            <p className="text-gray-600 mt-2">
              Ajukan temu dengan {selectedCoass.Name}. Maksimal pengajuan adalah
              1x, setelah itu Anda harus menunggu untuk diproses. Apakah Anda
              yakin melanjutkan?
            </p>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Tidak
              </button>
              <button
                onClick={handleRequest}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Ya"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Pop-Up */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pengajuan Masih Diproses</h2>
            <p className="text-gray-600">
              Anda sudah memiliki pengajuan yang sedang diproses atau telah diterima. Mohon tunggu hingga proses selesai sebelum mengajukan permintaan baru.
            </p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestMeeting;
