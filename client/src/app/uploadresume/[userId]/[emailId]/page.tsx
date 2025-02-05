'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMessage('')
    }
  }



  const {userId,emailId} = useParams()

  

  const uploadFile = async () => {
    const sanitizeFileName = (name: string) => {
      return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
    };

    try {
      const sanitizedFileName = sanitizeFileName(file.name);
      const fileType = file?.type;

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

      const signedUrlResponse = await fetch("/api/getPresignedUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });

      const { signedUrl } = await signedUrlResponse.json();


      console.log("Public URL:", signedUrl);

      return signedUrl


    } catch (error) {
      console.error(error);
    }
  };



  const extractSkills = async()=>{

    const formData = new FormData();
    formData.append("file", file);

    try{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PYTHON_API_ENDPOINT}/upload-resume`, formData);
      const skills = (String(response?.data)).split(",");
      return skills;

    }
    catch(error){
      console.log(error)
    }

  
  }


  const handleExtractedSkills = async()=>{
    const formData = {
      skills: skills
    }

    try{
      console.log(formData)


        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/userProfile/${userId}`, formData)
        toast.success('Skills added')

    }
    catch(error){
      console.log(error)
    } 

  }


  const handleSkillExtraction = async () => {

    try{
        const skills_ = await extractSkills();
        setSkills(skills_)
        handleExtractedSkills();

    }
    catch(error){
      console.log(error)
    }   

  }

  

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Upload Your Resume
          </h1>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Upload/Update Candidate Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-green-600">
                  Selected file: {file.name}
                </p>
              )}
              <div className="flex space-x-4">
                <Button onClick={uploadFile} className="flex-1">
                  Upload Resume
                </Button>
                <Button onClick={handleSkillExtraction} className="flex-1" variant="secondary">
                  Extract Skills
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">{message}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Extracted Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {skills.map((skill, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

