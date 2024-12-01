import React, { useState } from "react";
import api from "../../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/forgot-password", { email });
      alert("Password reset link sent to your email!");
    } catch (error) {
      alert("Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
