import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../../api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        jwtDecode(token);

        const response = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error.response?.data || error.message);
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle Input Change for Password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle Submit Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New password and confirmation do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.put(
        "/change-password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Password changed successfully!");
      setShowChangePasswordModal(false);
    } catch (error) {
      console.error("Failed to change password:", error.response?.data || error.message);
      alert("Failed to change password. Please check your input.");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-green-50">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-green-50 to-green-100 p-6 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-green-600 text-center mb-6">Your Profile</h1>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          {profile.Img_profile ? (
            <img
              src={profile.Img_profile}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl">
              No Image
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <p className="text-gray-700">
            <strong>Email:</strong> {profile.Email}
          </p>
          <p className="text-gray-700">
            <strong>Name:</strong> {profile.Name}
          </p>
          <p className="text-gray-700">
            <strong>Gender:</strong> {profile.Gender}
          </p>
          <p className="text-gray-700">
            <strong>Birth Date:</strong> {new Date(profile.Birth_date).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> {profile.Phone}
          </p>

          {/* Conditional fields for Coass */}
          {profile.Role === "Coass" && (
            <>
              <p className="text-gray-700">
                <strong>KTP:</strong> {profile.Ktp || "Not Provided"}
              </p>
              <p className="text-gray-700">
                <strong>NIM:</strong> {profile.Nim || "Not Provided"}
              </p>
              <p className="text-gray-700">
                <strong>Practice Place:</strong> {profile.Appointment_Place || "Not Provided"}
              </p>
              <p className="text-gray-700">
                <strong>University:</strong> {profile.University || "Not Provided"}
              </p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Link
            to="/profile/edit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
          >
            Edit Profile
          </Link>
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-green-600 text-center mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {["oldPassword", "newPassword", "confirmNewPassword"].map((field, index) => (
                <div key={index} className="relative">
                  <input
                    type={passwordVisibility[field] ? "text" : "password"}
                    name={field}
                    value={passwordData[field]}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder={
                      field === "oldPassword"
                        ? "Old Password"
                        : field === "newPassword"
                        ? "New Password"
                        : "Confirm New Password"
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {passwordVisibility[field] ? "🙈" : "👁️"}
                  </button>
                </div>
              ))}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
