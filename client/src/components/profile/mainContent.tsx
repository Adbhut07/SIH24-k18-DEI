'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { revalidatePath } from 'next/cache'
import toast from 'react-hot-toast'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useAppSelector } from '@/lib/store/hooks'
import axios from 'axios'
import { eventNames } from 'process'
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url'

type UserData = {
  firstName: string
  lastName: string
  age: number
  location: string
  email: string
  phone: string
  profession: string
  experience: number
  education: string
  skills: string[]
  achievements: string[]
  summary: string
}

type ProfileUpdate = Partial<UserData>

export function MainContent() {


  const user = useAppSelector((state) => state.user)

  const [userData, setUserData] = useState(
    {
      candidateId: "",
      name: "",
      designation: "",
      age: "",
      location: "",
      aadharNumber: "",
      email: "",
      phoneNumber: "",
      summary: "",
      resume: "",
      medicalReport: "",
      tenthMarks: "",
      twelfthMarks: "",
      gateScore: "",
      jeeScore: "",
      experience: "",
      education: "",
      skills: [],
      achievements: []
    }
  )


  const [newSkill, setNewSkill] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [profileId, setProfileId] = useState("")
  const [resumeFile, setResumeFile] = useState("")
  const [medicalFile, setMedicalFile] = useState("")


  const fetchProfileDetails = async () => {


    const response = await axios.get(`http://localhost:5454/api/v1/userProfile/${user.email}`)
    console.log(response)
    return response

  }

  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await fetchProfileDetails(); // Assuming fetchProfileDetails is async

        const resume_url = data?.data?.data?.resume
        const medicalReport_url = data?.data?.data?.medicalReport

        let parsedUrl;
        let filePath;

        if (resume_url){
           parsedUrl = new URL(resume_url);
          filePath = decodeURIComponent(parsedUrl.pathname.substring(1));
          setResumeFile(filePath)
  

        }

        if (medicalReport_url){
          
        parsedUrl = new URL(medicalReport_url);
        filePath = decodeURIComponent(parsedUrl.pathname.substring(1));
        setMedicalFile(filePath)

        }

       




        setUserData(data?.data?.data);
        setIsLoading(false);
        console.log(data?.data?.data?.id)
        setProfileId(data?.data?.data?.id)
        toast.success('User details fetched');
      } catch (error) {
        setIsLoading(false);
        toast.error('Failed to fetch user details');
      }
    };

    fetchData()

  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>Error loading user data</div>
  }




  const uploadFile = async (file: File) => {
    const sanitizeFileName = (name: string) => {
      return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
    };

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

  // const uploadMedicalReport = async(file:File)=>{
  //   const sanitizeFileName = (name: string) => {
  //     return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
  //   };

  //   try {
  //     const sanitizedFileName = sanitizeFileName(file.name);
  //     const fileType = file.type;

  //     const response = await fetch("/api/upload", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ fileName: sanitizedFileName, fileType }),
  //     });

  //     const { uploadUrl, key } = await response.json();

  //     // Upload file to S3
  //     const uploadResponse = await fetch(uploadUrl, {
  //       method: "PUT",
  //       body: file,
  //       headers: {
  //         "Content-Type": fileType,
  //       },
  //     });

  //     if (!uploadResponse.ok) {
  //       throw new Error("Upload failed");
  //     }

  //     const signedUrlResponse = await fetch("/api/getPresignedUrl", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ key }),
  //     });

  //     const { signedUrl } = await signedUrlResponse.json();


  //     console.log("Public URL:", signedUrl);  
  //     toast.success('Resume Uploaded')

  //     return signedUrl


  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Resume Not Uploaded')
  //   }
  // };







  const handleSubmit1 = async (event) => {
    event.preventDefault();

    // Prepare form data
    let formData = {
      name: event.target.name.value,
      designation: event.target.designation.value,
      age: Number(event.target.age.value),
      location: event.target.location.value,
      aadharNumber: event.target.aadhar.value,
      phoneNumber: event.target.phoneNumber.value,
      experience: Number(event.target.experience.value),
      education: event.target.education.value


    };

    // Declare file and public_url outside of the conditional block
    let file;
    let public_url = "";

    // Check if a file was selected and upload it
    if (event.target.resume.files.length > 0) {
      file = event.target.resume.files[0];
      try {
        // Assuming uploadResume is an async function
        public_url = await uploadFile(file);
        toast.success('Reusme uploaded')
      } catch (error) {
        console.error("Error uploading resume:", error);
        toast.error('Failed to upload resume');
        return;  // Return early if file upload fails
      }
    }

    // If a file is uploaded, add the public_url to the form data
    if (public_url) {
      formData = { ...formData, resume: String(public_url) };
    }

    try {
      // Send the PUT request to update the profile
      const response = await axios.put(`http://localhost:5454/api/v1/userProfile/${profileId}`, formData);

      // Handle successful response
      if (response.status === 200) {
        toast.success('Details updated successfully');
        // Optionally, update the state with the new user data
        // setUserData(response.data); // Assuming you have state to update
      } else {
        toast.error('Failed to update details');
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error('Details not updated');
    }
  };

  const handleMedicalReport = async (event) => {
    event.preventDefault();



    let file;
    let public_url;

    if (event.target.medicalReport.files.length > 0) {
      file = event.target.medicalReport.files[0];

      try {
        // Assuming uploadResume is an async function
        public_url = await uploadFile(file);
      } catch (error) {
        console.error("Error uploading Medical Report:", error);
        toast.error('Failed to upload Medical Report');
        return;  // Return early if file upload fails
      }


    }


    let formData;

    if (public_url) {
      formData = {
        medicalReport: public_url
      }

      try {
        // Send the PUT request to update the profile
        const response = await axios.put(`http://localhost:5454/api/v1/userProfile/${profileId}`, formData);

        // Handle successful response
        if (response.status === 200) {
          toast.success('Medical report uploaded');
          // Optionally, update the state with the new user data
          // setUserData(response.data); // Assuming you have state to update
        } else {
          toast.error('Failed to update Medical Report');
        }
      } catch (error) {
        console.error("Error updating Medical Report:", error);
        toast.error('Failed to update Medical Report');
      }
    }






  }

  const handleAddSkill = async () => {

    let formData = {
      skills: [...userData.skills, newSkill]
    }

    if (newSkill.length > 1) {

      try {

        const response = await axios.put(`http://localhost:5454/api/v1/userProfile/${profileId}`, formData)
        toast.success('Skill added')

        setNewSkill("")

      }
      catch (error) {
        console.log("Error adding skill")
        toast.success("Skill not added")
      }

    }



  }


  const handleSubmit2 = async (e)=>{
    e.preventDefault();

    let formData = {
      tenthMarks: e.target.marks10th.value,
      twelfthMarks: e.target.marks12th.value,
      gateScore: e.target.gateScore.value,
      jeeScore: e.target.jeeScore.value,
      summary:e.target.summary.value
    }

    try{
      const response = await axios.put(`http://localhost:5454/api/v1/userProfile/${profileId}`,formData)
      toast.success('Details updated')
    }
    catch(error){
      console.log(error);
      toast.error('Details not updated')
    }

  }

  const handleCreateProfile = async ()=>{
    try {


      let userData = {
        
          candidateId: user.id,
          name:user.name,
          designation: "",
          age: 18,
          location: "",
          email: user.email,
          summary: "",
          tenthMarks: "",
          twelfthMarks: "",
          gateScore: "",
          jeeScore: "",
          experience: "",
          education: "",
          skills: [],
          achievements: []
        
      }
      const response = await axios.post(`http://localhost:5454/api/v1/userProfile/createCandidateProfile`, userData)
      console.log(response)
      toast.success('Profile created')

    }
    catch(error){
      console.log(error.data)
      toast.error('Error creating profile')
    }
  }































  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card id="profile-summary">

          <div className='flex items-center justify-between p-4 '>

          <CardHeader id='#top'>
            <CardTitle>Profile & Summary</CardTitle>
          </CardHeader>


          {!profileId.length &&   <Button onClick={handleCreateProfile} className='bg-white text-black hover:bg-gray-50 hover:text-black'>Create Profile</Button> }

        
          </div>

          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-gray-600">{userData.designation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Age:</p>
                  <p>{userData.age}</p>
                </div>
                <div>
                  <p className="font-semibold">Location:</p>
                  <p>{userData.location}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{userData.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{userData.phoneNumber}</p>
                </div>
                <div>
                  <p className="font-semibold">Experience:</p>
                  <p>{userData.experience} years</p>
                </div>
                <div>
                  <p className="font-semibold">Education:</p>
                  <p>{userData.education}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Skills:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {userData?.skills?.map((skill, index) => (
                    <span key={index} className="bg-gray-800 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">Achievements:</p>
                <ul className="list-disc list-inside mt-1">
                  {userData?.achievements?.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Summary:</p>
                <p className="mt-1">{userData.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="edit-profile">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit1} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Full Name</Label>
                  <Input id="name" name="name" defaultValue={userData.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" name="designation" defaultValue={userData.designation} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" defaultValue={userData.age} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" defaultValue={userData.location} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input id="aadhar" minLength={12} maxLength={12} name="aadhar" placeholder="Aadhar Number" defaultValue={userData.aadharNumber} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" minLength={10} name="phoneNumber" maxLength={10} placeholder="Phone Number" defaultValue={userData.phoneNumber} />
                </div>

              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='experience' >Experience</Label>
                  <Input id='experience' type='number' name='experience' placeholder='Experience in years' defaultValue={userData.experience} />
                </div>

                <div>
                  <Label htmlFor='education' >Education</Label>
                  <Input id='education' name='education' placeholder='College name' defaultValue={userData.education} />

                </div>

              </div>


              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                {resumeFile && <span className='p-2 text-sm text-blue-800'>{resumeFile}</span>}
                <Input id="resume" type="file" accept=".pdf" />
              </div>
              <Button className='bg-gray-800 text-white' type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>





        <Card id="medical-report">
          <CardHeader>
            <CardTitle>Medical Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMedicalReport}>
              <div className="space-y-2">
                <Label htmlFor="medicalReport">Upload Medical Report</Label>
                {medicalFile && <span className='p-2 text-sm text-blue-800'>{medicalFile}</span>}
                <Input id="medicalReport" type="file" accept=".pdf" />
              </div>
              <Button type='submit' className="mt-4" >Submit Medical Report</Button>
            </form>
          </CardContent>
        </Card>



        <Card id="skills-achievements">
          <CardHeader>
            <CardTitle>Skills & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newSkill">Add Skill</Label>
                <div className="flex space-x-2">
                  <Input
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter a skill"
                  />
                  <Button className='bg-gray-800 text-white' onClick={handleAddSkill} >Add</Button>
                </div>
              </div>
              <div>
                <Label>Skills</Label>
                <ul className="list-disc list-inside flex gap-4">
                  {userData?.skills?.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleSubmit2}>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marks10th">10th Marks</Label>
                    <Input id="marks10th" name="marks10th" defaultValue={userData.tenthMarks} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marks12th">12th Marks</Label>
                    <Input id="marks12th" name="marks12th" defaultValue={userData.twelfthMarks} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 ">
                  <div className="space-y-2">
                    <Label htmlFor="gateScore">GATE Score</Label>
                    <Input id="gateScore" name="gateScore" defaultValue={userData.gateScore} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jeeScore">JEE Score</Label>
                    <Input id="jeeScore" name="jeeScore" defaultValue={userData.jeeScore} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <textarea
                    id="summary"
                    name="summary"
                    rows={4}
                    className="w-full border rounded-md px-3 py-2"
                    defaultValue={userData.summary}
                    placeholder="Enter a brief summary..."
                  />
                </div>

                <Button className='hover:bg-gray-800' type='submit'>Save Details</Button>

              </form>


            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

