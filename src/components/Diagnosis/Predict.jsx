import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function Predict() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const cekToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
        return;
      }
    }
    cekToken();
  });
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await api.post("/predict", formData);
      setResult(response.data);
    } catch (error) {
      console.error("Diagnosis failed:", error.response.data);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Upload Diagnosis</h1>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button onClick={handleSubmit} className="bg-green-700 text-white p-2 rounded w-full">
          Submit
        </button>
        {result && (
          <div className="mt-4">
            <img src={result.image} alt="Disease" className="w-full h-64 object-cover rounded" />
            <h2 className="text-xl font-bold mt-2">{result.disease_name}</h2>
            <p>{result.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Predict;
