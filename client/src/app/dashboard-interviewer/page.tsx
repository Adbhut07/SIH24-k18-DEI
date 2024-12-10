'use client';
import { Navbar } from "@/components/interviewer/navbar"

import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";
import { useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import UpcomingInterviewsCard from "@/components/interviewer/upcoming-interviews-card";
import { TaskManagementSection } from "@/components/interviewer/task-management-section";
import { CollaborationFeatures } from "@/components/interviewer/collaboration-features";
import { PastInterviewsCard } from "@/components/interviewer/past-interviews-card";
import { FeedbackAndNotesSection } from "@/components/interviewer/feedback-and-notes-section";
import ProfileCard from "@/components/interviewer/profile-card";
import axios from "axios";
import { get } from "axios";
import { set } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  console.log(user)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
    } else if (user.role == 'CANDIDATE') {
      router.push('/no-access');
    }
  }, [user, router]); // Re-run the effect when `user` or `router` changes

  // You can render a loading spinner or a placeholder here while checking authentication and role.


  const [interviews,setInterviews] = useState([])
  const [userProfile,setUserProfile] = useState({})


  const getAllInterviews =  async ()=>{

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/interviewer/getInterviews/${user.id}`,{withCredentials:true})
    console.log(response?.data?.data)
    setInterviews(response?.data?.data)
  }

  const getUserProfile = async ()=>{

    try{

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/userProfile/${user.email}`,{withCredentials:true})
      setUserProfile(response?.data?.data)

    }
    catch(error){
      console.log(error)
    }

  }



 
  useEffect(()=>{

    getAllInterviews();
    getUserProfile();

  },[])

  


  return (
    <div className="min-h-screen bg-background bg-gray-200">
      <Navbar />
      <main className="container mx-auto p-8 space-y-6">


        <div className="flex w-full gap-4 p-4 h-auto ">

          <ProfileCard
            name={user?.name || ""}
            skills={userProfile?.skills || []}
            totalInterviews={150}
            profilePicture={user?.image ||""}
            status="Available"
            rating={4.8}
            department={userProfile?.designation || ""}
          />

          <UpcomingInterviewsCard interviews = {interviews} />

        </div>
        <PastInterviewsCard interviews = {interviews} />

        <div className="grid gap-6 md:grid-cols-2 ">
          <TaskManagementSection />
          <CollaborationFeatures />
        </div>
        <FeedbackAndNotesSection />
      </main>
    </div>
  )



}

