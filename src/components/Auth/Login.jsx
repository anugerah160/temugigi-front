import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import logo from "../../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate("/predict");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-20 h-20" />
          <h1 className="text-2xl font-semibold text-green-600 mt-4">Selamat Datang di TemuGigi!</h1>
          <p className="text-gray-500">Login untuk mengakses akun</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Masukkan Email anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Masukkan Password anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <Link
            to="/forgot-password"
            className="text-gray-500 hover:underline text-sm mt-4 inline-block"
          >
            Lupa Password?
          </Link>
        <div className="mt-6 text-center">
          <p className="text-gray-600">Tidak memiliki Akun?</p>
          <div className="mt-2 flex flex-col gap-2">
            <Link
              to="/register-patient"
              className="text-green-500 hover:underline"
            >
              Registrasi sebagai Pasien
            </Link>
            <Link
              to="/register-coass"
              className="text-green-500 hover:underline"
            >
              Registrasi sebagai CoAss
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Login;
