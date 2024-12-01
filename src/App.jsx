import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MiniNavbar from "./components/Profile/MiniNavbar";
import Login from "./components/Auth/Login";
import RegisterPatient from "./components/Auth/RegisterPatient";
import RegisterCoass from "./components/Auth/RegisterCoass";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ListCoass from "./components/Profile/ListCoass";
import ListPatients from "./components/Profile/ListPatients";
import Profile from "./components/Profile/Profile";
import UpdateProfile from "./components/Profile/UpdateProfile";
import Predict from "./components/Diagnosis/Predict";

function App() {
  return (
    <Router>
      <MiniNavbar /> {/* Tambahkan Navbar */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/register-coass" element={<RegisterCoass />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<UpdateProfile />} />
        <Route path="/list-patients" element={<ListPatients />} />
        <Route path="/list-coass" element={<ListCoass />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;


