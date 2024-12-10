'use client'
import React, { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/upload-resume", formData);
      console.log(response)

      const skills = (String(response?.data)).split(",");
      setSkills(skills)
      setError("");
    } catch (err) {
      setError("Error uploading file or extracting skills.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Upload Resume PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Extract Skills</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {
        skills.length > 0 && (
          <div>
            <h3>Extracted Skills:</h3>
            <ul>
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  );
};

export default ResumeUpload;
