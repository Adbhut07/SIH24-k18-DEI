import { useState } from "react";

export default function TestPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [skillsResponse, setSkillsResponse] = useState<string | null>(null);

  // Handle PDF file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };

  // Convert PDF to Base64 and send to the server
  const handleUpload = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(pdfFile);
    reader.onload = async () => {
      const base64PDF = reader.result as string;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_ENDPOINT}/extract_skills`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pdf_data: base64PDF }),
        });

        const result = await response.json();
        setSkillsResponse(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error("Error uploading file:", error);
        setSkillsResponse("Error extracting skills.");
      }
    };
  };

  return (
    <div>
      <h1>Upload Resume for Skill Extraction</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginTop: "10px" }}>
        Submit PDF
      </button>
      <div style={{ marginTop: "20px" }}>
        <h3>Extracted Skills:</h3>
        <pre>{skillsResponse || "No skills extracted yet."}</pre>
      </div>
    </div>
  );
}
