import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { jwtDecode } from "jwt-decode";

function MiniNavbar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State untuk modal
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil token JWT dari localStorage
  const token = localStorage.getItem("token");

  // Decode JWT untuk mendapatkan role
  let role = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role; // Pastikan role ada di payload JWT
    } catch (error) {
      console.error("Invalid token:", error);
      role = null;
    }
  }

  // Halaman tanpa Navbar
  const noNavbarRoutes = ["/", "/login", "/register-coass", "/register-patient"];

  // Jangan tampilkan navbar jika di halaman tertentu
  if (noNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token dari localStorage
    navigate("/login"); // Redirect ke halaman login
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-12 mr-4" />
          <h1 className="text-lg font-bold text-green-600">TemuGigi</h1>
        </div>

        {/* Links */}
        <ul className="flex space-x-6 text-gray-600">
          {/* Diagnosis */}
          <li>
            <Link to="/predict" className="hover:text-green-600 transition">
              Diagnosis
            </Link>
          </li>

          {/* List CoAss */}
          <li>
            <Link to="/list-coass" className="hover:text-green-600 transition">
              List CoAss
            </Link>
          </li>

          {/* List Patient (Hanya untuk role selain "Patient") */}
          {role !== "Patient" && (
            <li>
              <Link
                to="/list-patients"
                className="hover:text-green-600 transition"
              >
                List Patient
              </Link>
            </li>
          )}

          {/* Profile */}
          <li>
            <Link to="/profile" className="hover:text-green-600 transition">
              Profile
            </Link>
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={() => setShowLogoutModal(true)} // Tampilkan modal
              className="hover:text-red-500 transition focus:outline-none"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800">
              Konfirmasi Logout
            </h2>
            <p className="text-gray-600 mt-2">
              Apakah Anda yakin ingin keluar?
            </p>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                onClick={() => setShowLogoutModal(false)} // Tutup modal
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={handleLogout} // Lakukan logout
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MiniNavbar;
