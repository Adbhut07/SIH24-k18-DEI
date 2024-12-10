'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Edit3, CheckCircle, Clock, ArrowLeft, Save } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import axios from 'axios';
import toast from 'react-hot-toast';

const INTERVIEW_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

type InterviewStatus = keyof typeof INTERVIEW_STATUS;

const EditInterview = () => {
  const { id } = useParams();
  const router = useRouter();


  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [time,setTime] = useState('');
  const [date,setDate] = useState<Date | undefined>(undefined)


  const getDateinIso = (date:Date,time:String)=>{
    const [hours, minutes] = time.split(":").map(Number);
   const date_ = new Date(date)
   date_.setHours(hours,minutes,0,0)
   const isoDate = date_.toISOString();
   return isoDate
  
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isoDate = getDateinIso(date,time)



    const rawData = {
        title:title,
        description:description,
        scheduledAt:isoDate
    }

    console.log(rawData)
    
    try {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/interview/interview-update/${id}`,rawData,{
            withCredentials:true
        })

        toast.success('Interview detailed updated')
        
      
      router.push('/dashboard-admin');
    } catch (error) {
        toast.error('Details not updated')
    }
  };


  return (
    <div className="flex justify-center items-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl py-10"
    >
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit Interview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter interview title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter interview description"
                rows={4}
              />
            </div>

            <div>
  <div>
    <Label htmlFor="date-picker">Date</Label>
    <div className="mt-1 flex items-center justify-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        id="date-picker"
      />
    </div>
  </div>

  <div>
    <Label htmlFor="time-picker">Time</Label>
    <Input
      type="time"
      id="time-picker"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      className="mt-1"
    />
  </div>

  {date && time && (
    <div className="text-sm text-muted-foreground">
      Selected: {date.toDateString()} {time}
    </div>
  )}
</div>





            

            

            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
    </div>
  );
};

export default EditInterview;