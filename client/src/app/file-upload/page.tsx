"use client";

import { useState } from "react";

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const sanitizeFileName = (name: string) => {
    return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };


  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    try {
      const sanitizedFileName = sanitizeFileName(file.name);
      const fileType = file.type;

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: sanitizedFileName, fileType }),
      });

      const { uploadUrl, key } = await response.json();

      // Upload file to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": fileType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      // Get public URL of the file to store in database
      const signedUrlResponse = await fetch("/api/getPresignedUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });
  
      const { signedUrl } = await signedUrlResponse.json();

      setUploadStatus(`File uploaded successfully: ${signedUrl}`);
      console.log("Public URL:", signedUrl);  
    } catch (error) {
      console.error(error);
      setUploadStatus("Failed to upload file");
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
